import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Package } from '../types';
import { dev } from '$app/environment';
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

function decodeFormData(d: string | null) {  
  if (d) {
    try {
      const formData = JSON.parse(decodeURIComponent(atob(d)));
      return formData;
    } catch (error) {
      console.error('Failed to decode form data:', error);
    }
  }
  return null;
}

export const load = (async ({ url, parent }) => {
    // TODO: Fail olduğundaki senaryoya da bakmak lazım. Aşağıda form actions ile bağlantılı.
    // Şu anda credits sayfasına redirect yapıyor. çünkü amount bilgisi için package bilgisine ihtiyaç var.
    const urlRawData = url.searchParams.get('data');
    const urlData = decodeFormData(urlRawData);
    const status = url.searchParams.get('status');

    const { packages } = await parent();

    // if(!packages || !urlData || !urlData.selectedPackageId) {
    //   redirect(302, '/credits');
    // }
    
    let selectedPackage = packages.find((pkg: Package) => pkg.id === urlData?.selectedPackageId) || null;
    // if(!selectedPackage) {
    //     redirect(302, '/credits');
    // }
    
    // Check if this is a failed payment return
    let paymentError = null;
    if (status === 'failed') {
        paymentError = {
            message: 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.',
            show: true
        };
    }
    
    // console.log("selectedPackage:", selectedPackage);
    const oid = Date.now().toString();
    
    // Payment parameters
    const amount = selectedPackage?.total?.toFixed(2); // 1 Turkish Lira
    const currency = NESTPAY_CURRENCY; // 949 for TL
    
    // Determine environment variables based on dev/prod and IS_TESTING
    let clientid: string;
    let storekey: string;
    let gatewayUrl: string;
    let okUrl: string;
    let failUrl: string;


    if (dev) {
        // Production: always use live variables
        clientid = TEST_NESTPAY_CLIENT_ID;
        storekey = TEST_NESTPAY_STORE_KEY;
        gatewayUrl = TEST_NESTPAY_GATEWAY_URL;
        okUrl = `${url.origin}/paymentsuccess`;
        failUrl = `${url.origin}/credits/payment?status=failed`;
    } else {
        // Development: use test if IS_TESTING is true, else live
        if (IS_TESTING === 'true') {
            clientid = TEST_NESTPAY_CLIENT_ID;
            storekey = TEST_NESTPAY_STORE_KEY;
            gatewayUrl = TEST_NESTPAY_GATEWAY_URL;
        } else {
            clientid = LIVE_NESTPAY_CLIENT_ID;
            storekey = LIVE_NESTPAY_STORE_KEY;
            gatewayUrl = LIVE_NESTPAY_GATEWAY_URL;
        }
        okUrl = 'https://odeme.arniva.tr/paymentsuccess';
        failUrl = 'https://odeme.arniva.tr/credits/payment?status=failed';
    }
    
    const storetype = NESTPAY_STORE_TYPE; // 3d_pay
    const islemtipi = "Auth";
    const lang = NESTPAY_LANGUAGE; // tr
    const rnd = Math.random().toString(36).substring(2, 15);
    
    // URLs for success and failure redirects
    // const origin = url.origin;
    // const okUrl = dev ? `${origin}/paymentsuccess` : 'https://odeme.arniva.tr/paymentsuccess';
    // const failUrl = dev ? `${origin}/credits/payment?status=failed` : 'https://odeme.arniva.tr/credits/payment?status=failed';
    
    // Hash will be calculated by the hash handler with all form parameters including card details
    
    return {
        urlData,
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
            callbackUrl: 'https://payment-api.arniva.tr/v1/callback',
            lang,
            rnd,
            Instalment: '', // Required for Hash V3
            gatewayUrl: gatewayUrl
        },
        custom: {
            title: 'Ödeme',
            step: 3,
            urlRawData
        },
        paymentError
    };
}) satisfies PageServerLoad;



