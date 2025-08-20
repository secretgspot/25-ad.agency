export function formatLargeNumber(num) {
	if (num === null || typeof num === 'undefined') {
		return '';
	}

	if (num >= 1000000000000) {
		return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
	}
	if (num >= 1000000000) {
		return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
	}
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
	}
	return num.toString();
}

// formatter.format(number); // $2345
export let formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumSignificantDigits: 3
});

// PAD NUMBER
export function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
// pad(10, 4);      // 0010
// pad(9, 4);       // 0009
// pad(123, 4);     // 0123
// pad(10, 4, '-'); // --10