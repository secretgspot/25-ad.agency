<script>
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { Button, LinkButton, Toggle } from '$lib/buttons';
	import { compressFile } from '$lib/utils/file.js';
	import Divider from '$lib/Divider.svelte';
	import { addToast } from '$lib/toasts';
	import Icon from '$lib/Icon.svelte';
	import Dialog from '$lib/Dialog.svelte';

	let { data } = $props();

	let selectedAd = $state(null);
	let compressedFile = $state(null);
	let previewUrl = $state(null);
	let fileInput = $state();
	let loading = $state(false);
	let showDeleteDialog = $state(false);
	let adToDelete = $state(null);

	let formData = $state({
		id: null,
		title: '',
		href: '',
		width: 320,
		height: 100,
		weight: 1,
		active: true,
	});

	function selectAd(ad) {
		selectedAd = ad;
		Object.assign(formData, ad);
		previewUrl = ad.file;
	}

	function clearSelection() {
		selectedAd = null;
		formData = {
			id: null,
			title: '',
			href: '',
			width: 320,
			height: 100,
			weight: 1,
			active: true,
		};
		resetFileState();
	}

	async function handleFileChange(event) {
		const file = event.target.files[0];
		if (!file) {
			resetFileState();
			return;
		}

		console.log('Original file size:', file.size, 'bytes');

		try {
			const { file: compressed, previewUrl: url } = await compressFile(file);
			compressedFile = compressed;
			previewUrl = url;
			console.log('Compressed file size:', compressedFile.size, 'bytes');
		} catch (err) {
			addToast({
				message: 'Image compression failed.',
				type: 'error',
				dismissible: true,
				timeout: 0,
			});
			resetFileState();
		}
	}

	function resetFileState() {
		compressedFile = null;
		previewUrl = null;
		if (fileInput) fileInput.value = '';
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

<!-- Main create/update form -->
<aside>
	<form
		class="ad-form"
		method="POST"
		action={selectedAd ? '?/updateAd' : '?/createAd'}
		enctype="multipart/form-data"
		use:enhance={({ formData: enhanceFormData, cancel }) => {
			loading = true;

			// Append compressed file if available
			if (compressedFile) {
				enhanceFormData.append('image_file', compressedFile);
			}

			return async ({ result, update }) => {
				loading = false;

				if (result.type === 'success') {
					addToast({
						message: result.data?.message || 'Ad saved successfully!',
						type: 'success',
						timeout: 1200,
					});
					clearSelection();
					await invalidateAll();
				} else if (result.type === 'failure') {
					addToast({
						message: result.data?.message || 'Failed to save ad.',
						type: 'error',
						dismissible: true,
						timeout: 0,
					});
				} else if (result.type === 'error') {
					addToast({
						message: 'An unexpected error occurred.',
						type: 'error',
						dismissible: true,
						timeout: 0,
					});
				}
			};
		}}>
		<input type="hidden" name="id" value={formData.id} />

		<div class="form-group">
			<label for="title" class="form-label">Title</label>
			<input
				class="form-input"
				type="text"
				id="title"
				name="title"
				bind:value={formData.title}
				required
				disabled={loading} />
		</div>

		<div class="form-group">
			<label for="href" class="form-label">Link URL</label>
			<input
				class="form-input"
				type="url"
				id="href"
				name="href"
				bind:value={formData.href}
				required
				disabled={loading} />
		</div>

		<div class="form-group">
			<label for="file" class="form-label">Image</label>
			{#if previewUrl}
				<img src={previewUrl} alt="Ad preview" class="ad-preview" />
			{/if}
			<input
				class="form-input"
				type="file"
				id="file"
				name="image_file"
				accept="image/*"
				onchange={handleFileChange}
				bind:this={fileInput}
				disabled={loading} />
		</div>

		<div class="form-group-row">
			<div class="form-group">
				<label for="width" class="form-label">Width</label>
				<input
					class="form-input"
					type="number"
					id="width"
					name="width"
					bind:value={formData.width}
					required
					disabled={loading} />
			</div>
			<div class="form-group">
				<label for="height" class="form-label">Height</label>
				<input
					class="form-input"
					type="number"
					id="height"
					name="height"
					bind:value={formData.height}
					required
					disabled={loading} />
			</div>
			<div class="form-group">
				<label for="weight" class="form-label">Weight</label>
				<input
					class="form-input"
					type="number"
					id="weight"
					name="weight"
					bind:value={formData.weight}
					required
					disabled={loading} />
			</div>
		</div>

		<div class="form-group">
			<Toggle bind:checked={formData.active} label="Active" />
			<input type="hidden" name="active" value={formData.active} />
		</div>

		<div class="form-actions">
			<Button type="submit" right shadow {loading} disabled={loading}>
				{#snippet icon()}
					{#if selectedAd}
						<Icon kind="update" size="21" />
					{:else}
						📌
					{/if}
				{/snippet}
				{loading ? 'Saving...' : selectedAd ? 'Update Ad' : 'Create Ad'}
			</Button>

			{#if selectedAd}
				<Button
					type="button"
					shadow
					onclick={() => clearSelection()}
					{loading}
					disabled={loading}>
					{#snippet icon()}
						<Icon kind="cancel" size="21" />
					{/snippet}
					Cancel
				</Button>

				<Button
					type="button"
					size="small"
					onclick={() => confirmDelete(selectedAd)}
					{loading}
					disabled={loading}
					red>
					{#snippet icon()}
						<Icon kind="delete" size="21" />
					{/snippet}
					Delete
				</Button>
			{/if}
		</div>
	</form>
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

		:global(button.ad-card) {
			border: var(--border-size-1) solid var(--surface-3);
			border-radius: var(--radius-2);
			padding: var(--size-2);
			flex-direction: column;
			align-items: initial;
			color: var(--text-1);
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

	/* Form Tab Styles */
	.ad-form {
		margin-block: var(--size-3) var(--size-9);
		margin-inline: var(--size-1);

		/* Tablets and small laptops (769px - 1024px) */
		@media (min-width: 769px) {
			position: sticky;
			top: var(--size-9);
		}

		.ad-preview {
			max-width: 100%;
			height: auto;
			margin-bottom: var(--size-3);
			border-radius: var(--radius-2);
		}

		.form-group-row {
			display: flex;
			gap: var(--size-3);
		}
	}
</style>
