export function ago(val) {
	val = 0 | (new Date() - new Date(val)) / 1000;
	var unit, length = {
		sec: 60, min: 60, h: 24, d: 7, w: 4.35,
		m: 12, y: 10000
	}, result;

	for (unit in length) {
		result = val % length[unit];
		if (!(val = 0 | val / length[unit]))
			return result + unit;
	}
}

export function ahead(val) {
	val = 0 | (new Date(val) - new Date()) / 1000;

	// Return empty string or handle negative values (dates in the past)
	if (val <= 0) return '';

	var unit, length = {
		sec: 60, min: 60, h: 24, d: 7, w: 4.35,
		m: 12, y: 10000
	}, result;

	for (unit in length) {
		result = val % length[unit];
		if (!(val = 0 | val / length[unit]))
			return 'in ' + result + unit;
	}
}

/**
 * Universal time difference formatter - IMPROVED VERSION
 * Handles various date formats including ISO strings, timestamps, Date objects
 * Uses smart logic to choose the most appropriate unit based on exact multiples
 * @param {string|number|Date} val - The date to compare against current time
 * @param {Object} options - Configuration options
 * @param {boolean} options.short - Use short format (1d vs 1 day)
 * @param {string} options.locale - Locale for formatting (default: 'en')
 * @param {boolean} options.precise - Show more precise units (seconds vs minutes minimum)
 * @returns {string} Formatted time difference
 */
export function timeFrom(val, options = {}) {
	const {
		short = true,
		locale = 'en',
		precise = false
	} = options;

	// Parse input date - handle various formats
	let targetDate;

	try {
		if (val instanceof Date) {
			targetDate = val;
		} else if (typeof val === 'number') {
			// Handle both seconds and milliseconds timestamps
			targetDate = new Date(val < 10000000000 ? val * 1000 : val);
		} else if (typeof val === 'string') {
			// Handle ISO strings, including timezone offsets
			targetDate = new Date(val);
		} else {
			throw new Error('Invalid date input');
		}

		// Validate the parsed date
		if (isNaN(targetDate.getTime())) {
			throw new Error('Invalid date format');
		}
	} catch (error) {
		console.warn('timeFrom: Invalid date input:', val, error.message);
		return 'Invalid date';
	}

	const now = new Date();
	const diffMs = targetDate.getTime() - now.getTime();
	const diffSeconds = Math.abs(Math.floor(diffMs / 1000));
	const isPast = diffMs < 0;

	// Handle "just now" case
	if (!precise && diffSeconds < 60) {
		return 'just now';
	}

	// Smart unit selection based on magnitude and exact multiples
	const diffDays = Math.floor(diffSeconds / 86400);

	// For day-based units, use smart logic
	if (diffSeconds >= 86400) {
		// Check for years first (365+ days)
		if (diffDays >= 365) {
			const years = Math.floor(diffDays / 365);
			const unitText = short ? 'y' : `year${years !== 1 ? 's' : ''}`;
			const timeText = `${years}${short ? '' : ' '}${unitText}`;
			return isPast ? `${timeText} ago` : `in ${timeText}`;
		}

		// Check for months (30+ days) - use months for anything 30 days or more
		if (diffDays >= 30) {
			const months = Math.floor(diffDays / 30);
			const unitText = short ? 'mo' : `month${months !== 1 ? 's' : ''}`;
			const timeText = `${months}${short ? '' : ' '}${unitText}`;
			return isPast ? `${timeText} ago` : `in ${timeText}`;
		}

		// Under 30 days: get more precise with weeks
		// Check for exact weeks (7, 14, 21, 28) when under 30 days
		if (diffDays % 7 === 0 && diffDays >= 7) {
			const weeks = diffDays / 7;
			const unitText = short ? 'w' : `week${weeks !== 1 ? 's' : ''}`;
			const timeText = `${weeks}${short ? '' : ' '}${unitText}`;
			return isPast ? `${timeText} ago` : `in ${timeText}`;
		}

		// Fall back to days for non-exact week multiples under 30 days
		const unitText = short ? 'd' : `day${diffDays !== 1 ? 's' : ''}`;
		const timeText = `${diffDays}${short ? '' : ' '}${unitText}`;
		return isPast ? `${timeText} ago` : `in ${timeText}`;
	}

	// Handle hours, minutes, seconds
	const units = [
		{ key: 'h', seconds: 3600, short: 'h', long: 'hour' },
		{ key: 'min', seconds: 60, short: 'min', long: 'minute' },
		{ key: 's', seconds: 1, short: 's', long: 'second' }
	];

	for (const unit of units) {
		const value = Math.floor(diffSeconds / unit.seconds);
		if (value > 0) {
			const unitText = short ? unit.short : unit.long;
			const pluralSuffix = !short && value !== 1 ? 's' : '';
			const timeText = `${value}${short ? '' : ' '}${unitText}${pluralSuffix}`;
			return isPast ? `${timeText} ago` : `in ${timeText}`;
		}
	}

	// Fallback for edge cases
	return isPast ? 'just now' : 'now';
}

