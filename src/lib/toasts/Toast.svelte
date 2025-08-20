<script>
	import { fade } from 'svelte/transition';

	/** @type {{type?: string, dismissible?: boolean, children?: import('svelte').Snippet, ondismiss?: () => void}} */
	let { type = '', dismissible = true, children, ondismiss } = $props();

	function handleDismiss() {
		ondismiss?.();
	}
</script>

<i class="toast {type}" role="alert" transition:fade|global>
	{#if type === 'success'}
		👍
	{:else if type === 'error'}
		👎
	{:else}
		👀
	{/if}

	<div class="text">
		{@render children?.()}
	</div>

	{#if dismissible}
		<button class="close" onclick={handleDismiss}> ❌ </button>
	{/if}
</i>

<style>
	.toast {
		display: flex;
		border-radius: var(--radius-2);
		border: var(--border-size-1) solid var(--surface-3);
		align-items: center;
		padding: var(--size-1) var(--size-2);
		gap: var(--size-2);
		pointer-events: auto;
	}
	.error {
		background: var(--red-1);
		border-color: var(--red-3);
		color: var(--red-11);
	}
	.success {
		background: var(--green-1);
		border-color: var(--green-3);
		color: var(--green-11);
	}
	.info {
		background: var(--blue-1);
		border-color: var(--blue-3);
		color: var(--blue-11);
	}
	.text {
		font-size: smaller;
	}
	.close {
		background: transparent;
		border: 0 none;
		padding: 0;
		cursor: pointer;
		pointer-events: auto;
		&:hover {
			opacity: 0.7;
		}
	}
</style>
