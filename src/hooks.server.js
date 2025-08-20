import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const sessionToken = env.SESSION_TOKEN;

	if (!sessionToken) {
		return resolve(event);
	}

	if (event.url.pathname.startsWith('/login')) {
		return resolve(event);
	}

	const storedSession = event.cookies.get('session');

	if (storedSession !== sessionToken) {
		throw redirect(307, '/login');
	}

	return resolve(event);
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
    console.error('Unhandled server error:', error, event);
    return {
        message: 'An unexpected error occurred',
        code: 'UNEXPECTED_ERROR'
    };
}
