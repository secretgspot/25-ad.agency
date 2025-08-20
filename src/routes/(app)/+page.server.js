import { redirect, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	try {
		const adsResponse = await fetch('/ads');

		if (!adsResponse.ok) {
			console.error('Error fetching ads from API, status:', adsResponse.status);
			return { ads: [] };
		}

		const adsResult = await adsResponse.json();
		const ads = Array.isArray(adsResult) ? adsResult : adsResult.ads || [];

		return { ads };
	} catch (error) {
		console.error('Error fetching ads in load function:', error);
		return { ads: [] };
	}
}

export const actions = {
	createAd: async ({ request, fetch }) => {
		try {
			const formData = await request.formData();
			const imageFile = formData.get('image_file');

			let imageData = null;
			let fileType = null;

			if (imageFile && imageFile instanceof File && imageFile.size > 0) {
				const arrayBuffer = await imageFile.arrayBuffer();
				imageData = Buffer.from(arrayBuffer).toString('base64');
				fileType = imageFile.type;
				console.log('Base64 image data size (createAd):', imageData.length, 'bytes');
			}

			const body = {
				title: formData.get('title'),
				href: formData.get('href'),
				width: parseInt(formData.get('width')),
				height: parseInt(formData.get('height')),
				weight: parseFloat(formData.get('weight')),
				active: formData.get('active') === 'true',
				imageData,
				fileType
			};

			const response = await fetch('/ads', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			const result = await response.json();
			if (!response.ok) {
				return fail(response.status, { ...result, success: false });
			}

			return { success: true, message: 'Ad created successfully!' };
		} catch (error) {
			console.error('Error in createAd action:', error);
			return fail(500, { message: 'An unexpected error occurred.' });
		}
	},

	updateAd: async ({ request, fetch }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id');
			const imageFile = formData.get('image_file');

			if (!id) {
				return fail(400, { message: 'Ad ID not provided' });
			}

			let imageData = null;
			let fileType = null;

			if (imageFile && imageFile instanceof File && imageFile.size > 0) {
				const arrayBuffer = await imageFile.arrayBuffer();
				imageData = Buffer.from(arrayBuffer).toString('base64');
				fileType = imageFile.type;
				console.log('Base64 image data size (updateAd):', imageData.length, 'bytes');
			}

			const body = {
				title: formData.get('title'),
				href: formData.get('href'),
				width: parseInt(formData.get('width')),
				height: parseInt(formData.get('height')),
				weight: parseFloat(formData.get('weight')),
				active: formData.get('active') === 'true',
				imageData,
				fileType
			};

			const response = await fetch(`/ads/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			const result = await response.json();
			if (!response.ok) {
				return fail(response.status, { ...result, success: false });
			}

			return { success: true, message: 'Ad updated successfully!' };
		} catch (error) {
			console.error('Error in updateAd action:', error);
			return fail(500, { message: 'An unexpected error occurred.' });
		}
	},

	deleteAd: async ({ request, fetch }) => {

		try {
			const formData = await request.formData();
			const id = formData.get('id');

			if (!id) {
				return fail(400, { message: 'Ad ID is required' });
			}

			const response = await fetch(`/ads/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const result = await response.json();
				return fail(response.status, { ...result, success: false });
			}

			return { success: true, message: 'Ad deleted successfully!' };
		} catch (error) {
			console.error('Error in deleteAd action:', error);
			return fail(500, { message: 'An unexpected error occurred.' });
		}
	}
};