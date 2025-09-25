import { decode } from 'punycode';
import type { PageServerLoad, Actions } from './$types';
import type { Package } from '../credits/types';
import { verifyNestpayHashV3 } from '$lib/netspay-hash';
import { 
    TEST_NESTPAY_STORE_KEY,
    LIVE_NESTPAY_STORE_KEY,
    IS_TESTING
} from '$env/static/private';
import { dev } from '$app/environment';

export const load = (async () => {
    return {
        custom: {
            title: 'Ödeme Başarılı',
            nexturl: null,
            step: 4
        }
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({ request, fetch }) => {
        const formData = await request.formData();
        console.log('Payment Success Form Data:', Object.fromEntries(formData.entries()));

        // Determine which store key to use based on environment
        let storeKey: string;
        if (dev) {
            storeKey = TEST_NESTPAY_STORE_KEY;
        } else {
            storeKey = IS_TESTING === 'true' ? TEST_NESTPAY_STORE_KEY : LIVE_NESTPAY_STORE_KEY;
        }

        // Convert form data to parameters object for hash verification
        const responseParameters: Record<string, string> = {};
        formData.forEach((value, key) => {
            responseParameters[key] = value.toString();
        });

        // Verify hash if present
        const receivedHash = formData.get('HASH')?.toString() || formData.get('hash')?.toString();
        let isHashValid = false;
        
        if (receivedHash) {
            isHashValid = verifyNestpayHashV3(responseParameters, storeKey, receivedHash);
            console.log('Hash verification result:', isHashValid);
            
            if (!isHashValid) {
                console.warn('Hash verification failed! This response may not be from Netspay.');
                return {
                    result: {
                        success: false,
                        error: 'Hash verification failed',
                        data: responseParameters
                    }
                };
            }
        } else {
            console.warn('No hash found in response - unable to verify authenticity');
        }

        let Desc1 = formData.get('Desc1');
        let decoded = null;
        let packageInfo = null;
        if(Desc1) {
            const decodedRaw = decodeURIComponent(atob(Desc1.toString()));
            decoded = JSON.parse(decodedRaw);
        }

        if(decoded) {
            let packages = []
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
                    packageInfo = packages.find((pkg: Package) => pkg.id === decoded.selectedPackageId);
                }
            }
        }

        let formResult: Record<string, string> = {};
        formData.forEach((value, key) => {
            formResult[key] = value.toString();
        });
        console.log('Parsed Form Data:', formResult);

        let result = {
            success: true,
            data: formResult,
            decoded: decoded,
            packageInfo,
            hashValid: isHashValid
        }

        return { result };
    }
};