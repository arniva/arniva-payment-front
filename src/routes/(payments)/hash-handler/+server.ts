import type { RequestHandler } from './$types';
import { createNestpayHashV3 } from '$lib/netspay-hash';
import { 
    TEST_NESTPAY_CLIENT_ID,
    TEST_NESTPAY_STORE_KEY,
    TEST_NESTPAY_GATEWAY_URL,
    LIVE_NESTPAY_CLIENT_ID,
    LIVE_NESTPAY_STORE_KEY,
    LIVE_NESTPAY_GATEWAY_URL,
    NESTPAY_CURRENCY,
    NESTPAY_LANGUAGE,
    NESTPAY_STORE_TYPE,
    IS_TESTING
} from '$env/static/private';
import { dev } from '$app/environment';

function decodePageData(encodedData: string | null) {  
    if (encodedData) {
        try {
            const pageData = JSON.parse(decodeURIComponent(atob(encodedData)));
            return pageData;
        } catch (error) {
            console.error('Failed to decode page data:', error);
        }
    }
    return null;
}

export const POST: RequestHandler = async ({ request, url }) => {
    const formData = await request.formData();
    
    // Determine environment-specific configuration
    let clientid: string;
    let storeKey: string;
    let gatewayUrl: string;
    let okUrl: string;
    let failUrl: string;
    
    if (dev) {
        clientid = TEST_NESTPAY_CLIENT_ID;
        storeKey = TEST_NESTPAY_STORE_KEY;
        gatewayUrl = TEST_NESTPAY_GATEWAY_URL;
        okUrl = `${url.origin}/paymentsuccess`;
        failUrl = `${url.origin}/credits/payment?status=failed`;
    } else {
        if (IS_TESTING === 'true') {
            clientid = TEST_NESTPAY_CLIENT_ID;
            storeKey = TEST_NESTPAY_STORE_KEY;
            gatewayUrl = TEST_NESTPAY_GATEWAY_URL;
        } else {
            clientid = LIVE_NESTPAY_CLIENT_ID;
            storeKey = LIVE_NESTPAY_STORE_KEY;
            gatewayUrl = LIVE_NESTPAY_GATEWAY_URL;
        }
        okUrl = 'https://odeme.arniva.tr/paymentsuccess';
        failUrl = 'https://odeme.arniva.tr/credits/payment?status=failed';
    }
    
    // Convert FormData to parameters object
    const parameters: Record<string, string> = {};
    formData.forEach((value, key) => {
        parameters[key] = value.toString();
    });
    
    console.log('All form parameters for hash:', parameters);
    
    // Extract and decode page data to get information needed for API call
    const encodedPageData = parameters.Desc1;
    const pageData = decodePageData(encodedPageData);
    
    if (!pageData) {
        console.error('Failed to decode page data from Desc1');
        return new Response('Invalid page data', { status: 400 });
    }
    
    console.log('Decoded page data:', pageData);
    
    // Fetch packages to get pricing information
    let packages = [];
    try {
        const packagesRes = await fetch('https://payment-api.arniva.tr/v1/paketler');
        if (packagesRes.ok) {
            const json = await packagesRes.json();
            if (json && json.code === 0 && json.data?.length) {
                packages = json.data.map((pkg: any) => ({
                    id: pkg.id,
                    amount: pkg.adet,
                    unitPrice: pkg.birimfiyat,
                    total: pkg.adet * pkg.birimfiyat
                }));
            }
        }
    } catch (error) {
        console.error('Failed to fetch packages:', error);
        return new Response('Failed to fetch package information', { status: 500 });
    }
    
    // Find selected package
    const selectedPackage = packages.find((pkg: any) => pkg.id === pageData.selectedPackageId);
    if (!selectedPackage) {
        console.error('Selected package not found:', pageData.selectedPackageId);
        return new Response('Invalid package selection', { status: 400 });
    }
    
    // Generate dynamic payment parameters
    const amount = selectedPackage.total.toFixed(2);
    const currency = NESTPAY_CURRENCY; // 949 for TL
    const storetype = NESTPAY_STORE_TYPE; // 3d_pay
    const islemtipi = "Auth";
    const lang = NESTPAY_LANGUAGE; // tr
    const rnd = Math.random().toString(36).substring(2, 15);
    const callbackUrl = 'https://payment-api.arniva.tr/v1/callback';
    
    // Get installment from form data, default to 1 if not provided
    const installment = parameters.Instalment ? parseInt(parameters.Instalment) : 1;
    
    // Validate card number exists
    if (!parameters.pan || parameters.pan.length < 4) {
        console.error('Invalid card number provided');
        return new Response('Invalid card number', { status: 400 });
    }
    
    // Prepare API call to get oid
    const postBody = {
        vtc: pageData.vkn,
        unvan: pageData.unvan,
        aciklama: pageData.description,
        paket_id: pageData.selectedPackageId,
        taksit: installment,
        kart4: Number(String(parameters.pan).slice(-4)),
        kartsahibi: parameters.BillToName,
        adres: pageData.adres,
        il: pageData.il,
        ilce: pageData.ilce
    };
    
    // Validate required fields
    const requiredFields = ['vtc', 'unvan', 'paket_id', 'kartsahibi', 'adres', 'il', 'ilce'];
    const missingFields = requiredFields.filter(field => !postBody[field as keyof typeof postBody]);
    
    if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        return new Response(`Missing required fields: ${missingFields.join(', ')}`, { status: 400 });
    }
    
    console.log('API request body:', postBody);
    
    try {
        // Make API call to get oid
        const postRes = await fetch('https://payment-api.arniva.tr/v1/hareketler', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        });
        
        console.log('Post response status:', postRes.status);
        
        if (!postRes.ok) {
            console.error('API call failed with status:', postRes.status);
            return new Response('API call failed', { status: 500 });
        }
        
        const result = await postRes.json();
        console.log('Post response data:', result);
        
        if (result && result.code === 0 && result.data?.id) {
            // Update all payment parameters with dynamic values
            parameters.oid = result.data.id.toString();
            parameters.clientid = clientid;
            parameters.storetype = storetype;
            parameters.hashAlgorithm = 'ver3';
            parameters.TranType = islemtipi;
            parameters.amount = amount;
            parameters.currency = currency;
            parameters.okurl = okUrl;
            parameters.failUrl = failUrl;
            parameters.lang = lang;
            parameters.rnd = rnd;
            parameters.callbackUrl = callbackUrl;
            // Instalment is already in parameters from form data
            
            console.log('Updated payment parameters:', {
                oid: parameters.oid,
                amount: parameters.amount,
                currency: parameters.currency
            });
        } else {
            console.error('Invalid API response:', result);
            return new Response(result.message || 'Failed to get transaction ID', { status: 400 });
        }
    } catch (error) {
        console.error('API call error:', error);
        return new Response('API call error', { status: 500 });
    }
    
    // Calculate hash with ALL parameters (except encoding and hash)
    const hash = createNestpayHashV3(parameters, storeKey);
    
