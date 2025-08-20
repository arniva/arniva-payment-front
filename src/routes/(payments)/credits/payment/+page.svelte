<script lang="ts">
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import CreditCard from './CreditCard.svelte';
	import MesafeliSatisSozlesmesi from './MesafeliSatisSozlesmesi.svelte';
	import IptalVeIadeKosullari from './IptalVeIadeKosullari.svelte';
	import { calculateInstallmentAmount, formatTurkishCurrency } from './functions.svelte';
	import InstallmentOptionsBox from './InstallmentOptionsBox.svelte';
	import YearSelect from './YearSelect.svelte';
	import type { Package } from '../types';

	let { data, form }: PageProps = $props();
	let confirmCheck = $state(false);
	let yearComponent: YearSelect;
	let cvcInput: HTMLInputElement | null;

	let pageData = form?.data || data?.urlData || null;

	let selectedPackage = pageData?.selectedPackageId
		? data.packages.find((pkg: Package) => pkg.id === pageData.selectedPackageId)
		: null;

	let formData = $state({
		name: '',
		no: '',
		cvc: '',
		validUntilMonth: '',
		validUntilYear: '',
		installment: 1
	});

	let maxYear = new Date().getFullYear() + 10;
	let minYear = new Date().getFullYear();
	let cardValid = $derived.by(() => {
		return (
			formData.name.trim() !== '' &&
			formData.no.replace(/\s/g, '').length === 16 &&
			formData.cvc.length === 3 &&
			formData.validUntilMonth !== '' &&
			formData.validUntilYear !== ''
		);
	});

	let installmentOptions = [
		{ value: 1, label: 'Tek Çekim', newPricePercentage: 100 },
		{ value: 2, label: '2 Taksit', newPricePercentage: 100 },
		{ value: 3, label: '3 Taksit', newPricePercentage: 100 },
		{ value: 4, label: '4 Taksit', newPricePercentage: 115 },
		{ value: 5, label: '5 Taksit', newPricePercentage: 120 },
		{ value: 6, label: '6 Taksit', newPricePercentage: 125 },
		{ value: 7, label: '7 Taksit', newPricePercentage: 130 },
		{ value: 8, label: '8 Taksit', newPricePercentage: 135 },
		{ value: 9, label: '9 Taksit', newPricePercentage: 140 },
		{ value: 10, label: '10 Taksit', newPricePercentage: 145 }
	];

	function handleCardInput(event: InputEvent) {
		let input = event.target as HTMLInputElement;
		let value = input.value.replace(/\D/g, ''); // Remove non-digits
		value = value.slice(0, 16); // Limit to 16 digits
		// Format: add space every 4 digits
		let formatted = value.replace(/(.{4})/g, '$1 ').trim();
		// Handle deletion: if user deletes a digit and leaves a space, remove the space
		if (input.selectionStart && input.selectionStart > 0) {
			let prevChar = input.value[input.selectionStart - 1];
			if (prevChar === ' ' && event.inputType === 'deleteContentBackward') {
				formatted =
					formatted.slice(0, input.selectionStart - 2) + formatted.slice(input.selectionStart - 1);
			}
		}
		formData.no = formatted;
	}

	function handleCvcInput(event: Event) {
		let input = event.target as HTMLInputElement;
		let value = input.value.replace(/\D/g, ''); // Remove non-digits
		value = value.slice(0, 3); // Limit to 3 digits
		formData.cvc = value;
	}

	function formatThousands(value: number): string {
		if (!value) return '';
		return value.toLocaleString('tr-TR');
	}

	onMount(() => {
		if (!pageData || !pageData?.selectedPackageId || !pageData?.vkn || !pageData?.unvan) {
			console.error('No package selected or form data is missing.');
			window.location.href = '/credits';
		}
	});
</script>

