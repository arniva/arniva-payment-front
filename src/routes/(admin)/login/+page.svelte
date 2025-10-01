<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<div class="pt-5 row">
	<div class="col-8 offset-2 col-md-4 offset-md-4">
		<h1 class="text-center">Admin Login</h1>
		<form method="POST" autocomplete="off">
			<div class="mb-3">
				<label for="username" class="form-label">Username</label>
				<input
					type="text"
					class="form-control"
					id="username"
					name="username"
					autocomplete="off"
					required
				/>
			</div>
			<div class="mb-3">
				<label for="password" class="form-label">Password</label>
				<input
					type="password"
					class="form-control"
					id="password"
					name="password"
					autocomplete="new-password"
					required
				/>
			</div>
			{#if form?.errors?.message}
				<div class="alert alert-danger" role="alert">
					{form.errors?.message}
				</div>
			{/if}
			<button type="submit" class="btn btn-primary w-100">Login</button>
		</form>
	</div>
</div>
