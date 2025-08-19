<script>
	import { onMount } from 'svelte';

	let { maxYear, minYear, value = $bindable() } = $props();
	let dropdownEl;
	let inputEl;
	let buttons = [];
	let dd;
	let opened = $state(false);
	let focused = $state(false);

	onMount(() => {
		console.log('Component mounted');
		buttons = Array.from(dropdownEl.querySelectorAll('.dropdown-item'));
		console.log('buttons', buttons);
		if (!dd) dd = bootstrap.Dropdown.getOrCreateInstance(dropdownEl);
	});

	export function open() {
		console.log('Testing...');

		if (!focused && !opened) {
			focused = true;
			opened = true;
			if (dropdownEl) {
				console.log('==============');
				if (dd && inputEl) {
					inputEl.focus();
					setTimeout(() => {
						let shown = dd._menu.classList.contains('show');
						if (!shown) {
							dd.show();
						}
					}, 100);
				}
			}
		}
	}

	function handleNavigation(node) {
		node.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				buttons[0]?.focus();
			}
		});
	}
</script>

<label for="validUntilYear" class="form-label">Yıl <code>*</code></label>

<div class="dropdown" bind:this={dropdownEl} use:handleNavigation>
	<input
		class="form-control"
		type="number"
		onfocus={open}
		onmousedown={open}
		onkeydown={open}
		onkeyup={open}
		onclick={open}
		bind:value
		min={minYear}
		max={maxYear}
		data-bs-toggle="dropdown"
		bind:this={inputEl}
	/>
	<ul class="dropdown-menu w-100">
		{#each Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i) as year (year)}
			<li><button type="button" class="dropdown-item">{year}</button></li>
		{/each}
	</ul>
</div>
