import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
    return {
        custom: {
            title: 'Ödeme',
            nexturl: '/',
            step: 3
        }
    };
}) satisfies PageServerLoad;

export const actions = {
  next: async ({ request }) => {
    const formData = await request.formData();
    // Process your object here
    return {
      success: true,
      data: {
        selectedPackageId: formData.get('selectedPackageId'),
        vkn: formData.get('vkn'),
        unvan: formData.get('unvan'),
        description: formData.get('description')
      }
    };
  },
  pay: async ({ request, fetch }) => {
    const formData = await request.formData();
    const selectedPackageId = formData.get('selectedPackageId');
    

    let packages = []

    const packagesRes = await fetch('https://payment-api.arniva.tr/v1/paketler')

    if(packagesRes.ok) {
        const json = await packagesRes.json();
        if(json && json.code === 0 && json.data?.length) {
            packages = json.data.map((pkg: any) => ({
                id: pkg.id,
                amount: pkg.adet,
                unitPrice: pkg.birimfiyat,
                total: pkg.adet * pkg.birimfiyat
            }));
        }
    }

    const price = packages.find(pkg => pkg.id === selectedPackageId)?.total || 0;

    const cardBody = {
      no: formData.get('no'),
      cvc: formData.get('cvc'),
      validUntilMonth: formData.get('validUntilMonth'),
      validUntilYear: formData.get('validUntilYear'),
      price: price
    }
    // Check all fields
    const allFieldsFilled = Object.values(cardBody).every(value => value);

    if (!allFieldsFilled) {
      return {
        success: false,
        error: 'All fields are required'
      };
    }

    // TODO: Api'ye gönderilip, yanıt bekelenecek

    const postBody = {
      vtc: formData.get('vkn'),
      unvan: formData.get('unvan'),
      aciklama: formData.get('description'),
      paket_id: selectedPackageId,
      taksit: 0,
      kart4: Number(String(formData.get('no')).slice(-4)),
      kartsahibi: formData.get('name'),
    }
    

    const allFieldsValid = Object.values(postBody).every(value => value !== undefined && value !== null && (typeof value === 'number' || value !== ''));
    if (!allFieldsValid) {
      return {
        success: false,
        error: 'All fields are required'
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
        // return {
        //   success: true,
        //   message: 'Ödeme başarılı',
        //   data: json.data
        // };
      } else {
        return {
          success: false,
          error: json.message || 'Ödeme işlemi başarısız'
        };
      }
    } else {
      return {
        success: false,
        error: 'Ödeme API çağrısı başarısız'
      };
    }
    
  }
};