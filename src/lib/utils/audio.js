import { settings } from '$lib/settings/settings.js';
import { get } from 'svelte/store';

// Global audio context - created lazily to avoid autoplay restrictions
let audioContext = null;

/**
 * Initialize audio context (called automatically when needed)
 * @returns {AudioContext|null} - Audio context or null if not supported
 */
function getAudioContext() {
	if (!audioContext) {
		try {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
		} catch (error) {
			console.log("Web Audio API is not supported on this device/browser.");
			return null;
		}
	}

	// Resume context if suspended (required for user interaction)
	if (audioContext.state === 'suspended') {
		audioContext.resume();
	}

	return audioContext;
}

/**
 * Generate a simple tone/chime
 * @param {number} frequency - Frequency in Hz
 * @param {number} duration - Duration in milliseconds
 * @param {number} volume - Volume (0-1)
 * @param {string} waveType - Wave type: 'sine', 'square', 'sawtooth', 'triangle'
 * @returns {Promise<boolean>} - Returns true if chime was played, false if not supported
 */
export async function playChime(frequency = 800, duration = 200, volume = 0.3, waveType = 'sine') {
	const ctx = getAudioContext();
	if (!ctx) return false;

	try {
		// Create oscillator for the tone
		const oscillator = ctx.createOscillator();
		const gainNode = ctx.createGain();

		// Configure oscillator
		oscillator.type = waveType;
		oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

		// Configure volume envelope (attack, decay, sustain, release)
		gainNode.gain.setValueAtTime(0, ctx.currentTime);
		gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01); // Quick attack
		gainNode.gain.exponentialRampToValueAtTime(volume * 0.7, ctx.currentTime + duration / 1000 * 0.7); // Sustain
		gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000); // Release

		// Connect audio nodes
		oscillator.connect(gainNode);
		gainNode.connect(ctx.destination);

		// Play the tone
		oscillator.start(ctx.currentTime);
		oscillator.stop(ctx.currentTime + duration / 1000);

		return true;
	} catch (error) {
		console.error("Error playing chime:", error);
		return false;
	}
}

/**
 * Play a sequence of chimes
 * @param {Array} sequence - Array of {frequency, duration, delay, volume, waveType} objects
 * @returns {Promise<boolean>} - Returns true if sequence was started
 */
export async function playChimeSequence(sequence) {
	const ctx = getAudioContext();
	if (!ctx) return false;

	const notes = Array.isArray(sequence) ? sequence : [sequence];

	for (const note of notes) {
		const {
			frequency = 800,
			duration = 200,
			delay = 0,
			volume = 0.3,
			waveType = 'sine'
		} = note;

		setTimeout(() => {
			playChime(frequency, duration, volume, waveType);
		}, delay);
	}

	return true;
}

/**
 * Plays a sound based on the given pattern.
 * @param {object|Array<object>} pattern - The audio pattern to play.
 */
export function playSound(pattern) {
	if (!pattern) {
		console.warn(`Audio pattern not found.`);
		return;
	}
	if (Array.isArray(pattern)) {
		playChimeSequence(pattern);
	} else {
		playChime(pattern.frequency, pattern.duration, pattern.volume, pattern.waveType);
	}
}

/**
 * Plays a button click sound.
 * @param {string} [patternName] - Optional: The name of the pattern to play. Defaults to settings.button_sound_pattern.
 */
export function playButtonSound(patternName) {
	const currentSettings = get(settings);
	if (!currentSettings.button_sounds) return;
	const pattern = patternName ? chimePatterns[patternName] : chimePatterns[currentSettings.button_sound_pattern];
	playSound(pattern);
}

/**
 * Plays a navigation sound.
 * @param {string} [patternName] - Optional: The name of the pattern to play. Defaults to settings.navigation_sound_pattern.
 */
export function playNavigationSound(patternName) {
	const currentSettings = get(settings);
	if (!currentSettings.navigation_sound) return;
	const pattern = patternName ? chimePatterns[patternName] : chimePatterns[currentSettings.navigation_sound_pattern];
	playSound(pattern);
}

/**
 * Plays a notification sound.
 * @param {'success'|'fail'|'notification'} type - The type of notification.
 */
export function playNotificationSound(type = 'notification') {
	const currentSettings = get(settings);
	if (!currentSettings.notification_sound) return;
	let patternName;
	if (type === 'success') {
		patternName = currentSettings.notification_success_sound_pattern;
	} else if (type === 'fail') {
		patternName = currentSettings.notification_error_sound_pattern;
	} else {
		patternName = currentSettings.notification_sound_pattern;
	}
	const pattern = chimePatterns[patternName];
	playSound(pattern);
}

/**
 * Attaches a click sound to an element.
 * @param {HTMLElement} node - The element to attach the sound to.
 * @param {string} [pattern='click'] - The name of the sound pattern to play from chimePatterns.
 */
export function sound(node, pattern = 'click') {
	const handleClick = () => {
		playButtonSound(pattern);
	};

	node.addEventListener('click', handleClick, true);

	return {
		update(newPattern) {
			pattern = newPattern;
		},
		destroy() {
			node.removeEventListener('click', handleClick, true);
		}
	};
}


