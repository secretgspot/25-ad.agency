// $lib/settings/settings.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Default settings configuration
 */
const DEFAULT_SETTINGS = {
	// Color Theme
	dark_theme: false,

	// Audio Effects
	button_sounds: true,
	navigation_sound: false,
	notification_sound: true,

	// Vibration Effects
	button_buzz: true,
	navigation_buzz: true,
	notification_buzz: true,

	// Audio Patterns
	button_sound_pattern: 'click',
	navigation_sound_pattern: 'navigate',
	notification_sound_pattern: 'notification',
	notification_error_sound_pattern: 'fail',
	notification_success_sound_pattern: 'success',

	// Vibration Patterns
	button_vibration_pattern: 'click',
	navigation_vibration_pattern: 'navigate',
	notification_vibration_pattern: 'notification',
	notification_error_vibration_pattern: 'fail',
	notification_success_vibration_pattern: 'success',
};

/**
 * Load settings from localStorage or use defaults
 */
function loadSettings() {
	if (!browser) return DEFAULT_SETTINGS;

	try {
		const storedSettings = localStorage.getItem('app_settings');
		if (storedSettings) {
			const parsed = JSON.parse(storedSettings);
			// Deep merge to ensure new settings keys are added to existing user profiles
			const merged = {
				...DEFAULT_SETTINGS,
				...parsed,
			};
			return merged;
		}
	} catch (error) {
		console.warn('Failed to load settings from localStorage:', error);
	}

	// If no settings are stored, check for system preference
	const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (prefersDarkMode) {
		return { ...DEFAULT_SETTINGS, dark_theme: true };
	}

	return DEFAULT_SETTINGS;
}

/**
 * Save settings to localStorage
 */
function saveState(state) {
	if (!browser) return;

	try {
		const settingsToSave = {
			dark_theme: state.dark_theme,
			button_sounds: state.button_sounds,
			navigation_sound: state.navigation_sound,
			notification_sound: state.notification_sound,
			button_buzz: state.button_buzz,
			navigation_buzz: state.navigation_buzz,
			notification_buzz: state.notification_buzz,
		};
		localStorage.setItem('app_settings', JSON.stringify(settingsToSave));
	} catch (error) {
		console.error('Failed to save state to localStorage:', error);
	}
}

const initialSettings = loadSettings();

// The store itself is the main export for components to use
export const settings = writable(initialSettings);

// Subscribe to changes and save to localStorage
if (browser) {
	settings.subscribe(saveState);
}

/**
 * Resets all settings to their default values and clears localStorage.
 */
export function resetSettings() {
	if (browser) {
		localStorage.removeItem('app_settings');
	}
	settings.set(DEFAULT_SETTINGS);
}
