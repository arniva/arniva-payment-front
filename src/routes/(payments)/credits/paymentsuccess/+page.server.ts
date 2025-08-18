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