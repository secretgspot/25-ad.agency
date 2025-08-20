/** @type {import('./$types').RequestHandler} */
import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		let error = false;
		const mock_data = [
			{
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
			},
			{
				"id": "7b791fe6-995d-4d2f-b532-90c7c6de0f37",
				"created_at": "2025-08-11T20:08:01.355394-06:00",
				"user_id": "59427676-0fc2-4cdf-ba09-b0b6d739bcf2",
				"file": "https://dpxkejzgkybacaujpytu.supabase.co/storage/v1/object/public/uploads/ads/1754967121775-pintar.cariari-300x100.jpg",
				"title": "Cariari Pintor",
				"href": "https://25-cariaripintor.vercel.app",
				"width": 320,
				"height": 100,
				"weight": 1,
				"impressions": 523,
				"clicks": 2,
				"active": true
			},
			{
				"id": "8a3e943d-f7b6-4861-b1ca-be802e1717bc",
				"created_at": "2025-08-11T21:06:02.09511-06:00",
				"user_id": "59427676-0fc2-4cdf-ba09-b0b6d739bcf2",
				"file": "https://dpxkejzgkybacaujpytu.supabase.co/storage/v1/object/public/uploads/ads/59427676-0fc2-4cdf-ba09-b0b6d739bcf2_1755041010727.webp",
				"title": "Cariari Agency",
				"href": "https://cariari.agency",
				"width": 320,
				"height": 100,
				"weight": 1,
				"impressions": 514,
				"clicks": 2,
				"active": true
			}
		];

		if (error) {
			console.error('Error fetching ads:', error);
			return json({ message: 'Failed to fetch ads' }, { status: 500 });
		}

		return json(mock_data, { status: 200 });
	} catch (err) {
		console.error('Unexpected error fetching ads:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
};