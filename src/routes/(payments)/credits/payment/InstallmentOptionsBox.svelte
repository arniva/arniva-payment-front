<script>
	import { calculateInstallmentAmount, formatTurkishCurrency } from './functions.svelte';
	let { selectedPackage, formData = $bindable(), installmentOptions } = $props();
</script>

<div class="installment-options-box bg-light p-3">
	<label for="installments" class="form-label d-flex align-items-center justify-content-between"
		><span>Taksit Sayısı <code>*</code></span>
	</label>
	{#each installmentOptions as option (option.value)}
		{@const calculatedAmounts = calculateInstallmentAmount(
			option.value,
			selectedPackage,
			installmentOptions
		)}
		<div class="list-group list-group-radio d-grid gap-2 border-0 mb-2">
			<div class="position-relative">
				<input
					class="form-check-input position-absolute top-50 start-0 ms-3 fs-5"
					type="radio"
					name="installmentRadio"
					id="installmentRadio{option.value}"
					value={option.value}
					bind:group={formData.installment}
				/>
				<label class="list-group-item py-3 ps-5" for="installmentRadio{option.value}">
					<div class="d-flex align-items-center justify-content-between">
						<div>
							<strong class="fw-semibold">{option.label}</strong>
							{#if option.value > 1}
								<span class="text-muted ms-2">
									<i class="bi bi-x-lg thick"></i>
									<span class="fs-6">
										{#if typeof calculatedAmounts === 'object' && calculatedAmounts !== null}
											{formatTurkishCurrency(calculatedAmounts.installmentAmount)}
										{/if}
									</span>
								</span>
							{/if}
						</div>
						<div class="text-end">
							{#if option.value > 1 && option.newPricePercentage === 100}
								<span class="badge bg-success me-2">Peşin Fiyatına</span>
							{/if}
							<span class="text-muted fs-6">
								{#if typeof calculatedAmounts === 'object' && calculatedAmounts !== null}
									{formatTurkishCurrency(calculatedAmounts.totalAmount)}
								{/if}
							</span>
						</div>
					</div>
				</label>
			</div>
		</div>
	{/each}
</div>

<style>
	.form-check-input:checked[type='radio'] {
		--bs-form-check-bg-image: url(
			data:image/svg + xml,
			%3csvgxmlns='http://www.w3.org/2000/svg'viewBox='-4 -4 8 8'%3e%3ccircler='2'fill='%23fff'/%3e%3c/svg%3e
		);
	}

	.list-group-radio .form-check-input:checked + .list-group-item {
		background-color: var(--bs-success-bg-subtle);
		border-color: var(--bs-success);
		box-shadow: 0 0 0 2px var(--bs-primary);
	}

	.list-group-radio .list-group-item {
		cursor: pointer;
		border-radius: 0.5rem;
	}
	.form-check-input:checked {
		background-color: #0d6efd;
		border-color: #0d6efd;
	}
	.list-group-radio .form-check-input {
		z-index: 2;
		margin-top: -0.5em;
	}
	.list-group-radio .list-group-item {
		cursor: pointer;
		border-radius: 0.5rem;
	}
</style>
