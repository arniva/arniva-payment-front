import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch }) => {

    let packages = []

    try {
        const packagesRes = await fetch('https://payment-api.arniva.tr/v1/paketler')
        if(packagesRes.ok) {
            const json = await packagesRes.json();
            if(json && json.code === 0 && json.data?.length) {
                packages = json.data.map((pkg: any) => ({
                    id: pkg.id,
                    amount: pkg.adet,
                    unitPrice: pkg.birimfiyat,
                    total: pkg.adet * pkg.birimfiyat,
                    type: pkg.tip
                }));
            }
        } else if(packagesRes) {
            const errorJson = await packagesRes.json();
            if(errorJson && (errorJson.code === 1 || errorJson.code === 2) && errorJson.message) {
                console.log("=========================2", errorJson.message);
            }
        }
    } catch(error) {
        console.log("======================")
        if(error instanceof Error) console.warn(error.message)
        console.log("======================")
    }


    return {
        title: 'E-Dönüşüm Paketleri',
        subtitle: 'Kontör Satın Alma İşlemleri',
        steps: [
            { title: 'Kontör Seç', url: '/credits', no: 1 },
            { title: 'Detaylar', url: '/credits/details', no: 2 },
            { title: 'Ödeme', url: '/credits/payment', no: 3 }
        ],
        packages: packages
    };
}) satisfies LayoutServerLoad;