console.log('====================================================');
console.log('=== FINAL PARAMETERS + HASH BEFORE NETSPAY SUBMIT ===');
console.log('Parameters:', parameters);
console.log('Hash:', hash);
console.log('====================================================');

    // Check if this is a minimal redirect (for seamless experience)
    const seamless = url.searchParams.get('seamless') === 'true';
    
    if (seamless) {
        // Generate minimal HTML with faster auto-submit
        const html = `<!DOCTYPE html>
<html><head><title>Processing...</title></head>
<body>
<form name="f" method="post" action="${gatewayUrl}">
${Object.entries(parameters).map(([key, value]) => 
    `<input type="hidden" name="${key}" value="${value.replace(/"/g, '&quot;')}">`
).join('')}
<input type="hidden" name="HASH" value="${hash}">
</form>
<script>document.f.submit()</script>
</body></html>`;
        
        return new Response(html, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
    
    // Generate HTML form that auto-submits to Netspay
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Redirecting to Payment Gateway...</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body onload="document.payForm.submit();">
    <div>
        <div class="spinner"></div>
        <p>Redirecting to payment gateway...</p>
        <p><small>If you are not redirected automatically, please click the button below.</small></p>
    </div>
    
    <form name="payForm" method="post" action="${gatewayUrl}">
        ${Object.entries(parameters).map(([key, value]) => 
            `<input type="hidden" name="${key}" value="${value.replace(/"/g, '&quot;')}" />`
        ).join('\n        ')}
        <input type="hidden" name="HASH" value="${hash}" />
        
        <div style="margin-top: 20px;">
            <input type="submit" value="Continue to Payment" style="padding: 10px 20px; font-size: 16px; background-color: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;" />
        </div>
    </form>
</body>
</html>`;

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
};