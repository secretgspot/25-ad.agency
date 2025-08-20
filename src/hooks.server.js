/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
    console.error('Unhandled server error:', error, event);
    return {
        message: 'An unexpected error occurred',
        code: 'UNEXPECTED_ERROR'
    };
}
