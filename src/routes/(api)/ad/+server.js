import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { ads } from '$lib/server/db/schema';
import { eq, notLike } from 'drizzle-orm';

/**
 * Selects a random ad based on weights from a list of ads.
 * @param {any[]} adList - The list of ads to choose from.
 * @returns {any | null} The selected ad or null if the list is empty.
 */
function selectWeightedRandomAd(adList) {
	if (!adList || adList.length === 0) return null;

	const totalWeight = adList.reduce((sum, ad) => sum + (ad.weight || 1), 0);
	let random = Math.random() * totalWeight;

	for (const ad of adList) {
		random -= ad.weight || 1;
		if (random <= 0) return ad;
	}

	return adList[0]; // Fallback
}

export async function GET({ request }) {
	try {
		const origin = request.headers.get('Origin') || request.headers.get('Referer');

		let activeAdsQuery = db.select().from(ads).where(eq(ads.active, true));

		// Exclude ads linking to the domain where the request originates
		if (origin) {
			try {
				const hostname = new URL(origin).hostname;
				activeAdsQuery = activeAdsQuery.where(notLike(ads.href, `%${hostname}%`));
			} catch (e) {
				console.error('Invalid Origin/Referer header:', origin, e);
			}
		}

		const activeAds = await activeAdsQuery;

		const selectedAd = selectWeightedRandomAd(activeAds);

		if (!selectedAd) {
			return json({ message: 'No ad available' }, { status: 404 });
		}

		// Construct the file data URL for the selected ad
		const fileDataUrl = selectedAd.imageData ? `data:${selectedAd.fileType};base64,${selectedAd.imageData.toString('base64')}` : '/placeholder/300x100.svg';

		// Return a new object with the file property as data URL, and omit imageData/fileType
		const { imageData, fileType, ...rest } = selectedAd;
		return json({ ...rest, file: fileDataUrl }, { status: 200 });
	} catch (err) {
		console.error('Unexpected error fetching ad:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}
