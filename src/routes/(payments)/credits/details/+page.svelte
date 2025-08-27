<script lang="ts">
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();
	let { selectedPackage } = data;

	let formattedDescription = `${selectedPackage?.amount} adet ${selectedPackage?.type === 1 ? 'E-Fatura' : 'E-Adisyon'} kontör paketi ödemesidir`;

	let formData = $state({
		vkn: data?.encodedData?.vkn || '',
		unvan: data?.encodedData?.unvan || '',
		adres: data?.encodedData?.adres || '',
		il: data?.encodedData?.il || '',
		ilce: data?.encodedData?.ilce || '',
		description: data?.encodedData?.description || formattedDescription,
		selectedPackageId: selectedPackage?.id || ''
	});

	// Timeout reference for VKN delay
	let vknTimeout: NodeJS.Timeout | null = null;

	let valid = $derived.by(() => {
		return (
			selectedPackage?.id !== null &&
			(/^\d{10}$/.test(formData.vkn) || /^\d{11}$/.test(formData.vkn)) &&
			formData.unvan.trim() !== '' &&
			formData.adres.trim() !== '' &&
			formData.il.trim() !== '' &&
			formData.ilce.trim() !== ''
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

	async function handleVknApiCall(vknValue: string) {
		const res = await fetch(`https://payment-api.arniva.tr/v1/mukellefler/${vknValue}`);
		if (res.ok) {
			const json = await res.json();
			if (json && json.data && json.code === 0) {
				formData.unvan = json.data.adi;
				formData.adres = json.data.adres;
				formData.il = json.data.il;
				formData.ilce = json.data.ilce;
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

	function passDataToPayment() {
		// First encode to handle Unicode, then base64 encode
		const encoded = btoa(encodeURIComponent(JSON.stringify(formData)));
		const url = `/credits/payment?data=${encoded}`;
		goto(url);
	}

	$inspect('selectedPackage', selectedPackage);
	console.log('data', data);
</script>

<div class="row justify-content-center">
	<div class="col-12 col-md-9">
		<div class="row">
			<!-- This will be col-8 on desktop, but appear second on mobile -->
			<div class="col-12 col-md-8 order-2 order-md-1 pe-4">
				<div class="mb-4">
					<h4 class="mb-0 text-muted">Kimlik Bilgileri</h4>
					<span class="text-muted">Devam etmek için lütfen kimlik bilgilerinizi giriniz.</span>
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
						class="form-control"
						id="unvan"
						placeholder="Ünvan"
					/>
				</div>
				<div class="mb-3">
					<label for="adres" class="form-label">Adres <code>*</code></label>
					<input
						bind:value={formData.adres}
						name="adres"
						type="text"
						class="form-control"
						id="adres"
						placeholder="Adres"
					/>
				</div>
				<div class="mb-3 row">
					<div class="col-12 col-md-4">
						<label for="il" class="form-label">İl <code>*</code></label>
						<input
							bind:value={formData.il}
							name="il"
							type="text"
							class="form-control"
							id="il"
							placeholder="İl"
						/>
					</div>
					<div class="col-12 col-md-4">
						<label for="ilce" class="form-label">İlçe <code>*</code></label>
						<input
							bind:value={formData.ilce}
							name="ilce"
							type="text"
							class="form-control"
							id="ilce"
							placeholder="İlçe"
						/>
					</div>
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
			</div>

			<!-- This will be col-4 on desktop, but appear first on mobile -->
			<div class="col-12 col-md-4 order-2 order-md-2 mb-4 mb-md-0">
				{#if selectedPackage}
					<div class="card card-body p-4 border-0 shadow">
						<h5 class="mb-2 text-primary">Ödenecek Tutar</h5>
						<h2 class="mb-3">{formatTurkishCurrency(selectedPackage.total)}</h2>
						<button
							onclick={passDataToPayment}
							type="button"
							class="btn btn-lg btn-arniva text-white mb-4"
							disabled={!valid}>Ödemeye Geç <i class="bi bi-arrow-right"></i></button
						>

						<div class="d-flex align-items-center justify-content-between mb-3">
							<span class="text-muted fs-6">Paket</span>
							<strong class="text-end fs-6"
								>{selectedPackage.type === 1 ? 'E-Fatura Paketi' : 'E-Adisyon Paketi'}</strong
							>
						</div>
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
	</div>
</div>