// Keep existing helper functions
export function timeFromShort(val) {
	return timeFrom(val, { short: true });
}

export function timeFromLong(val) {
	return timeFrom(val, { short: false });
}

export function timeFromPrecise(val) {
	return timeFrom(val, { precise: true });
}

/**
 * Multi-unit formatter (shows "1 week 3 days")
 * Great for when you want more precision
 */
export function timeFromMultiUnit(val, options = {}) {
	const {
		short = true,
		maxUnits = 2,
		locale = 'en'
	} = options;

	let targetDate;
	try {
		if (val instanceof Date) {
			targetDate = val;
		} else if (typeof val === 'number') {
			targetDate = new Date(val < 10000000000 ? val * 1000 : val);
		} else if (typeof val === 'string') {
			targetDate = new Date(val);
		} else {
			throw new Error('Invalid date input');
		}

		if (isNaN(targetDate.getTime())) {
			throw new Error('Invalid date format');
		}
	} catch (error) {
		return 'Invalid date';
	}

	const now = new Date();
	const diffMs = targetDate.getTime() - now.getTime();
	let diffSeconds = Math.abs(Math.floor(diffMs / 1000));
	const isPast = diffMs < 0;

	if (diffSeconds < 60) {
		return 'just now';
	}

	const units = [
		{ name: 'year', seconds: 31536000, short: 'y' },
		{ name: 'month', seconds: 2592000, short: 'mo' },
		{ name: 'week', seconds: 604800, short: 'w' },
		{ name: 'day', seconds: 86400, short: 'd' },
		{ name: 'hour', seconds: 3600, short: 'h' },
		{ name: 'minute', seconds: 60, short: 'min' }
	];

	const parts = [];
	let unitsUsed = 0;

	for (const unit of units) {
		if (unitsUsed >= maxUnits) break;

		const value = Math.floor(diffSeconds / unit.seconds);
		if (value > 0) {
			const unitText = short ? unit.short : `${unit.name}${value !== 1 ? 's' : ''}`;
			parts.push(`${value}${short ? '' : ' '}${unitText}`);
			diffSeconds -= value * unit.seconds;
			unitsUsed++;
		}
	}

	if (parts.length === 0) {
		return 'just now';
	}

	const timeText = parts.join(short ? ' ' : ', ');
	return isPast ? `${timeText} ago` : `in ${timeText}`;
}

/**
 * Expiration-optimized formatter
 * Prioritizes clarity for expiration dates
 */
