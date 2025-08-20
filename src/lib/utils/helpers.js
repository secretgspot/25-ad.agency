// Function to check user's system preference
export function prefersDarkTheme() {
	return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// --- Wake Lock Helpers ---
export async function enableWakeLock() {
	try {
		if ('wakeLock' in navigator) {
			// Store the wakeLock instance on window to allow release from anywhere
			window._wakeLock = await navigator.wakeLock.request('screen');
		}
	} catch { }
}

export async function disableWakeLock() {
	try {
		if (window._wakeLock) await window._wakeLock.release();
	} catch {
	} finally {
		window._wakeLock = null;
	}
}

// Functions for FEATURES input component on add and edit pages
export function addFeature(input, form) {
	if (input.value == '') return;
	const newFeatures = input.value.split(',').map((feature) => feature.trim()).filter((feature) => feature !== '');
	form.features = [...(form?.features ?? []), ...newFeatures];
	input.value = '';
}
export function removeFeature(index, form) {
	form.features = [...form.features.slice(0, index), ...form.features.slice(index + 1)];
}
export function enter(node, callback) {
	function onkeydown(event) {
		if (event.which === 13) callback(node);
	}
	node.addEventListener('keydown', onkeydown);
	return {
		destroy() {
			node.removeEventListener('keydown', onkeydown);
		},
	};
}


