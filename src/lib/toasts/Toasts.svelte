<script>
	import { toasts, dismissToast } from './store.js';
	import Toast from './Toast.svelte';
</script>

{#if $toasts.length > 0}
	<section>
		{#each $toasts as toast (toast.id)}
			<Toast
				type={toast.type}
				dismissible={toast.dismissible}
				ondismiss={() => dismissToast(toast.id)}>{toast.message}</Toast>
		{/each}
	</section>
{/if}

<style>
	section {
		position: fixed;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: var(--size-1);
		justify-content: center;
		flex-direction: column;
		align-items: flex-end;
		z-index: 12;
	}
</style>