<div class="row justify-content-center">
	<div class="col-12 col-md-9">
		<form action="/credits/payment?/pay" method="POST">
			<input type="hidden" name="selectedPackageId" value={pageData?.selectedPackageId} />
			<input type="hidden" name="vkn" value={pageData?.vkn} />
			<input type="hidden" name="unvan" value={pageData?.unvan} />
			<input type="hidden" name="description" value={pageData?.description} />
			<input type="hidden" name="adres" value={pageData?.adres} />
			<input type="hidden" name="il" value={pageData?.il} />
			<input type="hidden" name="ilce" value={pageData?.ilce} />
			<input type="hidden" name="postakodu" value={pageData?.postakodu} />

			<div class="row">
				<!-- This will be col-8 on desktop, but appear second on mobile -->
				<div class="col-12 col-md-8 order-1 order-md-2 pe-4 mb-4 mb-md-0">
					<div class="mb-4">
						<h4 class="mb-0 text-muted">Kart Bilgileri</h4>
						<span class="text-muted">Devam etmek için lütfen kart bilgilerinizi giriniz.</span>
					</div>

					<CreditCard bind:formData />

					<div class="mb-3">
						<label for="name" class="form-label">Kart Sahibi <code>*</code></label>
						<input
							bind:value={formData.name}
							name="name"
							type="text"
							class="form-control"
							id="name"
							placeholder="Kart Sahibi"
							required
							autocomplete="cc-name"
							oninput={(e) => {
								const input = e.target as HTMLInputElement;
								input.value = input.value.replace(/[^a-zA-ZğüşöçıİĞÜŞÖÇ\s]/g, '');
								formData.name = input.value;
							}}
						/>
					</div>
					<div class="mb-3">
						<label for="vkn" class="form-label">Kart Numarası <code>*</code></label>
						<input
							bind:value={formData.no}
							name="no"
							type="text"
							class="form-control"
							id="no"
							placeholder="XXXX XXXX XXXX XXXX"
							maxlength="19"
							oninput={(e) => handleCardInput(e as unknown as InputEvent)}
							required
							autocomplete="cc-number"
						/>
					</div>

					<div class="d-block d-lg-flex gap-3 align-items-center justify-content-between">
						<div class="d-block d-lg-flex gap-3">
							<div class="mb-3">
								<label for="validUntilMonth" class="form-label">Ay <code>*</code></label>
								<select
									bind:value={formData.validUntilMonth}
									name="validUntilMonth"
									class="form-select"
									id="validUntilMonth"
									required
									onchange={() => {
										if (yearComponent) yearComponent.open();
									}}
								>
									<option value="">Ay seçiniz</option>
									<option value="01">01 - Ocak</option>
									<option value="02">02 - Şubat</option>
									<option value="03">03 - Mart</option>
									<option value="04">04 - Nisan</option>
									<option value="05">05 - Mayıs</option>
									<option value="06">06 - Haziran</option>
									<option value="07">07 - Temmuz</option>
									<option value="08">08 - Ağustos</option>
									<option value="09">09 - Eylül</option>
									<option value="10">10 - Ekim</option>
									<option value="11">11 - Kasım</option>
									<option value="12">12 - Aralık</option>
								</select>
							</div>
							<div class="mb-3">
								<YearSelect
									onChange={() => {
										console.log('changed');
										if (cvcInput) cvcInput.focus();
									}}
									bind:this={yearComponent}
									{maxYear}
									{minYear}
									bind:value={formData.validUntilYear}
								/>
								<!-- <label for="validUntilYear" class="form-label">Yıl <code>*</code></label>
								<select
									bind:value={formData.validUntilYear}
									name="validUntilYear"
									class="form-select"
									id="validUntilYear"
								>
									<option value="">Yıl seçiniz</option>
									{#each Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i) as year (year)}
										<option value={year.toString()}>{year}</option>
									{/each}
								</select> -->
							</div>
						</div>
						<div>
							<div class="mb-3">
								<label for="cvc" class="form-label">CVC <code>*</code></label>
								<input
									bind:this={cvcInput}
									bind:value={formData.cvc}
									name="cvc"
									type="text"
									class="form-control"
									id="cvc"
									placeholder="123"
									maxlength="3"
									oninput={handleCvcInput}
									autocomplete="off"
									required
								/>
							</div>
						</div>
					</div>

					{#if cardValid}
						{@const selectedInstallment = installmentOptions.find(
							(option) => option.value === formData.installment
						)}
						<InstallmentOptionsBox
							{installmentOptions}
							{selectedInstallment}
							{selectedPackage}
							{formData}
						/>
					{/if}
				</div>

				<!-- This will be col-4 on desktop, but appear first on mobile -->
				<div class="col-12 col-md-4 order-1 order-md-2">
					{#if selectedPackage}
						<div class="card card-body p-4 border-0 shadow sticky-top top-0">
							<h5 class="mb-2 text-primary">Ödenecek Tutar</h5>
							{#if formData.installment === 1}
								<h2 class="mb-3">
									{formatTurkishCurrency(selectedPackage.total)}
								</h2>
							{:else}
								{@const newAmount = calculateInstallmentAmount(
									formData.installment,
									selectedPackage,
									installmentOptions
								)}
								{#if typeof newAmount === 'object' && newAmount !== null}
									<div class="mb-3">
										<h2 class="mb-0">
											{formatTurkishCurrency(newAmount.totalAmount)}
										</h2>
										<span class="text-muted">
											{formatTurkishCurrency(newAmount.installmentAmount)} x {formData.installment} Taksit
										</span>
									</div>
								{/if}
							{/if}

							<div class="d-flex mb-3 align-items-start">
								<input
									type="checkbox"
									bind:checked={confirmCheck}
									class="btn-check"
									id="readAndApproved"
									autocomplete="off"
								/>
								<label class="btn btn-outline-primary p-2 lh-1" for="readAndApproved"
									><i class="bi bi-check-lg text-white fs-6"></i></label
								><br />
								<label for="readAndApproved" class="ms-2"
									><a
										data-bs-toggle="offcanvas"
										href="#mesafeliSatisSozlesmesi"
										role="button"
										aria-controls="mesafeliSatisSozlesmesi">Mesafeli Satış Sözleşmesi</a
									>'ni ve
									<a
										data-bs-toggle="offcanvas"
										href="#iptalVeIadeKosullari"
										role="button"
										aria-controls="iptalVeIadeKosullari">İptal ve İade Koşulları</a
									>'nı okudum anladım.</label
								>
							</div>

							<button
								type="submit"
								class="btn btn-lg btn-arniva text-white mb-4"
								disabled={!cardValid || !confirmCheck}
								>Ödeme Yap <i class="bi bi-arrow-right"></i></button
							>

							<div class="d-flex align-items-center justify-content-between mb-3">
								<span class="text-muted fs-6">Kontör Adedi</span>
								<strong class="text-end fs-6">{formatThousands(selectedPackage.amount)}</strong>
							</div>
							<div class="d-flex align-items-center justify-content-between mb-3">
								<span class="text-muted fs-6">Birim Fiyatı</span>
								<strong class="text-end fs-6"
									>{formatTurkishCurrency(selectedPackage.unitPrice)}</strong
								>
							</div>
							<div class="alert alert-warning d-flex align-items-center py-2" role="alert">
								<i class="bi bi-info-circle fs-5 me-3"></i>
								<div>Fiyatlara KDV dahildir.</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</form>
	</div>
</div>

<!-- <div
	class="modal fade"
	id="installmentModal"
	tabindex="-1"
	aria-labelledby="installmentModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header border-0">
				<h1 class="modal-title fs-5" id="installmentModalLabel">Taksit Seçenekleri</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				{#if cardValid && installmentOptions}
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
													<span class="fs-6"
														>{formatTurkishCurrency(calculatedAmounts.installmentAmount)}</span
													>
												</span>
											{/if}
										</div>
										<div class="text-end">
											{#if option.value > 1 && option.newPricePercentage === 100}
												<span class="badge bg-success me-2">Peşin Fiyatına</span>
											{/if}
											<span class="text-muted fs-6"
												>{formatTurkishCurrency(calculatedAmounts.totalAmount)}</span
											>
										</div>
									</div>
								</label>
							</div>
						</div>
					{/each}
				{/if}
			</div>
			<div class="modal-footer border-0">
				<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"
					>Seç ve Kapat</button
				>
			</div>
		</div>
	</div>
</div> -->

<div
	class="offcanvas offcanvas-start"
	tabindex="-1"
	id="mesafeliSatisSozlesmesi"
	aria-labelledby="mesafeliSatisSozlesmesiLabel"
>
	<div class="offcanvas-header">
		<h5 class="offcanvas-title" id="mesafeliSatisSozlesmesiLabel">Mesafeli Satış Sözleşmesi</h5>
		<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
	</div>
	<div class="offcanvas-body p-3 p-md-4">
		{#if formData && selectedPackage}
			<MesafeliSatisSozlesmesi {pageData} {selectedPackage} />
		{/if}
	</div>
</div>

<div
	class="offcanvas offcanvas-start"
	tabindex="-1"
	id="iptalVeIadeKosullari"
	aria-labelledby="iptalVeIadeKosullariLabel"
>
	<div class="offcanvas-header">
		<h5 class="offcanvas-title" id="iptalVeIadeKosullariLabel">İptal ve İade Koşulları</h5>
		<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
	</div>
	<div class="offcanvas-body p-3 p-md-4">
		{#if formData && selectedPackage}
			<IptalVeIadeKosullari />
		{/if}
	</div>
</div>

<style>
	#mesafeliSatisSozlesmesi,
	#iptalVeIadeKosullari {
		width: 75%;
	}

	@media (max-width: 768px) {
		#mesafeliSatisSozlesmesi,
		#iptalVeIadeKosullari {
			width: 100%;
		}
	}
	#cvc {
		width: 80px;
	}
	/* Media Queries */
	@media (max-width: 768px) {
		#cvc {
			width: 100%;
		}
	}
</style>
