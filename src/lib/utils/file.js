import Compressor from 'compressorjs';

/**
 * Compresses an image file.
 * @param {File} file The file to compress.
 * @returns {Promise<{file: File, previewUrl: string}>} A promise that resolves with the compressed file and a preview URL.
 */
export function compressFile(file) {
	return new Promise((resolve, reject) => {
		new Compressor(file, {
			quality: 0.7,
			maxWidth: 800,
			maxHeight: 600,
			mimeType: 'image/jpeg',
			convertSize: 100000,
			success(result) {
				const previewUrl = URL.createObjectURL(result);
				const fileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
				const compressedFileObj = new File([result], fileName, { type: 'image/jpeg' });
				resolve({ file: compressedFileObj, previewUrl });
			},
			error: reject,
		});
	});
}
