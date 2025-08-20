<script>
	// export let color = 'rgba(0,0,0,0.9)';
	/** @type {{size?: number, speed?: number, thickness?: number, gap?: number, radius?: number}} */
	let { size = 25, speed = 720, thickness = 1, gap = 30, radius = 12 } = $props();
	let dash = $derived((2 * Math.PI * radius * (100 - gap)) / 100);
</script>

<svg
	height={size}
	width={size}
	style="animation-duration:{speed}ms;"
	class="svelte-spinner"
	viewbox="0 0 32 32">
	<circle
		role="presentation"
		cx="16"
		cy="16"
		r={radius}
		stroke="var(--blue-6)"
		fill="none"
		stroke-width={thickness}
		stroke-dasharray="{dash},100"
		stroke-linecap="round" />
</svg>

<style>
	.svelte-spinner {
		transition-property: transform;
		animation-name: svelte-spinner_infinite-spin;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
	@keyframes svelte-spinner_infinite-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
