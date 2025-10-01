import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
export const load = (async ({ cookies}) => {
    let auth = cookies.get('auth');
    console.log("auth", auth);
    if(!auth || auth !== 'true'){
        redirect(303, '/login');
    }
    return {};
}) satisfies LayoutServerLoad;