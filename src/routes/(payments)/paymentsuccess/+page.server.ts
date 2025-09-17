import { decode } from 'punycode';
import type { PageServerLoad } from './$types';

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

        let Desc1 = formData.get('Desc1');
        let decoded = null;
        let saveResult = false;
        let packageInfo = null;
        if(Desc1) {
            const decodedRaw = decodeURIComponent(atob(Desc1.toString()));
            decoded = JSON.parse(decodedRaw);
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
            console.log("Decoded Desc1:", decoded);
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

            const postBody = {
                vtc: decoded.vkn,
                unvan: decoded.unvan,
                aciklama: decoded.description,
                paket_id: decoded.selectedPackageId,
                taksit: 1,
                kart4: Number(String(formData.get('MaskedPan')).slice(-4)),
                kartsahibi: formData.get('firmaadi'),
                adres: decoded.adres,
                il: decoded.il,
                ilce: decoded.ilce,
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
                    saveResult = true;
                } else {
                    saveResult = false;
                }
            } else {
                saveResult = false;
            }
        }

        if(saveResult) {
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

        let formResult = {};
        formData.forEach((value, key) => {
            formResult[key] = value;
        });
        console.log('Parsed Form Data:', formResult);

        let result = {
            success: true,
            data: formResult,
            decoded: decoded,
            saveResult,
            packageInfo
        }

        return { result };
    }
};