<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	let { form }: PageProps = $props();

	let formData = $state(null);

	onMount(() => {
		if (form && form.result && form.result.success && form.result.data) {
			console.log('Form submission result:', form);
			formData = form.result;
		} else {
			goto('/credits');
		}
	});

	// MaskedPan, EXTRA.CARDBRAND, EXTRA.CARDISSUER, EXTRA.CARDBANK
</script>

{#if formData}
	<div class="container-fluid px-0">
		<!-- Success Header -->
		<div class="row mb-4">
			<div class="col-12">
				<div class="alert alert-success border-0 shadow-sm rounded-3" role="alert">
					<div class="d-flex align-items-center">
						<div class="success-icon-container me-3">
							<i class="bi bi-check-circle-fill text-success display-4"></i>
						</div>
						<div>
							<h4 class="alert-heading mb-2">
								<i class="bi bi-party-popper me-2"></i>
								Ödeme Başarıyla Tamamlandı!
							</h4>
							<p class="mb-0 text-muted">
								İşleminiz güvenli bir şekilde gerçekleştirildi. Onay e-postanız kısa süre içinde
								gönderilecektir.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row g-4">
			<!-- Payment Information Section -->
			<div class="col-lg-6">
				<div class="card border-0 shadow-sm h-100">
					<div class="card-header bg-light border-0 rounded-top">
						<h5 class="card-title mb-0">
							<i class="bi bi-credit-card-2-front text-primary me-2"></i>
							Ödeme Bilgileri
						</h5>
					</div>
					<div class="card-body">
						<div class="row g-3">
							{#if formData.data['EXTRA.CARDBRAND']}
								<div class="col-12">
									<div class="d-flex align-items-center p-3 bg-light rounded-3">
										<i class="bi bi-credit-card text-info me-3 fs-4"></i>
										<div>
											<small class="text-muted d-block">Kart Markası</small>
											<strong class="text-dark">{formData.data['EXTRA.CARDBRAND']}</strong>
										</div>
									</div>
								</div>
							{/if}

							{#if formData.data['EXTRA.CARDISSUER']}
								<div class="col-12">
									<div class="d-flex align-items-center p-3 bg-light rounded-3">
										<i class="bi bi-bank text-warning me-3 fs-4"></i>
										<div>
											<small class="text-muted d-block">Kartı Veren Kurum</small>
											<strong class="text-dark">{formData.data['EXTRA.CARDISSUER']}</strong>
										</div>
									</div>
								</div>
							{/if}

							{#if formData.data['EXTRA.CARDBANK']}
								<div class="col-12">
									<div class="d-flex align-items-center p-3 bg-light rounded-3">
										<i class="bi bi-building text-success me-3 fs-4"></i>
										<div>
											<small class="text-muted d-block">Kart Bankası</small>
											<strong class="text-dark">{formData.data['EXTRA.CARDBANK']}</strong>
										</div>
									</div>
								</div>
							{/if}

							{#if formData.data['MaskedPan']}
								<div class="col-12">
									<div class="d-flex align-items-center p-3 bg-light rounded-3">
										<i class="bi bi-shield-check text-primary me-3 fs-4"></i>
										<div>
											<small class="text-muted d-block">Kart Numarası</small>
											<strong class="text-dark font-monospace">{formData.data['MaskedPan']}</strong>
										</div>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Company & Package Information Section -->
			<div class="col-lg-6">
				<div class="card border-0 shadow-sm h-100">
					<div class="card-header bg-light border-0 rounded-top">
						<h5 class="card-title mb-0">
							<i class="bi bi-building-check text-success me-2"></i>
							Firma ve Paket Bilgileri
						</h5>
					</div>
					<div class="card-body">
						{#if formData.decoded}
							<div class="row g-3 mb-4">
								{#if formData.decoded.unvan}
									<div class="col-12">
										<div class="d-flex align-items-center p-3 bg-success bg-opacity-10 rounded-3">
											<i class="bi bi-briefcase text-success me-3 fs-4"></i>
											<div>
												<small class="text-muted d-block">Firma Ünvanı</small>
												<strong class="text-dark">{formData.decoded.unvan}</strong>
											</div>
										</div>
									</div>
								{/if}

								{#if formData.decoded.vkn}
									<div class="col-12">
										<div class="d-flex align-items-center p-3 bg-success bg-opacity-10 rounded-3">
											<i class="bi bi-hash text-success me-3 fs-4"></i>
											<div>
												<small class="text-muted d-block">Vergi Kimlik No</small>
												<strong class="text-dark font-monospace">{formData.decoded.vkn}</strong>
											</div>
										</div>
									</div>
								{/if}

								{#if formData.decoded.description}
									<div class="col-12">
										<div class="d-flex align-items-start p-3 bg-success bg-opacity-10 rounded-3">
											<i class="bi bi-file-text text-success me-3 fs-4 mt-1"></i>
											<div>
												<small class="text-muted d-block">Açıklama</small>
												<strong class="text-dark">{formData.decoded.description}</strong>
											</div>
										</div>
									</div>
								{/if}
							</div>
						{/if}

						{#if formData.packageInfo}
							<div class="border-top pt-4">
								<h6 class="text-muted mb-3">
									<i class="bi bi-box-seam me-2"></i>
									Paket Detayları
								</h6>
								<div class="row g-3">
									{#if formData.packageInfo.amount}
										<div class="col-6">
											<div class="text-center p-3 bg-primary bg-opacity-10 rounded-3">
												<i class="bi bi-stack text-primary fs-4 d-block mb-2"></i>
												<small class="text-muted d-block">Miktar</small>
												<strong class="text-primary fs-5">{formData.packageInfo.amount}</strong>
											</div>
										</div>
									{/if}

									{#if formData.packageInfo.total}
										<div class="col-6">
											<div class="text-center p-3 bg-success bg-opacity-10 rounded-3">
												<i class="bi bi-currency-exchange text-success fs-4 d-block mb-2"></i>
												<small class="text-muted d-block">Toplam Tutar</small>
												<strong class="text-success fs-5">{formData.packageInfo.total} ₺</strong>
											</div>
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="row mt-4">
			<div class="col-12">
				<div class="d-flex flex-column flex-md-row gap-3 justify-content-center">
					<a href="/" class="btn btn-primary btn-lg px-4">
						<i class="bi bi-house me-2"></i>
						Ana Sayfaya Dön
					</a>
					<a href="/credits" class="btn btn-outline-secondary btn-lg px-4">
						<i class="bi bi-arrow-left me-2"></i>
						Yeni İşlem
					</a>
					<button class="btn btn-outline-info btn-lg px-4" onclick={() => window.print()}>
						<i class="bi bi-printer me-2"></i>
						Yazdır
					</button>
				</div>
			</div>
		</div>

		<!-- Additional Info -->
		<div class="row mt-4">
			<div class="col-12">
				<div class="card border-0 bg-light">
					<div class="card-body text-center py-4">
						<i class="bi bi-info-circle text-info fs-4 mb-3 d-block"></i>
						<p class="text-muted mb-0">
							İşlem numaranızı ve fatura bilgilerinizi kaydetmeyi unutmayın. Herhangi bir sorun
							yaşamanız durumunda müşteri hizmetlerimizle iletişime geçebilirsiniz.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="text-center py-5">
		<div class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Yükleniyor...</span>
		</div>
		<p class="mt-3 text-muted">Ödeme bilgileri yükleniyor...</p>
	</div>
{/if}

<style>
	.success-icon-container {
		animation: successPulse 2s infinite;
	}

	@keyframes successPulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}

	.card {
		transition: transform 0.2s ease-in-out;
	}

	.card:hover {
		transform: translateY(-2px);
	}

	@media print {
		.btn {
			display: none !important;
		}

		.card {
			border: 1px solid #ddd !important;
			box-shadow: none !important;
		}
	}
</style>
