<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js?url';
	import { Navbar } from '@components';
	import '@styles';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src={bootstrap} defer></script>
</svelte:head>
<Navbar />
<main class="py-4 px-lg-4">
	<div class="container">
		{@render children?.()}
	</div>
</main>
