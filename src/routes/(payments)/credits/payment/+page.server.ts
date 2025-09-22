import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Package } from '../types';
import crypto from 'crypto';
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

export const load = (async ({ url }) => {    
  const urlRawData = url.searchParams.get('data');
  const urlData = decodeFormData(urlRawData);

    // Generate unique order ID
    const oid = Date.now().toString();
    
    // Payment parameters
    const amount = "1.00"; // 1 Turkish Lira
    const currency = NESTPAY_CURRENCY; // 949 for TL
    
    // Determine environment variables based on dev/prod and IS_TESTING
    let clientid: string;
    let storekey: string;
    let gatewayUrl: string;
    
    if (dev) {
        // Production: always use live variables
        clientid = TEST_NESTPAY_CLIENT_ID;
        storekey = TEST_NESTPAY_STORE_KEY;
        gatewayUrl = TEST_NESTPAY_GATEWAY_URL;
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
    }
    
    const storetype = NESTPAY_STORE_TYPE; // 3d_pay
    const islemtipi = "Auth";
    const lang = NESTPAY_LANGUAGE; // tr
    const rnd = Math.random().toString(36).substring(2, 15);
    
    // URLs for success and failure redirects
    const origin = url.origin;
    const okUrl = `${origin}/paymentsuccess`;
    const failUrl = `${origin}/credits/payment?status=failed`;
    
    // Create hash for authentication
    // plaintext = clientid + oid + amount + okurl + failurl + transactiontype + instalment + rnd + storekey
    const plaintext = clientid + oid + amount + okUrl + failUrl + islemtipi + "" + rnd + storekey;
    const hash = crypto.createHash('sha256').update(plaintext).digest('base64');

    return {
        urlData,
        paymentData: {
            clientid,
            storetype,
            hash,
            islemtipi,
            amount,
            currency,
            oid,
            okUrl,
            failUrl,
            lang,
            rnd,
            gatewayUrl: gatewayUrl
        },
        custom: {
            title: 'Ödeme',
            step: 3,
            urlRawData
        }
    };
}) satisfies PageServerLoad;



export const actions: Actions = {
    default: async ({ request, url }) => {
        console.log("________________________Payment Action Triggered");
        const formData = await request.formData();
        console.log('Payment Form Data:', Object.fromEntries(formData.entries()));

        const status = url.searchParams.get('status');
        console.log("Payment Status:", status);
        console.log("________________________");
        if(status === 'failed') {

          let Desc1 = formData.get('Desc1');
          if(Desc1) {
              const urlData = decodeFormData(Desc1);
              console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
              console.log("Decoded Desc1 on Failure:", urlData);
              console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
              return {
                  success: false,
                  urlData,
                  message: 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.'
              };
          }
          return {
              success: false,
              message: 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.'
          };
      }
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