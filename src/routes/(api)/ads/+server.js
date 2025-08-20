import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { ads } from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
	try {
		const allAds = await db.select().from(ads);
		return json(allAds, { status: 200 });
	} catch (err) {
		console.error('Unexpected error fetching ads:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const { title, href, width, height, weight, active, file } = await request.json();

		const newAd = {
			id: uuidv4(),
			created_at: new Date().toISOString(),
			title,
			href,
			width,
			height,
			weight: weight || 1,
			active: active !== undefined ? active : true,
			impressions: 0,
			clicks: 0,
			file: file || '/placeholder/300x100.svg'
		};

		const result = await db.insert(ads).values(newAd).returning().get();

		return json(result, { status: 201 });
	} catch (err) {
		console.error('Error creating ad:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}