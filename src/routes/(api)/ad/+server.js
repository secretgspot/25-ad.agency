import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { ads } from '$lib/server/db/schema';
import { eq, notLike, and } from 'drizzle-orm'; // Import 'and'

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

		const whereConditions = [eq(ads.active, 1)]; // Start with active filter

		// Exclude ads linking to the domain where the request originates
		if (origin) {
			try {
				const hostname = new URL(origin).hostname;
				whereConditions.push(notLike(ads.href, `%${hostname}%`));
			} catch (e) {
				console.error('Invalid Origin/Referer header:', origin, e);
			}
		}

		const query = db.select().from(ads).where(and(...whereConditions)); // Apply all conditions

		console.log(query.toSQL());
		const activeAds = await query;
		console.log('Active Ads:', activeAds);

		const selectedAd = selectWeightedRandomAd(activeAds);

		if (!selectedAd) {
			return json({ message: 'No ad available' }, { status: 404, headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', 'Pragma': 'no-cache', 'Expires': '0' } });
		}

		return json(selectedAd, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', 'Pragma': 'no-cache', 'Expires': '0' } });
	} catch (err) {
		console.error('Unexpected error fetching ad:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', 'Pragma': 'no-cache', 'Expires': '0' } });
	}
}