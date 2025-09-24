import type { PageServerLoad } from './$types';
import { 
    TEST_NESTPAY_CLIENT_ID,
    TEST_NESTPAY_STORE_KEY,
    TEST_NESTPAY_GATEWAY_URL,
    NESTPAY_CURRENCY,
    NESTPAY_LANGUAGE,
    NESTPAY_STORE_TYPE,
    IS_TESTING
} from '$env/static/private';

export const load = (async ({ url }) => {
    // Generate unique order ID
    const oid = Date.now().toString();
    
    // Payment parameters
    const amount = "1.00"; // 1 Turkish Lira
    const currency = NESTPAY_CURRENCY; // 949 for TL
    const clientid = TEST_NESTPAY_CLIENT_ID;
    const storetype = NESTPAY_STORE_TYPE; // 3d_pay
    const islemtipi = "Auth";
    const lang = NESTPAY_LANGUAGE; // tr
    const rnd = Math.random().toString(36).substring(2, 15);
    
    // URLs for success and failure redirects
    const origin = url.origin;
    const okUrl = `${origin}/paymentsuccess`;
    const failUrl = `${origin}/paymenttest?status=failed`;
    
    // Hash will be calculated by the hash handler with all form parameters including card details
    
    return {
        paymentData: {
            clientid,
            storetype,
            hashAlgorithm: 'ver3',
            islemtipi,
            amount,
            currency,
            oid,
            okUrl,
            failUrl,
            lang,
            rnd,
            Instalment: '', // Required for Hash V3
            gatewayUrl: TEST_NESTPAY_GATEWAY_URL
        },
        testCards: [
            {
                type: "Visa",
                number: "4531444531442283",
                expiry: "12/26",
                cvv: "001",
                securePassword: "a"
            },
            {
                type: "MasterCard", 
                number: "5818775818772285",
                expiry: "12/26",
                cvv: "001",
                securePassword: "a"
            }
        ]
    };
}) satisfies PageServerLoad;