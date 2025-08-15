<script lang="ts">
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
	import { onMount } from 'svelte';
	console.log('data....', data);
	console.log('form....', form);
	let selectedPackage = form?.data?.selectedPackageId
		? data.packages.find((pkg) => pkg.id === form.data.selectedPackageId)
		: null;

	let formData = $state({
		vkn: '',
		unvan: '',
		description: ''
	});

	// Timeout reference for VKN delay
	let vknTimeout: NodeJS.Timeout | null = null;

	let valid = $derived.by(() => {
		return (
			form?.data?.selectedPackageId !== null &&
			(/^\d{10}$/.test(formData.vkn) || /^\d{11}$/.test(formData.vkn)) &&
			formData.unvan !== ''
		);
	});

	function formatTurkishCurrency(value: number): string {
		return (
			value.toLocaleString('tr-TR', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}) + ' ₺'
		);
	}

	function formatThousands(value: number): string {
		return value.toLocaleString('tr-TR');
	}

	onMount(() => {
		if (!form || !form?.data?.selectedPackageId) {
			console.error('No package selected or form data is missing.');
			window.location.href = '/credits';
		}
	});

	async function handleVknApiCall(vknValue: string) {
		console.log('Fetching VKN data...');
		const res = await fetch(`https://payment-api.arniva.tr/v1/mukellefler/${vknValue}`);
		if (res.ok) {
			const json = await res.json();
			if (json && json.data && json.code === 0) {
				formData.unvan = json.data.adi;
			}
		}
	}

	function handleVknInput() {
		// Clear any existing timeout
		if (vknTimeout) {
			clearTimeout(vknTimeout);
			vknTimeout = null;
		}

		const currentValue = formData.vkn;

		// Only clear unvan if the input is less than 10 digits (user is starting fresh or deleting)
		if (currentValue.length < 10) {
			formData.unvan = '';
		}

		if (currentValue.length === 10 && /^\d{10}$/.test(currentValue)) {
			// Set timeout for VKN (10 digits) - wait 500ms
			vknTimeout = setTimeout(() => {
				handleVknApiCall(currentValue);
				vknTimeout = null;
			}, 500);
		} else if (currentValue.length === 11 && /^\d{11}$/.test(currentValue)) {
			// Immediate call for TCKN (11 digits)
			handleVknApiCall(currentValue);
		}
	}

	async function onVknKeyDown(e: KeyboardEvent) {
		// Allow control keys
		if (
			e.key === 'Backspace' ||
			e.key === 'Delete' ||
			e.key === 'Tab' ||
			e.key === 'Escape' ||
			e.key === 'Enter' ||
			(e.key && e.key.startsWith('Arrow')) ||
			e.ctrlKey ||
			e.metaKey
		) {
			return;
		}

		// Prevent non-numeric and limit to 11 chars
		if (!/^\d$/.test(e.key) || formData.vkn.length >= 11) {
			e.preventDefault();
			return;
		}
	}
</script>

<div class="row justify-content-center">
	<div class="col-12 col-md-9">
		<form action="/credits/payment?/next" method="POST">
			<input type="hidden" name="selectedPackageId" value={form?.data?.selectedPackageId} />

			<div class="row">
				<!-- This will be col-8 on desktop, but appear second on mobile -->
				<div class="col-12 col-md-8 order-2 order-md-1 pe-4">
					<div class="mb-4">
						<h4 class="mb-0 text-muted">Kimlik Bilgileri</h4>
						<span class="text-muted">Devam etmek için lütfen kimlik bilgilerinizi girin.</span>
					</div>

					<div class="mb-3">
						<label for="vkn" class="form-label">Vkn/Tckn <code>*</code></label>
						<input
							bind:value={formData.vkn}
							name="vkn"
							type="text"
							class="form-control"
							id="vkn"
							placeholder="Vergi Kimlik Numarası veya TCKN"
							maxlength="11"
							onkeydown={onVknKeyDown}
							oninput={handleVknInput}
						/>
					</div>
					<div class="mb-3">
						<label for="unvan" class="form-label">Ünvan <code>*</code></label>
						<input
							bind:value={formData.unvan}
							name="unvan"
							type="text"
							class="form-control bg-light"
							id="unvan"
							placeholder="Ünvan"
							readonly
						/>
					</div>
					<div class="mb-3">
						<label for="description" class="form-label">Açıklama</label>
						<textarea
							bind:value={formData.description}
							name="description"
							class="form-control"
							id="description"
							rows="3"
							placeholder="Açıklama"
						></textarea>
					</div>
					<!-- <div class="d-flex align-items-end justify-content-end">
						<button type="submit" class="btn btn-primary"
							>Kaydet ve Devam Et <i class="bi bi-arrow-right"></i></button
						>
					</div> -->
				</div>

				<!-- This will be col-4 on desktop, but appear first on mobile -->
				<div class="col-12 col-md-4 order-2 order-md-2 mb-4 mb-md-0">
					{#if selectedPackage}
						<div class="card card-body p-4 border-0 shadow">
							<h5 class="mb-2 text-primary">Ödenecek Tutar</h5>
							<h2 class="mb-3">{formatTurkishCurrency(selectedPackage.total)}</h2>
							<button type="submit" class="btn btn-lg btn-danger mb-4" disabled={!valid}
								>Devam Et <i class="bi bi-arrow-right"></i></button
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
								<div>KDV hariç fiyatlardır</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</form>
	</div>
</div>