/**
 * Check if Web Audio API is supported
 * @returns {boolean} - True if audio API is available
 */
export function isAudioSupported() {
	return !!(window.AudioContext || window.webkitAudioContext);
}

/**
 * Predefined chime patterns for different UI feedback types
 * Frequencies chosen to be pleasant and distinguishable
 */
export const chimePatterns = {
	// Basic interaction - rich harmonic click with deep foundation
	basic: [{
		frequency: 130,
		duration: 300,
		delay: 0,
		volume: 0.18,
		waveType: 'sine',
	}, {
		frequency: 260,
		duration: 250,
		delay: 10,
		volume: 0.15,
		waveType: 'sine',
	}, {
		frequency: 520,
		duration: 200,
		delay: 20,
		volume: 0.12,
		waveType: 'sine',
	}, {
		frequency: 780,
		duration: 180,
		delay: 25,
		volume: 0.08,
		waveType: 'sine',
	}],

	// Subtle tick with deep harmonic overtones
	tick: [{
		frequency: 220,
		duration: 180,
		delay: 0,
		volume: 0.15,
		waveType: 'sine',
	}, {
		frequency: 440,
		duration: 150,
		delay: 5,
		volume: 0.12,
		waveType: 'sine',
	}, {
		frequency: 660,
		duration: 120,
		delay: 10,
		volume: 0.08,
		waveType: 'sine',
	}, {
		frequency: 110,
		duration: 220,
		delay: 3,
		volume: 0.1,
		waveType: 'sine',
	}],

	// Deep cinematic button click with sub-bass foundation
	click: [{
		frequency: 87,
		duration: 280,
		delay: 0,
		volume: 0.2,
		waveType: 'sine',
	}, {
		frequency: 174,
		duration: 220,
		delay: 15,
		volume: 0.18,
		waveType: 'sine',
	}, {
		frequency: 261,
		duration: 200,
		delay: 25,
		volume: 0.15,
		waveType: 'sine',
	}, {
		frequency: 392,
		duration: 180,
		delay: 35,
		volume: 0.12,
		waveType: 'sine',
	}, {
		frequency: 523,
		duration: 160,
		delay: 40,
		volume: 0.08,
		waveType: 'sine',
	}],

	// Rich long press with powerful low-end
	longPress: [{
		frequency: 65,
		duration: 500,
		delay: 0,
		volume: 0.25,
		waveType: 'sine',
	}, {
		frequency: 130,
		duration: 480,
		delay: 20,
		volume: 0.22,
		waveType: 'sine',
	}, {
		frequency: 195,
		duration: 450,
		delay: 40,
		volume: 0.18,
		waveType: 'sine',
	}, {
		frequency: 260,
		duration: 420,
		delay: 60,
		volume: 0.15,
		waveType: 'sine',
	}, {
		frequency: 390,
		duration: 380,
		delay: 80,
		volume: 0.1,
		waveType: 'sine',
	}],

	// Deep swipe with rumbling bass
	swipe: [{
		frequency: 73,
		duration: 350,
		delay: 0,
		volume: 0.18,
		waveType: 'sine',
	}, {
		frequency: 146,
		duration: 320,
		delay: 25,
		volume: 0.15,
		waveType: 'sine',
	}, {
		frequency: 220,
		duration: 290,
		delay: 50,
		volume: 0.13,
		waveType: 'sine',
	}, {
		frequency: 293,
		duration: 260,
		delay: 75,
		volume: 0.1,
		waveType: 'sine',
	}, {
		frequency: 440,
		duration: 220,
		delay: 100,
		volume: 0.08,
		waveType: 'sine',
	}],

	// Deep atmospheric woosh
	navigate: [{
		frequency: 80,
		duration: 600,
		delay: 0,
		volume: 0.15,
		waveType: 'sine',
	}, {
		frequency: 120,
		duration: 550,
		delay: 30,
		volume: 0.12,
		waveType: 'sine',
	}, {
		frequency: 180,
		duration: 500,
		delay: 60,
		volume: 0.10,
		waveType: 'sine',
	}, {
		frequency: 240,
		duration: 450,
		delay: 90,
		volume: 0.08,
		waveType: 'sine',
	}, {
		frequency: 300,
		duration: 400,
		delay: 120,
		volume: 0.06,
		waveType: 'sine',
	}, {
		frequency: 360,
		duration: 350,
		delay: 150,
		volume: 0.04,
		waveType: 'sine',
	}],

	// Cathedral bell with massive low-end resonance
	bell: [{
		frequency: 110,
		duration: 900,
		delay: 0,
		volume: 0.25,
		waveType: 'sine',
	}, {
		frequency: 220,
		duration: 800,
		delay: 30,
		volume: 0.22,
		waveType: 'sine',
	}, {
		frequency: 330,
		duration: 700,
		delay: 60,
		volume: 0.18,
		waveType: 'sine',
	}, {
		frequency: 440,
		duration: 600,
		delay: 90,
		volume: 0.15,
		waveType: 'sine',
	}, {
		frequency: 660,
		duration: 300,
		delay: 120,
		volume: 0.1,
		waveType: 'sine',
	}],

	// Deep ethereal notification with sub-bass presence
	success: [{
		frequency: 110,
		duration: 350,
		delay: 0,
		volume: 0.18,
		waveType: 'sine',
	}, {
		frequency: 220,
		duration: 320,
		delay: 80,
		volume: 0.16,
		waveType: 'sine',
	}, {
		frequency: 330,
		duration: 280,
		delay: 160,
		volume: 0.14,
		waveType: 'sine',
	}, {
		frequency: 440,
		duration: 250,
		delay: 240,
		volume: 0.12,
		waveType: 'sine',
	}, {
		frequency: 165,
		duration: 400,
		delay: 40,
		volume: 0.1,
		waveType: 'sine',
	}],

	// "NAH-UH" error sound - two distinct syllables
	fail: [
		// First syllable - "NAH" (higher, sharper)
		{
			frequency: 220,
			duration: 200,
			delay: 0,
			volume: 0.25,
			waveType: 'sine'
		},
		{
			frequency: 110,
			duration: 250,
			delay: 0,
			volume: 0.28,
			waveType: 'sine'
		},
		{
			frequency: 55,
			duration: 300,
			delay: 0,
			volume: 0.22,
			waveType: 'triangle'
		},

		// Brief pause, then second syllable - "UH" (lower, more final)
		{
			frequency: 146,
			duration: 300,
			delay: 250,
			volume: 0.22,
			waveType: 'sine'
		},
		{
			frequency: 73,
			duration: 350,
			delay: 250,
			volume: 0.26,
			waveType: 'sine'
		},
		{
			frequency: 37,
			duration: 400,
			delay: 250,
			volume: 0.24,
			waveType: 'triangle'
		},

		// Ultra-deep rumble throughout for impact
		{
			frequency: 28,
			duration: 600,
			delay: 0,
			volume: 0.2,
			waveType: 'triangle'
		}
	],

	// "WIN!" success sound - sharp, punchy single syllable
	notification: [
		// Sharp attack for "W"
		{
			frequency: 330,
			duration: 80,
			delay: 0,
			volume: 0.25,
			waveType: 'sine'
		},
		{
			frequency: 165,
			duration: 100,
			delay: 0,
			volume: 0.28,
			waveType: 'sine'
		},
		{
			frequency: 82,
			duration: 120,
			delay: 0,
			volume: 0.24,
			waveType: 'triangle'
		},

		// Rising "I" part - quick upward sweep
		{
			frequency: 440,
			duration: 120,
			delay: 60,
			volume: 0.22,
			waveType: 'sine'
		},
		{
			frequency: 220,
			duration: 140,
			delay: 60,
			volume: 0.26,
			waveType: 'sine'
		},
		{
			frequency: 110,
			duration: 160,
			delay: 60,
			volume: 0.22,
			waveType: 'triangle'
		},

		// Hard "N!" ending - sharp cutoff
		{
			frequency: 523,
			duration: 200,
			delay: 140,
			volume: 0.24,
			waveType: 'sine'
		},
		{
			frequency: 261,
			duration: 220,
			delay: 140,
			volume: 0.28,
			waveType: 'sine'
		},
		{
			frequency: 130,
			duration: 240,
			delay: 140,
			volume: 0.25,
			waveType: 'triangle'
		},

		// Sub-bass punch
		{
			frequency: 65,
			duration: 300,
			delay: 0,
			volume: 0.22,
			waveType: 'triangle'
		}
	],

	// Deep, cinematic logout sequence - three descending steps
	logout: [
		// First note - "Da"
		{
			frequency: 220,
			duration: 300,
			delay: 0,
			volume: 0.2,
			waveType: 'sine'
		},
		{
			frequency: 110,
			duration: 350,
			delay: 0,
			volume: 0.22,
			waveType: 'sine'
		},
		{
			frequency: 55,
			duration: 400,
			delay: 0,
			volume: 0.18,
			waveType: 'sine'
		},

		// Second note - "Da"
		{
			frequency: 165,
			duration: 300,
			delay: 180,
			volume: 0.18,
			waveType: 'sine'
		},
		{
			frequency: 82,
			duration: 350,
			delay: 180,
			volume: 0.2,
			waveType: 'sine'
		},
		{
			frequency: 41,
			duration: 400,
			delay: 180,
			volume: 0.16,
			waveType: 'sine'
		},

		// Third note - "Daaa" (longer, final)
		{
			frequency: 110,
			duration: 600,
			delay: 360,
			volume: 0.22,
			waveType: 'sine'
		},
		{
			frequency: 55,
			duration: 650,
			delay: 360,
			volume: 0.24,
			waveType: 'sine'
		},
		{
			frequency: 27,
			duration: 700,
			delay: 360,
			volume: 0.2,
			waveType: 'sine'
		}
	],
};