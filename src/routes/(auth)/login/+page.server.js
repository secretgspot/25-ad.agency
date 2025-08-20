import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const password = data.get('password');

		const correctPassword = env.PASSWORD;
		const sessionToken = env.SESSION_TOKEN;

		if (password === correctPassword) {
			cookies.set('session', sessionToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 30 // 30 days
			});
			throw redirect(303, '/');
		} else {
			return fail(401, { message: 'Invalid password' });
		}
	}
};