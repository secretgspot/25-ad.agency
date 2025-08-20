<script>
	let { children } = $props();
</script>

{#if children}
	<div class="text-divider">{@render children()}</div>
{/if}

<style>
	.text-divider {
		display: flex;
		align-items: center;
		font-size: 0.9375rem;
		text-transform: uppercase;
		letter-spacing: 1px;

		&::before,
		&::after {
			content: '';
			height: 1px;
			background-color: var(--surface-4);
			flex-grow: 1;
		}

		&::before {
			margin-right: var(--size-3);
		}

		&::after {
			margin-left: var(--size-3);
		}
	}
</style>
