import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { ads } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ params }) {
	const { id } = params;

	try {
		const ad = await db.select().from(ads).where(eq(ads.id, id)).get();

		if (!ad) {
			return json({ message: `Ad with id ${id} not found` }, { status: 404 });
		}

		return json(ad, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
	} catch (err) {
		console.error('Unexpected error fetching ad by ID:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}

export async function PATCH({ params, request }) {
	const { id } = params;
	const { title, href, width, height, active, weight, file, impressions, clicks } = await request.json();

	const updateData = { title, href, width, height, active, weight, file, impressions, clicks };

	try {
		const updatedAd = await db.update(ads).set(updateData).where(eq(ads.id, id)).returning().get();

		if (!updatedAd) {
			return json({ message: `Ad with id ${id} not found` }, { status: 404 });
		}

		return json(updatedAd, { status: 200 });
	} catch (err) {
		console.error('Unexpected error updating ad:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	const { id } = params;

	try {
		const result = await db.delete(ads).where(eq(ads.id, id)).run();

		if (result.changes === 0) {
			return json({ message: `Ad with id ${id} not found` }, { status: 404 });
		}

				return json({ message: `Ad with id ${id} deleted successfully` }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
	} catch (err) {
		console.error('Unexpected error deleting ad:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}