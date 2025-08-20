<script>
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { Button, Toggle } from '$lib/buttons';
	import { compressFile } from '$lib/utils/file.js';
	import { addToast } from '$lib/toasts';
	import Icon from '$lib/Icon.svelte';

	let {
		selectedAd = null,
		onClearSelection,
		onDeleteConfirm,
		resetTrigger = 0,
	} = $props();

	let compressedFile = $state(null);
	let previewUrl = $state(null);
	let fileInput = $state();
	let loading = $state(false);

	let formData = $state({
		id: null,
		title: '',
		href: '',
		width: 320,
		height: 100,
		weight: 1,
		active: true,
	});

	// Watch for selectedAd changes and update form data
	$effect(() => {
		if (selectedAd) {
			Object.assign(formData, selectedAd);
			previewUrl = selectedAd.file;
		} else {
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
	});

	// Watch for reset trigger to clear form when creating new ads
	$effect(() => {
		if (resetTrigger > 0 && !selectedAd) {
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
	});

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
		previewUrl = selectedAd?.file || null;
		if (fileInput) fileInput.value = '';
	}

	function handleClearSelection() {
		onClearSelection?.();
	}

	function handleDeleteConfirm() {
		if (selectedAd) {
			onDeleteConfirm?.(selectedAd);
		}
	}
</script>

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
				if (!selectedAd) {
					// For new ads, trigger form reset
					onClearSelection?.();
				} else {
					// For updates, clear selection
					handleClearSelection();
				}
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
				onclick={handleClearSelection}
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
				onclick={handleDeleteConfirm}
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

<style>
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
