import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {
        custom: {
            title: 'Kontör Seçimi',
            nexturl: '/credits/detaylar',
            step: 1
        }
    };
}) satisfies PageServerLoad;