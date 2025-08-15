<script lang="ts">
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';

	let { data, children }: LayoutProps = $props();
</script>

<div class="d-flex align-items-start justify-content-between">
	<div class="d-flex align-items-center gap-2">
		<i class="bi text-large bi-cash-coin text-primary me-2"></i>
		{#if page?.data?.image}
			<img src={page.data.image} height="75" alt="" />
		{/if}
		<div>
			<h3 class="page-title mb-0">{page?.data?.title}</h3>
			<h5 class="page-subtitle text-muted">{page?.data?.subtitle}</h5>
		</div>
	</div>
	<a href="/" class="btn btn-outline-secondary d-none d-md-block">
		<i class="bi bi-arrow-left"></i>
		Ana Sayfa</a
	>
</div>
<article class="py-4 payment-page">
	{@render children()}
</article>

<style>
	.text-large {
		font-size: 3.5rem;
	}
</style>
