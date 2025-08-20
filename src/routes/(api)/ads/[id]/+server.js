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

		// Construct the file data URL
		const fileDataUrl = ad.imageData ? `data:${ad.fileType};base64,${ad.imageData.toString('base64')}` : '/placeholder/300x100.svg';

		// Return a new object with the file property as data URL, and omit imageData/fileType
		const { imageData, fileType, ...rest } = ad;
		return json({ ...rest, file: fileDataUrl }, { status: 200 });
	} catch (err) {
		console.error('Unexpected error fetching ad by ID:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}

export async function PATCH({ params, request }) {
	const { id } = params;
	const { title, href, width, height, active, weight, imageData, fileType } = await request.json();

	const updateData = { title, href, width, height, active, weight };

	if (imageData && fileType) {
		// Convert base64 to buffer
		const buffer = Buffer.from(imageData, 'base64');
		updateData.imageData = buffer;
		updateData.fileType = fileType;
		// Update the 'file' field to reflect the data URL
		updateData.file = `data:${fileType};base64,${imageData}`;
	}

	try {
		const updatedAd = await db.update(ads).set(updateData).where(eq(ads.id, id)).returning().get();

		if (!updatedAd) {
			return json({ message: `Ad with id ${id} not found` }, { status: 404 });
		}

		// Construct the file data URL for the returned object
		const updatedFileDataUrl = updatedAd.imageData ? `data:${updatedAd.fileType};base64,${updatedAd.imageData.toString('base64')}` : '/placeholder/300x100.svg';
		const { imageData: updatedImageData, fileType: updatedFileType, ...updatedRest } = updatedAd;
		return json({ ...updatedRest, file: updatedFileDataUrl }, { status: 200 });
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

		return json({ message: `Ad with id ${id} deleted successfully` }, { status: 200 });
	} catch (err) {
		console.error('Unexpected error deleting ad:', err);
		return json({ message: 'An unexpected error occurred' }, { status: 500 });
	}
}