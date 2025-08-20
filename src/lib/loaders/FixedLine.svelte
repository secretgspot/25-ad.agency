<script>
	let { kind = 'gradient', size = '3' } = $props(); // original, wave, pulse, breathing, elastic, dots, gradient, bounce, spiral, triple
</script>

<div class="loader {kind} active" style="--loader-height: {size}px" aria-live="polite">
</div>

<style>
	.loader {
		position: fixed;
		width: 100%;
		height: var(--loader-height);
		top: 0;
		left: 0;
		right: 0;
		overflow: hidden;
		z-index: 12;
	}

	/* 1. Original Dual Bar */
	.original {
		&:before,
		&:after {
			content: '';
			position: absolute;
			top: 0;
			width: 100%;
			height: var(--loader-height);
			transform: translate(-100%, 0);
		}

		&:before {
			background-color: var(--blue-6);
			animation: loading 3300ms cubic-bezier(0.23, 1, 0.32, 1) infinite;
		}

		&:after {
			background-color: var(--blue-3);
			animation: loading 3300ms 300ms cubic-bezier(0.23, 1, 0.32, 1) infinite;
		}
	}

	@keyframes loading {
		75% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(100%, 0);
		}
	}

	/* 2. Wave Effect */
	.wave {
		background: linear-gradient(90deg, transparent, var(--blue-6), transparent);
		animation: wave 1s ease-in-out infinite;
	}

	@keyframes wave {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	/* 3. Pulse Wave */
	.pulse {
		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 30%;
			height: 100%;
			background: linear-gradient(
				90deg,
				transparent,
				var(--blue-3),
				var(--blue-6),
				transparent
			);
			animation: pulse-move 1s ease-in-out infinite;
		}
	}

	@keyframes pulse-move {
		0% {
			transform: translateX(-100%);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			transform: translateX(350%);
			opacity: 0;
		}
	}

	/* 4. Breathing Line */
	.breathing {
		background: var(--blue-6);
		animation: breathing 1s ease-in-out infinite;
		transform-origin: center;
	}

	@keyframes breathing {
		0%,
		100% {
			transform: scaleX(0.1);
			opacity: 0.3;
		}
		50% {
			transform: scaleX(1);
			opacity: 1;
		}
	}

	/* 5. Elastic Stretch */
	.elastic {
		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 0%;
			height: 100%;
			background: var(--blue-6);
			animation: elastic 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
		}
	}

	@keyframes elastic {
		0% {
			width: 0%;
			left: 0%;
		}
		50% {
			width: 100%;
			left: 0%;
		}
		100% {
			width: 0%;
			left: 100%;
		}
	}

	/* 6. Racing Dots */
	.dots {
		&:before,
		&:after {
			content: '';
			position: absolute;
			top: 0;
			width: 20px;
			height: var(--loader-height);
			background: var(--blue-6);
		}
		&:before {
			animation: dot1 1.2s ease-in-out infinite;
		}

		&:after {
			animation: dot2 1.2s ease-in-out infinite 0.3s;
		}
	}

	@keyframes dot1 {
		0%,
		100% {
			transform: translateX(-30px);
		}
		50% {
			transform: translateX(calc(100vw - 20px));
		}
	}

	@keyframes dot2 {
		0%,
		100% {
			transform: translateX(-30px);
		}
		50% {
			transform: translateX(calc(100vw - 20px));
		}
	}

	/* 7. Gradient Flow */
	.gradient {
		background: linear-gradient(
			90deg,
			var(--blue-3) 0%,
			var(--purple-3) 25%,
			var(--red-3) 50%,
			var(--orange-3) 75%,
			var(--green-3) 100%
		);
		background-size: 300% 100%;
		animation: gradient-flow 3s ease-in-out infinite;
	}

	@keyframes gradient-flow {
		0%,
		100% {
			background-position: 300% 0%;
		}
		50% {
			background-position: -300% 0%;
		}
	}

	/* 8. Bouncing Line */
	.bounce {
		&:before {
			content: '';
			position: absolute;
			top: 0;
			width: 60px;
			height: var(--loader-height);
			background: var(--blue-6);
			animation: bounce-move 1s ease-in-out infinite;
		}
	}

	@keyframes bounce-move {
		0%,
		100% {
			transform: translateX(-60px);
			animation-timing-function: ease-in;
		}
		50% {
			transform: translateX(calc(100vw - 0px));
			animation-timing-function: ease-out;
		}
	}

	/* 9. Spiral Line */
	.spiral {
		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: var(--loader-height);
			background: linear-gradient(90deg, transparent, var(--blue-6), transparent);
			animation: spiral 1s linear infinite;
			transform-origin: center;
		}
	}

	@keyframes spiral {
		0% {
			transform: translateX(-100%) scaleX(0.5);
			opacity: 0;
		}
		50% {
			transform: translateX(0%) scaleX(1);
			opacity: 1;
		}
		100% {
			transform: translateX(100%) scaleX(0.5);
			opacity: 0;
		}
	}

	/* 10. Triple Wave */
	.triple {
		background: linear-gradient(90deg, transparent, var(--blue-6), transparent);
		background-size: 30% 100%;
		animation: triple3 1s ease-in-out infinite 0.6s;

		&:before,
		&:after {
			content: '';
			position: absolute;
			top: 0;
			width: 30%;
			height: var(--loader-height);
			background: var(--blue-6);
		}
		&:before {
			animation: triple1 1s ease-in-out infinite;
		}

		&:after {
			animation: triple2 1s ease-in-out infinite 0.4s;
		}
	}

	@keyframes triple1 {
		0%,
		100% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(250%);
		}
	}

	@keyframes triple2 {
		0%,
		100% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(250%);
		}
	}

	@keyframes triple3 {
		0%,
		100% {
			background-position: -100% center;
		}
		50% {
			background-position: 250% center;
		}
	}
</style>
