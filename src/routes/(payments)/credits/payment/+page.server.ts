import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Package } from '../types';

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
    return {
        urlData,
        custom: {
            title: 'Ödeme',
            step: 3,
            urlRawData
        }
    };
}) satisfies PageServerLoad;

export const actions = {

  pay: async ({ request }) => {
    const formData = await request.formData();
    const encodedPageDataRaw = formData.get('encoded');
    const encodedPageData = decodeFormData(encodedPageDataRaw as string | null);

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
      }
    }

    if(!encodedPageData) {
      redirect(302, '/credits');
    }

    const price = packages.find((pkg: Package) => pkg.id === encodedPageData.selectedPackageId)?.total || 0;

    const cardBody = {
      name: formData.get('name'),
      no: formData.get('no'),
      cvc: formData.get('cvc'),
      validUntilMonth: formData.get('validUntilMonth'),
      validUntilYear: formData.get('validUntilYear'),
      price: price,
      installment: formData.get('installment')
    }

    const allFieldsFilled = Object.values(cardBody).every(value => value);


    if (!allFieldsFilled) {
      return {
        success: false,
        message: 'Eksik alanlar var, lütfen doldurunuz.',
        data: {
          cardBody,
          encodedPageData
        }
      };
    }


  //   // TODO: Api'ye gönderilip, yanıt bekelenecek

    const postBody = {
      vtc: encodedPageData.vkn,
      unvan: encodedPageData.unvan,
      aciklama: encodedPageData.description,
      paket_id: encodedPageData.selectedPackageId,
      taksit: Number(cardBody.installment) || 0,
      kart4: Number(String(formData.get('no')).slice(-4)),
      kartsahibi: formData.get('name'),
      adres: encodedPageData.adres,
      il: encodedPageData.il,
      ilce: encodedPageData.ilce,
    }

    const requiredFields = ['vtc', 'unvan', 'paket_id', 'kart4', 'kartsahibi', 'adres', 'il', 'ilce'];

    const allFieldsValid = (requiredFields as Array<keyof typeof postBody>).every(field => postBody[field] !== undefined && postBody[field] !== null && (typeof postBody[field] === 'number' || postBody[field] !== ''));

    if (!allFieldsValid) {
      return {
        success: false,
        message: 'Lütfen tüm alanları kontrol edin ve tekrar deneyin.',
        data: {
          cardBody,
          encodedPageData
        }
      };
    }


    const postRes = await fetch('https://payment-api.arniva.tr/v1/hareketler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody)
    });
    if (postRes.ok) {
      const json = await postRes.json();
      if (json && json.code === 0) {
        redirect(302, '/credits/paymentsuccess')
      } else {
        return {
          success: false,
          message: json.message || 'Ödeme işlemi başarısız',
          data: {
            cardBody,
            encodedPageData
          }
        };
      }
    } else {
      return {
        success: false,
        message: 'Ödeme API çağrısı başarısız',
        data: {
          cardBody,
          encodedPageData
        }
      };
    }
  }
}