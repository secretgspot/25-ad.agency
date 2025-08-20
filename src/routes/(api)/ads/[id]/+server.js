import { json } from '@sveltejs/kit';

// GET a specific ad by ID
export async function GET({ params }) {
	const { id } = params;

	try {
		let error = false; // temp variable for mock data
		const mock_data = {
			"id": "58b6bef1-cbeb-4953-a2ad-d4a25c66ebd1",
			"created_at": "2025-08-16T23:00:12.266985-06:00",
			"user_id": "59427676-0fc2-4cdf-ba09-b0b6d739bcf2",
			"file": "https://dpxkejzgkybacaujpytu.supabase.co/storage/v1/object/public/uploads/ads/59427676-0fc2-4cdf-ba09-b0b6d739bcf2_1755406829250.webp",
			"title": "Cariari Community",
			"href": "https://25-cariari-community.vercel.app",
			"width": 320,
			"height": 100,
			"weight": 1,
			"impressions": 414,
			"clicks": 1,
			"active": true
		};

		if (error) {
			console.error('Error fetching ad:', error);
			return json({ message: 'Failed to fetch ad' }, { status: 500 });
		}

		if (!mock_data) {
			return json({ message: 'Ad not found' }, { status: 404 });
		}

		return json(mock_data, { status: 200 });
	} catch (err) {
		console.error('Unexpected error fetching ad:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}

// PATCH (update) an ad
export async function PATCH({ request, params }) {
	const { id } = params;

	try {
		let data = {}; // temp variable for mock data
		let error = false; // temp variable for mock data
		const body = await request.json();

		// Insert data into SQLlite db

		if (error) {
			console.error('Error updating ad:', error);
			return json({ message: 'Failed to update ad' }, { status: 500 });
		}

		return json(data, { status: 200 });
	} catch (err) {
		console.error('Unexpected error updating ad:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}

// DELETE an ad
export async function DELETE({ params }) {
	const { id } = params;

	try {
		let error = false; // temp variable for mock data
		// Delete ad from SQLlite db

		if (error) {
			console.error('Error deleting ad:', error);
			return json({ message: 'Failed to delete ad' }, { status: 500 });
		}

		return json({ message: 'Ad deleted successfully' }, { status: 200 });
	} catch (err) {
		console.error('Unexpected error deleting ad:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}