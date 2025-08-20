<script>
	import { Button } from '$lib/buttons';
	import Icon from '$lib/Icon.svelte';

	const {
		title = 'Dialog Title',
		message = 'This is a message from the dialog.',
		type = 'alert',
		open = false,
		children,
		onConfirm = () => {},
		onCancel = () => {},
	} = $props();

	let dialogRef;

	$effect(() => {
		if (dialogRef && open) {
			dialogRef.showModal();
		} else if (dialogRef && !open) {
			dialogRef.close();
		}
	});

	// Function to find the form inside the dialog and submit it
	function handleConfirm() {
		const form = dialogRef.querySelector('form');
		if (form) {
			form.requestSubmit();
		} else {
			// Fallback if no form is found, run the default onConfirm prop
			onConfirm();
		}
	}
</script>

<dialog
	bind:this={dialogRef}
	class="modal dialog"
	aria-modal="true"
	aria-labelledby="dialog-title"
	aria-describedby="dialog-description">
	<header>
		<h2 id="dialog-title">{title}</h2>
		<Button size="icon" aria-label="Close dialog" onclick={onCancel}>
			{#snippet icon()}
				<Icon kind="cancel" size="15" />
			{/snippet}
		</Button>
	</header>

	<div id="dialog-description">
		{#if children}
			{@render children()}
		{:else}
			<p>{message}</p>
		{/if}
	</div>

	<footer>
		{#if type === 'alert'}
			<Button type="button" size="block" onclick={handleConfirm}>OKAY</Button>
		{:else if type === 'confirm'}
			<Button onclick={onCancel}>
				{#snippet icon()}
					<Icon kind="cancel" size="18" />
				{/snippet}
				Cancel
			</Button>

			<Button type="button" red onclick={handleConfirm}>
				{#snippet icon()}
					👍
				{/snippet}
				Confirm
			</Button>
		{/if}
	</footer>
</dialog>

<style>
	dialog {
		display: grid;
		grid-template-rows: min-content 1fr min-content;
		align-items: center;
		min-width: 369px;
		width: min-content;
		height: min-content;
		border: var(--border-size-1) solid var(--surface-3);
		border-radius: var(--radius-2);
		pointer-events: none;
		z-index: 6;
		position: fixed;
		align-self: anchor-center;
		background: var(--surface-1);

		&,
		&::backdrop {
			backdrop-filter: blur(12px);
			transition:
				display var(--transition) allow-discrete,
				overlay var(--transition) allow-discrete,
				transform var(--transition),
				opacity var(--transition);
			opacity: 0;
		}

		&[open] {
			opacity: 1;
			pointer-events: auto;
			transform: scale(1);
			&::backdrop {
				opacity: 1;
			}
		}

		@starting-style {
			&[open],
			&[open]::backdrop {
				opacity: 0;
			}
		}

		@media (prefers-reduced-motion: no-preference) {
			transform: scale(0.93);
		}

		header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			#dialog-title {
				margin: 0;
				flex: 1;
				text-align: left;
				color: var(--text-2);
			}
		}

		#dialog-description {
			margin: var(--size-3);
		}

		footer {
			display: flex;
			gap: var(--size-3);
			justify-content: space-around;
		}
	}
</style>
