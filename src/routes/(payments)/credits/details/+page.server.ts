import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {
        custom: {
            title: 'Detaylar',
            nexturl: '/credits/payment',
            step: 2
        }
    };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    // Process your object here
    return {
      success: true,
      data: {
        selectedPackageId: formData.get('selectedPackageId')
      }
    };
  }
};