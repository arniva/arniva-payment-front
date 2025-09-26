import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Package } from '../types';
import { getPaymentErrorMessage } from './functions.svelte'

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
    const urlRawData = url.searchParams.get('data');
    const urlData = decodeFormData(urlRawData);
    const status = url.searchParams.get('status');
    const errorMessage = url.searchParams.get('error');

    const { packages } = await parent();
    
    // Check if this is a failed payment return
    let paymentError = null;
    if (status === 'failed') {
        paymentError = {
            message: errorMessage ? decodeURIComponent(errorMessage) : 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.',
            show: true
        };
    }
    
    return {
        urlData,
        custom: {
            title: 'Ödeme',
            step: 3,
            urlRawData
        },
        paymentError
    };
}) satisfies PageServerLoad;



export const actions: Actions = {
    default: async ({ request, url }) => {
        const formData = await request.formData();
        const status = url.searchParams.get('status');
        
        if(status === 'failed') {
            // console.log("===================")
            // console.log('Payment failed, form data:', Object.fromEntries(formData.entries()));
            // console.log("===================")
            
            let Desc1 = formData.get('Desc1');
            const errorMessage = getPaymentErrorMessage(formData);

            if(Desc1) {
                redirect(302, `/credits/payment?data=${encodeURIComponent(Desc1 as string)}&status=failed&error=${encodeURIComponent(errorMessage)}`);
            }
            
            // Return error state instead of redirecting
            return {
                success: false,
                error: true,
                message: 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.',
                formData: Object.fromEntries(formData.entries())
            };
        }
        
        // For successful payments, redirect to success page
        return { success: true };
    }
};
