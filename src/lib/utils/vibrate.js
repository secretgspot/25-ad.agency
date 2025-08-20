import { settings } from '$lib/settings/settings.js';
import { get } from 'svelte/store';

/**
 * Predefined vibration patterns for different UI feedback types
 * Patterns follow mobile UX best practices:
 * - Basic: Subtle for frequent interactions
 * - Success: Gentle, confirmatory feeling
 * - Fail: Attention-grabbing but not annoying
 */
export const vibratePatterns = {
	// Quick, subtle feedback for basic interactions
	basic: 20,
	tick: 10,
	click: 10,
	longPress: 30,
	swipe: [20, 10, 20],
	navigate: 60,

	// Success pattern
	success: [40, 20, 40, 20, 80], // Two quick, then longer

	// Fail pattern
	fail: [90, 10, 60], // Two strong buzzes

	// Additional useful patterns
	notification: [100, 50, 100], // Two medium buzzes
	warning: [150, 100, 150, 100, 150], // Three strong buzzes
};

/**
 * Trigger device vibration if supported
 * @param {string} patternName - The name of the vibration pattern to trigger.
 * @param {boolean} isNotification - True if this is a notification vibration, to check notification_buzz setting.
 */
export function vibrate(pattern) {
	if (!pattern) {
		console.warn(`Vibration pattern not found.`);
		return;
	}
	// Check if the Vibration API is supported by the browser
	if ("vibrate" in navigator) {
		navigator.vibrate(pattern);
		return true;
	} else {
		console.log("Vibration API is NOT supported on this device/browser.");
		return false;
	}
}

/**
 * Triggers a button click vibration.
 */
export function vibrateButton(patternName) {
	const currentSettings = get(settings);
	if (!currentSettings.button_buzz) return;
	const pattern = patternName ? vibratePatterns[patternName] : vibratePatterns[currentSettings.button_vibration_pattern];
	vibrate(pattern);
}

/**
 * Triggers a navigation vibration.
 */
export function vibrateNavigation(patternName) {
	const currentSettings = get(settings);
	if (!currentSettings.navigation_buzz) return;
	const pattern = patternName ? vibratePatterns[patternName] : vibratePatterns[currentSettings.navigation_vibration_pattern];
	vibrate(pattern);
}

/**
 * Triggers a notification vibration.
 * @param {'success'|'fail'|'notification'} type - The type of notification.
 */
export function vibrateNotification(type = 'notification') {
	const currentSettings = get(settings);
	if (!currentSettings.notification_buzz) return;
	let patternName;
	if (type === 'success') {
		patternName = currentSettings.notification_success_vibration_pattern;
	} else if (type === 'fail') {
		patternName = currentSettings.notification_error_vibration_pattern;
	} else {
		patternName = currentSettings.notification_vibration_pattern;
	}
	const pattern = vibratePatterns[patternName];
	vibrate(pattern);
}

/**
 * Check if vibration is supported on current device/browser
 * @returns {boolean} - True if vibration API is available
 */
export function isVibrationSupported() {
	return "vibrate" in navigator;
}

/**
 * Stop any ongoing vibration
 */
export function stopVibration() {
	if ("vibrate" in navigator) {
		navigator.vibrate(0);
	}
}
