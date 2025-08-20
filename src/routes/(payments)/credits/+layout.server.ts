import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch }) => {

    let packages = []

    const packagesRes = await fetch('https://payment-api.arniva.tr/v1/paketler')
    console.log("Fetching packages...", packagesRes);
    if(packagesRes.ok) {
        console.log("=========================1")
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
        if(errorJson && (errorJson.code === 1 || errorJson.code === 2) && errorJson.message)
        console.log("=========================2", errorJson.message);
    }

    return {
        title: 'E-Dönüşüm Paketleri',
        subtitle: 'Kontör Satın Alma İşlemleri',
        steps: [
            { title: 'Kontör Seçimi', url: '/credits' },
            { title: 'Detaylar', url: '/credits/details' },
            { title: 'Ödeme', url: '/credits/payment' }
        ],
        packages: packages
    };
}) satisfies LayoutServerLoad;