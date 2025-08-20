import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { ads } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function OPTIONS() {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
}

export async function POST({ params }) {
	const { id } = params;

	try {
		const result = await db.update(ads)
			.set({ clicks: sql`${ads.clicks} + 1` })
			.where(eq(ads.id, id))
			.run();

		if (result.changes === 0) {
			return json({ message: `Ad with id ${id} not found` }, { status: 404 });
		}

		return json({ message: 'Click counted' }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
	} catch (err) {
		console.error('Unexpected error processing click:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
	}
}
