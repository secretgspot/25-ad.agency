<!-- Ads.svelte (Refactored) -->
<script>
	import { onMount } from 'svelte';

	/**
	 * @typedef {Object} AdConfig
	 * @property {string} id - Unique ad identifier
	 * @property {string} file - Image filename
	 * @property {string} title - Ad title/alt text
	 * @property {string} href - Click destination URL
	 * @property {number} width - Ad width in pixels
	 * @property {number} height - Ad height in pixels
	 * @property {number} [weight] - Weight for random selection (higher = more likely)
	 * @property {boolean} [active] - Whether the ad is currently active
	 */

	/** @type {AdConfig | null} */
	let selectedAd = $state(null);
	let impressionLogged = $state(false);

	/**
	 * Logs ad impression for analytics
	 * @param {AdConfig} ad
	 */
	async function logImpression(ad) {
		if (impressionLogged || !ad.id) return;

		impressionLogged = true;

		try {
			const response = await fetch(`/api/ads/${ad.id}/impression`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				console.error('Failed to log ad impression:', response.status, response.statusText);
			}
		} catch (error) {
			console.error('Error logging ad impression:', error);
		}
	}

	/**
	 * Logs ad click for analytics
	 * @param {AdConfig} ad
	 */
	async function logClick(ad) {
		if (!ad.id) return;

		try {
			const response = await fetch(`/api/ads/${ad.id}/click`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				console.error('Failed to log ad click:', response.status, response.statusText);
			}
		} catch (error) {
			console.error('Error logging ad click:', error);
		}
	}

	// Load a single ad on mount
	onMount(async () => {
		try {
			const response = await fetch('/api/ads/ad');
			if (!response.ok) {
				if (response.status === 404) {
					// No ad available, which is a valid state
					selectedAd = null;
				} else {
					throw new Error(`HTTP ${response.status}`);
				}
			} else {
				selectedAd = await response.json();
			}
		} catch (error) {
			console.error('Error loading ad:', error);
			selectedAd = null; // Ensure no broken ad is shown
		}
	});

	// Log impression when ad becomes available and visible
	$effect(() => {
		if (selectedAd && !impressionLogged) {
			// Small delay to ensure DOM is rendered and ad is visible
			const timeoutId = setTimeout(() => logImpression(selectedAd), 1000);
			return () => clearTimeout(timeoutId);
		}
	});
</script>

{#if selectedAd}
	<a
		class="advertising"
		style="width:{selectedAd.width}px; height:{selectedAd.height}px; aspect-ratio:{selectedAd.width}/{selectedAd.height};"
		href={selectedAd.href}
		target="_blank"
		rel="noopener noreferrer"
		title={selectedAd.title}
		aria-label={selectedAd.title}
		onclick={(event) => logClick(selectedAd, event)}>
		<img
			src={selectedAd.file}
			alt={selectedAd.title}
			width={selectedAd.width}
			height={selectedAd.height}
			loading="lazy"
			decoding="async" />
	</a>
{:else}
	<!-- Fallback placeholder -->
	<div class="advertising-placeholder" aria-label="Advertisement placeholder">
		<small class="placeholder-text">
			320×100<br />
			<span class="ad-text">AD</span>
		</small>
	</div>
{/if}

<style>
	.advertising {
		position: relative;
		display: block;
		line-height: 0;
		text-decoration: none;
		border-radius: var(--radius-2);
		background: var(--surface-2);
		color: var(--text-1);

		&:hover {
			filter: brightness(1.05);
		}

		&::after {
			content: 'ad';
			position: absolute;
			top: var(--size-1);
			right: var(--size-1);
			color: var(--text-2);
			line-height: 1;
			text-transform: uppercase;
			background: var(--surface-1);
			padding: calc(var(--size-1) / 2) var(--size-1);
			border-radius: var(--radius-2);
			pointer-events: none;
			font-size: xx-small;
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			border-radius: inherit;
		}
	}

	.advertising-placeholder {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		background: var(--surface-2);
		color: var(--text-1);
		border-radius: var(--radius-2);
		place-self: center;
		width: 320px;
		height: 100px;
		aspect-ratio: 320/100;

		.placeholder-text {
			font-size: small;
			font-weight: 500;
			user-select: none;

			.ad-text {
				font-weight: 700;
				opacity: 0.7;
			}
		}
	}
</style>
