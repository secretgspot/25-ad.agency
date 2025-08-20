<script>
	import { navigating } from '$app/state';
	import 'open-props/style';
	import FixedLine from '$lib/loaders/FixedLine.svelte';
	import { Toasts } from '$lib/toasts';

	let { children } = $props();
</script>

<Toasts />

{#if navigating.complete}
	<FixedLine kind="spiral" size="1" />
{:else}
	<main>
		{@render children?.()}
	</main>
{/if}

<style>
	main {
		container-type: inline-size;
		display: grid;
		margin-block-start: var(--size-8);
		gap: var(--size-8);
		margin-inline: var(--size-3);
		flex-grow: 1;

		/* Small tablets and larger mobile devices (481px - 768px) */
		@media (min-width: 481px) {
		}

		/* Tablets and small laptops (769px - 1024px) */
		@media (min-width: 769px) {
			grid-template-columns: 1fr 1fr;
			padding: 0 var(--size-3);
			margin-inline: 0;
			margin-block-start: 0;
		}

		/* Large desktops and high-resolution screens (1025px and up) */
		@media (min-width: 1025px) {
		}

		/* Extra-large screens (1440px and up) */
		@media (min-width: 1440px) {
		}
	}
</style>
