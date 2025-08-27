import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {
        custom: {
            title: 'Kontör',
            step: 1
        }
    };
}) satisfies PageServerLoad;