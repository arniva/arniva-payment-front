<script lang="ts">
	import { onMount } from 'svelte';

	let { maxYear, minYear, value = $bindable(), onChange } = $props();
	let dropdownEl: HTMLDivElement | null;
	let inputEl: HTMLInputElement | null;
	let buttons: HTMLButtonElement[] = [];
	let dd: BootstrapDropdown | undefined;

	onMount(() => {
		if (dropdownEl) {
			buttons = Array.from(dropdownEl.querySelectorAll('.dropdown-item'));
			if (!dd) dd = bootstrap.Dropdown.getOrCreateInstance(dropdownEl);
		}

		// Add manual click-outside handler as backup
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownEl &&
				!dropdownEl.contains(event.target as Node) &&
				dd._menu.classList.contains('show')
			) {
				dd.hide();
			}
		};

		document.addEventListener('click', handleClickOutside);

		// Cleanup on destroy
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	export function open() {
		console.log('opening');
		if (dropdownEl && dd) {
			// Ensure Bootstrap knows this dropdown should respond to outside clicks
			dd._config.autoClose = true;

			setTimeout(() => {
				let shown = dd._menu.classList.contains('show');
				if (!shown) {
					dd.show();
				}
			}, 100);
			if (inputEl) inputEl.focus();
		}
	}

	function trigger() {
		console.log('triggering');
	}

	function handleInput(event: Event) {
		if (!event?.target || !(event.target instanceof HTMLInputElement)) return;
		const inputValue = event.target.value;

		// Limit to 4 digits
		if (inputValue.length > 4) {
			event.target.value = inputValue.slice(0, 4);
			value = parseInt(event.target.value, 10);
			return;
		}

		// If there's any input, validate range immediately
		if (inputValue.length > 0) {
			const year = parseInt(inputValue, 10);

			// Check if the partial or complete year could be valid
			// For partial inputs, check if it could lead to a valid year
			if (inputValue.length < 4) {
				// Generate all valid years in the range
				const validYears = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

				// Check if this partial input could lead to any valid year
				const couldBeValid = validYears.some((validYear) => {
					const validYearStr = validYear.toString();
					return validYearStr.startsWith(inputValue);
				});

				console.log(
					`Input: "${inputValue}", Valid years: [${validYears.join(', ')}], Could be valid: ${couldBeValid}`
				);

				if (!couldBeValid) {
					// Keep the previous valid input instead of clearing completely
					const prevValue = inputValue.slice(0, -1);
					event.target.value = prevValue;
					value = prevValue ? parseInt(prevValue, 10) : undefined;
					return;
				}
			} else {
				// Complete 4-digit year - check exact range
				if (year < minYear || year > maxYear) {
					// Keep the previous valid input instead of clearing completely
					const prevValue = inputValue.slice(0, -1);
					event.target.value = prevValue;
					value = prevValue ? parseInt(prevValue, 10) : undefined;
					return;
				} else {
					// Valid 4-digit year - close dropdown and call onChange
					if (dd && dd._menu.classList.contains('show')) {
						dd.hide();
					}
					if (onChange) {
						onChange();
					}
				}
			}
		}

		// Update bound value
		value = inputValue ? parseInt(inputValue, 10) : undefined;
	}

	function handleKeyDown(event: KeyboardEvent) {
		const target = event.target as HTMLInputElement;

		// Allow: backspace, delete, tab, escape, enter
		if (
			['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(event.key) ||
			// Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
			(event.key === 'a' && event.ctrlKey) ||
			(event.key === 'c' && event.ctrlKey) ||
			(event.key === 'v' && event.ctrlKey) ||
			(event.key === 'x' && event.ctrlKey) ||
			// Allow: home, end, left, right, down, up
			['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)
		) {
			return;
		}

		// Ensure that it is a number and stop the keypress
		if (!/^[0-9]$/.test(event.key)) {
			event.preventDefault();
		}

		// Don't allow more than 4 digits
		if (
			target?.value &&
			target.value.length >= 4 &&
			!['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(event.key)
		) {
			event.preventDefault();
		}
	}

	function handleNavigation(node: HTMLDivElement) {
		node.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				buttons[0]?.focus();
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();
				buttons[buttons.length - 1]?.focus();
			} else if (event.key === 'Enter') {
				const activeElement = document.activeElement;
				if (activeElement && activeElement.classList.contains('dropdown-item')) {
					value = parseInt(activeElement.textContent, 10);
					dd.hide();
					// Call onChange when year is selected via Enter key
					if (onChange) {
						onChange();
					}
				}
			}
		});
	}

	function selectYear(selectedYear: number) {
		value = selectedYear;
		dd.hide();
		if (inputEl) inputEl.focus();

		// Call onChange when year is selected via button
		if (onChange) {
			onChange();
		}
	}

	function handleButtonKeydown(event: KeyboardEvent, year: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectYear(year);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			const currentIndex = buttons.findIndex((btn) => btn === event.target);
			const nextButton = buttons[currentIndex + 1];
			if (nextButton) {
				nextButton.focus();
			}
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			const currentIndex = buttons.findIndex((btn) => btn === event.target);
			const prevButton = buttons[currentIndex - 1];
			if (prevButton) {
				prevButton.focus();
			} else {
				// If at first item, focus back to input
				if (inputEl) inputEl.focus();
			}
		} else if (event.key === 'Escape') {
			dd.hide();
			if (inputEl) inputEl.focus();
		}
	}
</script>

<label for="validUntilYear" class="form-label">Yıl <code>*</code></label>

<div class="dropdown" bind:this={dropdownEl} use:handleNavigation>
	<input
		class="form-control"
		type="text"
		onfocus={trigger}
		onmousedown={trigger}
		onclick={trigger}
		oninput={handleInput}
		onkeydown={handleKeyDown}
		bind:value
		maxlength="4"
		data-bs-toggle="dropdown"
		bind:this={inputEl}
	/>
	<ul class="dropdown-menu w-100">
		{#each Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i) as year (year)}
			<li>
				<button
					type="button"
					class="dropdown-item"
					onclick={() => selectYear(year)}
					onkeydown={(event) => handleButtonKeydown(event, year)}
					tabindex="-1"
				>
					{year}
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	input {
		width: 100px;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 6 7 7 7-7'/%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 8px center;
		background-size: 16px 12px;
		padding-right: 32px;
		cursor: pointer;
	}

	input:focus {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23086cb3' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 6 7 7 7-7'/%3e%3c/svg%3e");
	}
	.dropdown-menu {
		width: 100px;
	}
	@media (max-width: 768px) {
		input {
			width: 100%;
		}
	}
</style>
