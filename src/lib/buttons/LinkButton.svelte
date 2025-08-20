<script>
	import { navigating } from '$app/state';
	import { Spinner } from '$lib/loaders';
	import { playButtonSound } from '$lib/utils/audio.js';
	import { vibrateButton } from '$lib/utils/vibrate.js';

	/** @type {{disabled?: boolean, isLink?: boolean, href?: any, external?: boolean, children?: import('svelte').Snippet, [key: string]: any}} */
	let {
		disabled = false,
		isLink = false,
		href = null,
		external = false,
		underline = true,
		sound = true,
		sound_pattern = 'click',
		buzz = true,
		buzz_pattern = 'click',
		children,
		...rest
	} = $props();

	function handleClick(event) {
		// Play sound if enabled locally
		if (sound) {
			playButtonSound(sound_pattern);
		}

		// Trigger vibration if enabled locally
		if (buzz) {
			vibrateButton(buzz_pattern);
		}

		// Call the original onclick handler
		if (rest.onclick) {
			rest.onclick(event);
		}
	}
</script>

{#if isLink || href}
	<a
		class:disabled
		class:underline
		data-sveltekit-prefetch
		{...rest}
		role="button"
		href={href ?? 'javascript:void(0);'}
		target={external ? '_blank' : null}
		onclick={handleClick}>
		{@render children?.()}
	</a>
{:else}
	<button {...rest} class:disabled class:underline {disabled} onclick={handleClick}>
		{@render children?.()}
	</button>
{/if}

<style>
	button,
	a {
		border: none;
		background: none;
		cursor: pointer;
		font-size: inherit;
		text-decoration: none;

		color: var(--blue-6);
		padding-bottom: 2px;
		transition: box-shadow var(--transition) ease-in-out;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		white-space: nowrap;
		&:hover {
			color: var(--blue-9);
		}
		&.active {
			box-shadow: var(--blue-9) inset 0 -5px 0 -1px;
			color: var(--blue-9);
		}
		&.underline {
			box-shadow: var(--blue-9) 0 -2px 0 -1px inset;
			&:hover {
				box-shadow: var(--blue-9) inset 0 -3px 0 -1px;
			}
		}
	}
</style>