export const actions: Actions = {
    default: async ({ request, url }) => {
        const formData = await request.formData();
        const status = url.searchParams.get('status');
        
        if(status === 'failed') {
            console.log('Payment failed, form data:', Object.fromEntries(formData.entries()));
            
            let Desc1 = formData.get('Desc1');
            let urlData = null;
            
            if(Desc1) {
                redirect(302, `/credits/payment?data=${encodeURIComponent(Desc1 as string)}&status=failed`);
                // urlData = decodeFormData(Desc1.toString());
                // console.log("Payment failed, decoded Desc1:", urlData);
            }
            
            // Return error state instead of redirecting
            return {
                success: false,
                urlData,
                error: true,
                message: 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.',
                formData: Object.fromEntries(formData.entries())
            };
        }
        
        // For successful payments, redirect to success page
        return { success: true };
    }
};




// export const actions = {
//   // TODO: Form submit URL'si içinde query parameter ile data yok. 
//   // Normalde sorun olmuyor, çünkü bu form response ile gönderiliyor.
//   // Ama sayfa yenilendiğinde bu data kayboluyor. Bu yüzden bunu bir kontrol etmemiz lazım, ve one göre ya eklememiz,
//   // ya da kullanıcıyı başka yere yönlendirmemiz lazım.
//   pay: async ({ request }) => {
//     const formData = await request.formData();
//     const encodedPageDataRaw = formData.get('encoded');
//     const encodedPageData = decodeFormData(encodedPageDataRaw as string | null);

//     let packages = []
//     const packagesRes = await fetch('https://payment-api.arniva.tr/v1/paketler');
//     if (packagesRes.ok) {
//       const json = await packagesRes.json();
//       if (json && json.code === 0 && json.data?.length) {
//         packages = json.data.map((pkg: any) => ({
//           id: pkg.id,
//           amount: pkg.adet,
//           unitPrice: pkg.birimfiyat,
//           total: pkg.adet * pkg.birimfiyat
//         }));
//       }
//     }

//     if(!encodedPageData) {
//       redirect(302, '/credits');
//     }

//     const price = packages.find((pkg: Package) => pkg.id === encodedPageData.selectedPackageId)?.total || 0;

//     const cardBody = {
//       name: formData.get('name'),
//       no: formData.get('no'),
//       cvc: formData.get('cvc'),
//       validUntilMonth: formData.get('validUntilMonth'),
//       validUntilYear: formData.get('validUntilYear'),
//       price: price,
//       installment: formData.get('installment')
//     }

//     const allFieldsFilled = Object.values(cardBody).every(value => value);


//     if (!allFieldsFilled) {
//       return {
//         success: false,
//         message: 'Eksik alanlar var, lütfen doldurunuz.',
//         data: {
//           cardBody,
//           encodedPageData
//         }
//       };
//     }


//   //   // TODO: Api'ye gönderilip, yanıt bekelenecek

//     const postBody = {
//       vtc: encodedPageData.vkn,
//       unvan: encodedPageData.unvan,
//       aciklama: encodedPageData.description,
//       paket_id: encodedPageData.selectedPackageId,
//       taksit: Number(cardBody.installment) || 0,
//       kart4: Number(String(formData.get('no')).slice(-4)),
//       kartsahibi: formData.get('name'),
//       adres: encodedPageData.adres,
//       il: encodedPageData.il,
//       ilce: encodedPageData.ilce,
//     }

//     const requiredFields = ['vtc', 'unvan', 'paket_id', 'kart4', 'kartsahibi', 'adres', 'il', 'ilce'];

//     const allFieldsValid = (requiredFields as Array<keyof typeof postBody>).every(field => postBody[field] !== undefined && postBody[field] !== null && (typeof postBody[field] === 'number' || postBody[field] !== ''));

//     if (!allFieldsValid) {
//       return {
//         success: false,
//         message: 'Lütfen tüm alanları kontrol edin ve tekrar deneyin.',
//         data: {
//           cardBody,
//           encodedPageData
//         }
//       };
//     }


//     const postRes = await fetch('https://payment-api.arniva.tr/v1/hareketler', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(postBody)
//     });
//     if (postRes.ok) {
//       const json = await postRes.json();
//       if (json && json.code === 0) {
//         redirect(302, '/credits/paymentsuccess')
//       } else {
//         return {
//           success: false,
//           message: json.message || 'Ödeme işlemi başarısız',
//           data: {
//             cardBody,
//             encodedPageData
//           }
//         };
//       }
//     } else {
//       return {
//         success: false,
//         message: 'Ödeme API çağrısı başarısız',
//         data: {
//           cardBody,
//           encodedPageData
//         }
//       };
//     }
//   }
// }