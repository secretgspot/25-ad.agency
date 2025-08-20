import { json } from '@sveltejs/kit';

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

export async function GET({ request, locals: { supabase } }) {
	try {
		const origin = request.headers.get('Origin') || request.headers.get('Referer');

		// Start by selecting active ads only
		let query = supabase.from('ads').select('*').eq('active', true);

		// Exclude ads linking to the domain where the request originates
		if (origin) {
			try {
				const hostname = new URL(origin).hostname;
				query = query.not('href', 'ilike', `%${hostname}%`);
			} catch (e) {
				// Log error but don't fail the request if the origin is invalid
				console.error('Invalid Origin/Referer header:', origin, e);
			}
		}

		const { data: activeAds, error } = await query;

		if (error) {
			console.error('Error fetching active ads:', error);
			return json({ message: 'Failed to fetch ads' }, { status: 500 });
		}

		// Select one ad using weighted random logic
		const selectedAd = selectWeightedRandomAd(activeAds);

		if (!selectedAd) {
			return json({ message: 'No ad available' }, { status: 404 });
		}

		return json(selectedAd, { status: 200 });
	} catch (err) {
		console.error('Unexpected error fetching ad:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}
