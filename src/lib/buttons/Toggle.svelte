<!-- Toggle.svelte -->
<script>
	import { playButtonSound } from '$lib/utils/audio.js';
	import { vibrateButton } from '$lib/utils/vibrate.js';

	let {
		checked = $bindable(false),
		label,
		sound = true,
		sound_pattern = 'basic',
		buzz = true,
		buzz_pattern = 'click',
	} = $props();

	function handleChange() {
		// Play sound if enabled locally
		if (sound) {
			playButtonSound(sound_pattern);
		}

		// Trigger vibration if enabled locally
		if (buzz) {
			vibrateButton(buzz_pattern);
		}
	}

	function toKebabCase(label) {
		return label.toLowerCase().replace(/\s/g, '-');
	}
</script>

<label class="toggle-container">
	<input
		type="checkbox"
		id={'toggle_' + toKebabCase(label)}
		bind:checked
		onchange={handleChange} />
	<div class="toggle-switch"></div>
	<span class="toggle-label">{label}</span>
</label>

<style>
	.toggle-container {
		display: flex;
		align-items: center;
		cursor: pointer;
		user-select: none;
		gap: var(--size-3);
		input {
			display: none;
			&:checked + .toggle-switch {
				outline-color: var(--surface-3); /* On state background */

				&::before {
					transform: translateX(20px); /* Move knob to the right */
					background-color: var(--green-4); /* Knob color */
				}
			}
		}
	}

	.toggle-switch {
		position: relative;
		width: 40px;
		height: 20px;
		outline: 1px solid var(--surface-2);
		border-radius: var(--radius-2);
		&::before {
			content: '';
			position: absolute;
			top: 2px;
			left: 2px;
			width: 16px; /* Size of the toggle knob */
			height: 16px; /* Size of the toggle knob */
			background-color: var(--surface-4); /* Knob color */
			border-radius: inherit;
			transition: transform var(--transition) ease-in-out;
		}
	}

	.toggle-label {
		color: inherit;
	}
</style>
