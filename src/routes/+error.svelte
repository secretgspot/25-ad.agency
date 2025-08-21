<script>
	import { page } from '$app/stores';
</script>

<div class="error-wrapper">
	<h1>{$page.status}</h1>
	<p>{$page.error.message}</p>
</div>

<style>
	.error-wrapper {
		display: grid;
		justify-items: center;
		align-content: center;
		grid-column: 1 / -1;

		& * {
			grid-area: 1/1;
			margin: 0;
			padding: 0;
		}

		h1 {
			align-content: center;
			font-size: 6rem;
			color: var(--surface-4);
		}
		p {
			align-content: center;
		}
	}
</style>
