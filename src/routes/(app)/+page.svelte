<script>
	import { invalidateAll } from '$app/navigation';
	import { LinkButton } from '$lib/buttons';
	import Divider from '$lib/Divider.svelte';
	import { addToast } from '$lib/toasts';
	import Dialog from '$lib/Dialog.svelte';
	import Form from '$lib/Form.svelte';

	let { data } = $props();

	let selectedAd = $state(null);
	let loading = $state(false);
	let showDeleteDialog = $state(false);
	let adToDelete = $state(null);
	let resetTrigger = $state(0);

	function selectAd(ad) {
		selectedAd = ad;
	}

	function clearSelection() {
		selectedAd = null;
		resetTrigger += 1; // Increment to trigger form reset
	}

	function confirmDelete(ad) {
		adToDelete = ad;
		showDeleteDialog = true;
	}

	async function deleteAd() {
		if (!adToDelete) return;

		loading = true;
		const formData = new FormData();
		formData.append('id', adToDelete.id);

		const response = await fetch('?/deleteAd', {
			method: 'POST',
			body: formData,
		});

		loading = false;
		showDeleteDialog = false;

		if (response.ok) {
			addToast({
				message: 'Ad deleted successfully!',
				type: 'success',
				timeout: 1200,
			});
			clearSelection();
			await invalidateAll();
		} else {
			addToast({
				message: 'Failed to delete ad.',
				type: 'error',
				dismissible: true,
				timeout: 0,
			});
		}
		adToDelete = null;
	}
</script>

<!-- Form component -->
<aside>
	<Form
		{selectedAd}
		{resetTrigger}
		onClearSelection={clearSelection}
		onDeleteConfirm={confirmDelete} />
</aside>

{#if data.ads.length === 0}
	<p class="no-ads">No ads found. Create your first ad!</p>
{:else}
	<div class="ads-grid">
		<Divider>Ads - ({data.ads.length})</Divider>

		{#each data.ads as ad}
			<LinkButton underline={false} class="ad-card" onclick={() => selectAd(ad)}>
				{#if ad.file}
					<img src={ad.file} alt={ad.title} class="ad-thumbnail" />
				{/if}
				<div class="ad-info">
					<h4>{ad.title}</h4>
					<p class="ad-url">{ad.href}</p>
					<div class="ad-meta">
						<span class="ad-dimensions">{ad.width}×{ad.height}</span>
						<span class="ad-impressions">Impressions: {ad.impressions || 0}</span>
						<span class="ad-clicks">Clicks: {ad.clicks || 0}</span>
						<span class="ad-status" class:active={ad.active} class:inactive={!ad.active}>
							{ad.active ? 'Active' : 'Inactive'}
						</span>
					</div>
				</div>
			</LinkButton>
		{/each}
	</div>
{/if}

<Dialog
	open={showDeleteDialog}
	title="Delete Ad"
	message="Are you sure you want to delete the ad '{adToDelete?.title}'? This action cannot be undone."
	type="confirm"
	onConfirm={deleteAd}
	onCancel={() => (showDeleteDialog = false)} />

<style>
	.no-ads {
		text-align: center;
		color: var(--text-2);
		padding: var(--size-3);
	}

	.ads-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--size-3);
		margin-bottom: var(--size-9);
		margin-inline: var(--size-1);

		:global(.text-divider) {
			z-index: 1;
			position: sticky;
			top: 0;
			background: var(--surface-1);
			padding-block: var(--size-3);
		}

		:global(button.ad-card) {
			border: var(--border-size-1) solid var(--surface-3);
			border-radius: var(--radius-2);
			padding: var(--size-2);
			flex-direction: column;
			align-items: initial;
			color: var(--text-1);
			height: min-content;
			&:hover {
				border-color: var(--surface-4);
				color: var(--text-1);
			}

			.ad-thumbnail {
				width: 100%;
				object-fit: cover;
				border-radius: var(--radius-2);
				margin-bottom: var(--size-3);
			}

			.ad-info {
				h4 {
					margin-block: 0 var(--size-2);
				}

				.ad-url {
					color: var(--text-2);
					font-size: small;
					margin-block: 0 var(--size-3);
					word-break: break-all;
				}

				.ad-meta {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					align-items: center;
					font-size: small;

					.ad-impressions,
					.ad-clicks {
						background: var(--surface-2);
						padding: var(--size-1) var(--size-2);
						border-radius: var(--radius-2);
						color: var(--text-2);
						margin-inline-end: var(--size-1);
						margin-block-end: var(--size-1);
					}

					.ad-dimensions {
						background: var(--surface-2);
						padding: var(--size-1) var(--size-2);
						border-radius: var(--radius-2);
						color: var(--text-2);
					}

					.ad-status {
						padding: var(--size-1) var(--size-2);
						border: var(--border-size-1) solid;
						border-radius: var(--radius-2);
						&.active {
							border-color: var(--color-green);
						}

						&.inactive {
							border-color: var(--color-red);
						}
					}
				}
			}
		}
	}
</style>
