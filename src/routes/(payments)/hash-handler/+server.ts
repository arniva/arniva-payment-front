import type { RequestHandler } from './$types';
import { createNestpayHashV3 } from '$lib/netspay-hash';
import { 
    TEST_NESTPAY_STORE_KEY,
    LIVE_NESTPAY_STORE_KEY,
    TEST_NESTPAY_GATEWAY_URL,
    LIVE_NESTPAY_GATEWAY_URL,
    IS_TESTING
} from '$env/static/private';
import { dev } from '$app/environment';

export const POST: RequestHandler = async ({ request, url }) => {
    const formData = await request.formData();
    
    // Determine which store key and gateway to use
    let storeKey: string;
    let gatewayUrl: string;
    
    if (dev) {
        storeKey = TEST_NESTPAY_STORE_KEY;
        gatewayUrl = TEST_NESTPAY_GATEWAY_URL;
    } else {
        if (IS_TESTING === 'true') {
            storeKey = TEST_NESTPAY_STORE_KEY;
            gatewayUrl = TEST_NESTPAY_GATEWAY_URL;
        } else {
            storeKey = LIVE_NESTPAY_STORE_KEY;
            gatewayUrl = LIVE_NESTPAY_GATEWAY_URL;
        }
    }
    
    // Convert FormData to parameters object
    const parameters: Record<string, string> = {};
    formData.forEach((value, key) => {
        parameters[key] = value.toString();
    });
    
    console.log('All form parameters for hash:', parameters);
    
    // Calculate hash with ALL parameters (except encoding and hash)
    const hash = createNestpayHashV3(parameters, storeKey);
    
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