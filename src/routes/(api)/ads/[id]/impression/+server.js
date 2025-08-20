import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { ads } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST({ params }) {
	const { id } = params;

	try {
		const result = await db.update(ads)
			.set({ impressions: sql`${ads.impressions} + 1` })
			.where(eq(ads.id, id))
			.run();

		if (result.changes === 0) {
			return json({ message: `Ad with id ${id} not found` }, { status: 404 });
		}

		return json({ message: 'Impression counted' }, { status: 200 });
	} catch (err) {
		console.error('Unexpected error processing impression:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}
