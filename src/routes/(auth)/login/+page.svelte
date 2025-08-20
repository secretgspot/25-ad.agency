<script>
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/toasts';
	import Button from '$lib/buttons/Button.svelte';
	import Logo from '$lib/Logo.svelte';

	let loading = $state(false);
</script>

<div class="login-form-container">
	<Logo size="300" />

	<form
		method="POST"
		action="?/login"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				if (result.type === 'redirect') {
					window.location.href = result.location;
				} else if (result.type === 'failure') {
					addToast({
						message: result.data?.message || 'Invalid password',
						type: 'error',
					});
				}
				loading = false;
			};
		}}>
		<div class="form-group">
			<label for="password" class="form-label"
				>Password <span class="required">*</span></label>
			<input
				type="password"
				class="form-input"
				id="password"
				name="password"
				required
				disabled={loading} />
		</div>

		<Button type="submit" {loading} disabled={loading}>
			{#snippet icon()}
				⛔
			{/snippet}
			{loading ? 'Logging in...' : 'Login'}
		</Button>
	</form>
</div>

<style>
	.login-form-container {
		grid-column: 1 / -1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--size-6);
		margin-block: var(--size-6);
	}

	form {
		display: flex;
		flex-direction: column;
		width: 300px;
		gap: var(--size-5);
	}

	.form-group {
		margin-bottom: 0;
	}

	.error {
		border: var(--border-size-1) solid var(--red-6);
		padding: var(--size-3);
		border-radius: var(--radius-2);
	}
</style>
