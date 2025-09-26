<script lang="ts">
	let { year = $bindable(), month = $bindable(), onChange } = $props();
	// let yearSimple = $derived.by(() => (year.length === 4 ? year.slice(2) : year));

	let monthInput: HTMLInputElement;
	let yearInput: HTMLInputElement;

	let yearSimple = $derived.by(() => {
		console.log('year', year.length);
		let _y = String(year);
		if (_y.length === 4) {
			_y = _y.slice(2);
		}
		return _y;
	});

	function checkMonthIsValid() {
		if (month.length === 1 && Number(month) > 1) {
			month = '0' + month;
		} else if (month.length === 2) {
			if (Number(month) === 0) {
				month = '01';
			} else if (Number(month) > 12) {
				month = '12';
			}
			yearInput.focus();
		} else if (month.length > 2) {
			month = month.slice(0, 2);
			yearInput.focus();
		}
	}
	function checkYearIsValid() {
		if (yearSimple.length > 2) {
			yearSimple = yearSimple.slice(0, 2);
		}
		if (yearSimple.length === 2) {
			year = '20' + yearSimple;
			onChange?.();
		} else {
			year = yearSimple;
		}
	}

	function checkBackspace(event: KeyboardEvent) {
		if (event.key === 'Backspace' && yearSimple.length === 0) {
			monthInput.focus();
		}
	}
</script>

<div class="d-flex flex-column">
	<label class="form-label" for="">Ay/Yıl <code>*</code></label>
	<div class="border d-flex align-items-center rounded-3">
		<input
			bind:this={monthInput}
			oninput={checkMonthIsValid}
			bind:value={month}
			type="text"
			class="form-control border-0"
			id="monthInput"
			name="Ecom_Payment_Card_ExpDate_Month"
		/>
		<h6 class="mb-0 text-muted fw-light opacity-75">/</h6>
		<input
			id="yearInput"
			name="Ecom_Payment_Card_ExpDate_Year"
			bind:this={yearInput}
			bind:value={year}
			oninput={checkYearIsValid}
			onkeyup={checkBackspace}
			type="hidden"
		/>
		<input
			id="yearInput2"
			bind:this={yearInput}
			bind:value={yearSimple}
			oninput={checkYearIsValid}
			onkeyup={checkBackspace}
			type="text"
			class="form-control border-0"
		/>
	</div>
</div>

<style>
	input {
		max-width: 40px;
	}
	#monthInput {
		padding-right: 0;
		text-align: right;
	}
	#yearInput2 {
		padding-left: 0;
		text-align: left;
	}
	input:focus,
	input:focus-visible {
		box-shadow: none;
		border-color: #86b7fe;
		outline: 0;
	}
</style>
