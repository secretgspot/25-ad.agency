import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { ads } from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
	try {
		const allAds = await db.select().from(ads);
		const adsWithImageData = allAds.map(ad => {
			const { imageData, fileType, ...rest } = ad;
			return {
				...rest,
				file: imageData ? `data:${fileType};base64,${imageData.toString('base64')}` : '/placeholder/300x100.svg'
			};
		});
		return json(adsWithImageData, { status: 200 });
	} catch (err) {
		console.error('Unexpected error fetching ads:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const { title, href, width, height, weight, active, imageData, fileType } = await request.json();

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
			file: '' // This will be updated if imageData is provided
		};

		if (imageData && fileType) {
			newAd.imageData = Buffer.from(imageData, 'base64');
			newAd.fileType = fileType;
			newAd.file = imageData ? `data:${fileType};base64,${imageData}` : '/placeholder/300x100.svg';
		} else {
			// Handle case where no image is provided, maybe a placeholder or error
			newAd.file = '/placeholder/300x100.svg'; // Or throw an error if image is mandatory
		}

		const result = await db.insert(ads).values(newAd).returning().get();

		return json(result, { status: 201 });
	} catch (err) {
		console.error('Error creating ad:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}