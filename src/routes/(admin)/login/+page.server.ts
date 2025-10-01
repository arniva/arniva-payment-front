import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

// Async function with setTimeout to simulate delay
function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const actions: Actions = {
    default: async ({ cookies, request }) => {
        const formData = await request.formData();
        const password = formData.get('password');
        const username = formData.get('username');
        console.log(password, username);
        if (password === '12345' && username === 'arnivaadmin') {
            cookies.set('auth', 'true', {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            await delay(1000); // Simulate a delay of 1 second
            redirect(303, '/admin');
        } else {
            return {
                status: 400,
                errors: {
                    message: 'Hatalı giriş'
                }
            };
        }

        return {
            status: 303,
            headers: {
                location: '/admin'
            }
        };
    }
};