export function timeFromExpiration(val, options = {}) {
	const { short = false } = options;

	let targetDate;
	try {
		if (val instanceof Date) {
			targetDate = val;
		} else if (typeof val === 'number') {
			targetDate = new Date(val < 10000000000 ? val * 1000 : val);
		} else if (typeof val === 'string') {
			targetDate = new Date(val);
		} else {
			throw new Error('Invalid date input');
		}

		if (isNaN(targetDate.getTime())) {
			throw new Error('Invalid date format');
		}
	} catch (error) {
		return 'Invalid date';
	}

	const now = new Date();
	const diffMs = targetDate.getTime() - now.getTime();
	const diffSeconds = Math.abs(Math.floor(diffMs / 1000));
	const isPast = diffMs < 0;

	// For expired items
	if (isPast) {
		return short ? 'expired' : 'expired';
	}

	// Context-based rules for future dates
	if (diffSeconds < 60) return short ? 'now' : 'expires now';
	if (diffSeconds < 3600) { // < 1 hour
		const mins = Math.floor(diffSeconds / 60);
		const unit = short ? 'min' : `minute${mins !== 1 ? 's' : ''}`;
		return `in ${mins}${short ? '' : ' '}${unit}`;
	}
	if (diffSeconds < 86400) { // < 1 day
		const hours = Math.floor(diffSeconds / 3600);
		const unit = short ? 'h' : `hour${hours !== 1 ? 's' : ''}`;
		return `in ${hours}${short ? '' : ' '}${unit}`;
	}

	const days = Math.floor(diffSeconds / 86400);

	// Months for 30+ days
	if (days >= 30) {
		const months = Math.floor(days / 30);
		const unit = short ? 'mo' : `month${months !== 1 ? 's' : ''}`;
		return `in ${months}${short ? '' : ' '}${unit}`;
	}

	// Under 30 days: get precise with weeks/days
	// Only show weeks for exact multiples of 7
	if (days % 7 === 0 && days >= 7) {
		const weeks = days / 7;
		const unit = short ? 'w' : `week${weeks !== 1 ? 's' : ''}`;
		return `in ${weeks}${short ? '' : ' '}${unit}`;
	}

	// Default to days for clarity in expiration context
	const unit = short ? 'd' : `day${days !== 1 ? 's' : ''}`;
	return `in ${days}${short ? '' : ' '}${unit}`;
}

/**
 * Format date for display
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
	return new Date(date).toLocaleDateString();
}

/**
 * Format date and time for display
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(date) {
	const d = new Date(date);
	return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

/**
 * Calculates the expiration date for an item, based on its creation date and a specified number of days.
 * @param {string|Date} createdAt - The creation date of the item (e.g., post.created_at).
 * @param {number} days - The number of days until the item expires.
 * @returns {Date} The calculated expiration date.
 */
export function getExpirationDate(createdAt, days) {
	const createdDate = new Date(createdAt);
	return new Date(createdDate.getTime() + (days * 24 * 60 * 60 * 1000));
}

/**
 * Checks if an item has expired based on its creation date and expiration duration.
 * @param {string|Date} createdAt - The creation date of the item.
 * @param {number} expirationDays - The number of days after creation until the item expires.
 * @returns {boolean} - True if the item has expired, false otherwise.
 */
export function isExpired(createdAt, expirationDays) {
	const now = new Date();
	const expirationDate = getExpirationDate(createdAt, expirationDays);

	// Check for invalid date inputs
	if (isNaN(expirationDate.getTime())) {
		console.error("Invalid 'createdAt' or 'expirationDays' provided, resulting in an invalid expiration date.");
		return true; // Consider it expired if the date is invalid
	}

	return expirationDate <= now;
}

/**
 * Returns the current date in YYYY-MM-DD format.
 * @returns {string} The current date as a string in YYYY-MM-DD format.
 */
export function getTodayDateOnlyString() {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const day = today.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
}

/**
 * Returns the current date and time in YYYY-MM-DDTHH:mm format.
 * @returns {string} The current date and time as a string in YYYY-MM-DDTHH:mm format.
 */
export function getTodayDateTimeString() {
	return new Date().toISOString().slice(0, 16);
}

/**
 * Formats a UTC date string to a local datetime-local input format.
 * @param {string} utcDateString - The UTC date string to format.
 * @returns {string} The formatted local date time string.
 */
export function formatToLocalDateTime(utcDateString) {
	if (!utcDateString) return '';
	const date = new Date(utcDateString);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/*
USAGE EXAMPLES WITH UPDATED LOGIC:

// Current timeFrom (improved):
timeFromLong(getExpirationDate(data.post.created_at, 14))
// → "in 2 weeks" (if exactly 14 days) or "in 13 days" (if 13 days)

// For expiration-specific formatting:
timeFromExpiration(getExpirationDate(data.post.created_at, 14))
// → "in 14 days" (prioritizes days for clarity)

RESULTS WITH NEW LOGIC:
- 35 days: "in 1 month"
- 45 days: "in 1 month"
- 60 days: "in 2 months"
- 90 days: "in 3 months"
- 29 days: "in 29 days"
- 28 days: "in 4 weeks"
- 21 days: "in 3 weeks"
- 14 days: "in 2 weeks"
- 13 days: "in 13 days"
- 7 days: "in 1 week"
- 6 days: "in 6 days"
*/