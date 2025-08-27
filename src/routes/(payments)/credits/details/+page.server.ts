import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

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

export const load = (async ({ url, parent }) => {
    let packageId = url.searchParams.get('packageid');
    const rawData = url.searchParams.get('data');
    const encodedData = decodeFormData(rawData);
    if(!packageId && encodedData) {
        packageId = encodedData.selectedPackageId;
    }
    const { packages } = await parent();
    
    
    const selectedPackage = packages.find((pkg: typeof packages[number]) => pkg.id === packageId);
    
    if(!selectedPackage) redirect(302, '/credits')
    


    return {
        custom: {
            title: 'Detaylar',
            step: 2
        },
        selectedPackage,
        encodedData
    };
}) satisfies PageServerLoad;