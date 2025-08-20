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
			let imageUrl = null;

			if (imageFile && imageFile.size > 0) {
				const fileExtension = imageFile.name.split('.').pop();
				const fileName = `${user.id}_${Date.now()}.${fileExtension}`;
				const filePath = `ads/${fileName}`;

				const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, imageFile);
				if (uploadError) {
					return fail(500, { message: 'Failed to upload image: ' + uploadError.message });
				}

				const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(filePath);
				imageUrl = publicUrlData.publicUrl;
			}

			const body = {
				title: formData.get('title'),
				href: formData.get('href'),
				width: formData.get('width'),
				height: formData.get('height'),
				weight: formData.get('weight'),
				active: formData.get('active') === 'true',
				file: imageUrl
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

			const { data: currentAd, error: fetchError } = await supabase.from('ads').select('file').eq('id', id).single();
			if (fetchError) {
				return fail(500, { message: 'Could not fetch existing ad data.' });
			}

			let imageUrl = currentAd.file;

			if (imageFile && imageFile.size > 0) {
				if (currentAd && currentAd.file) {
					const oldPath = currentAd.file.substring(currentAd.file.lastIndexOf('/') + 1);
					await supabase.storage.from('uploads').remove([`ads/${oldPath}`]);
				}

				const fileExtension = imageFile.name.split('.').pop();
				const fileName = `${user.id}_${Date.now()}.${fileExtension}`;
				const filePath = `ads/${fileName}`;
				const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, imageFile);

				if (uploadError) {
					return fail(500, { message: 'Failed to upload new image: ' + uploadError.message });
				}

				const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(filePath);
				imageUrl = publicUrlData.publicUrl;
			}

			const body = {
				title: formData.get('title'),
				href: formData.get('href'),
				width: formData.get('width'),
				height: formData.get('height'),
				weight: formData.get('weight'),
				active: formData.get('active') === 'true',
				file: imageUrl
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

			const { data: currentAd, error: fetchError } = await supabase.from('ads').select('file').eq('id', id).single();
			if (fetchError) {
				return fail(500, { message: 'Could not fetch existing ad to delete image.' });
			}

			if (currentAd && currentAd.file) {
				const oldPath = currentAd.file.substring(currentAd.file.lastIndexOf('/') + 1);
				await supabase.storage.from('uploads').remove([`ads/${oldPath}`]);
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
			return fail(500, { message: 'An unexpected error occurred.' });
		}
	}
};