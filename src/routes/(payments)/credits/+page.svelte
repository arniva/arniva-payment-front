<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types'; // removed unused import
	import type { Package } from './types';

	let { data }: PageProps = $props(); // removed unused variable

	let packageWarningModal: HTMLDivElement | null;
	let selected: null | string = $state(null);

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

	function getPackages(p: Package[], type: number) {
		return p.filter((pkg) => pkg.type === type);
	}

	function purchase(packageId: string | null) {
		// Implement purchase logic here
		if (!packageId) return;
		goto(`/credits/details?packageid=${packageId}`, { invalidateAll: true });
	}

	function checkType(packageId: string) {
		if (data.packages.find((pkg: Package) => pkg.id === packageId)?.type === 1) {
			purchase(packageId);
			return;
		}
		selected = packageId;
		let mdl = new bootstrap.Modal(packageWarningModal);
		mdl.show();
	}
</script>

<!-- <input type="hidden" name="selectedPackageId" value={selected} /> -->

<div class="row justify-content-center">
	<div class="col-12 col-lg-9">
		<div class="d-flex align-items-start justify-content-between mb-3">
			<div>
				<h4 class="mb-0 text-muted">Kontör Seçiniz</h4>
				<span class="text-muted d-none d-md-inline"
					>Devam etmek için lütfen bir kontör paketi seçiniz.</span
				>
			</div>
		</div>
		<div class="table-responsive">
			<table class="table table-sm table-bordered table-hover align-middle bg-white shadow-sm mb-4">
				<thead class="table-light">
					<tr>
						<td colspan="4" class="text-success p-2 fs-6"
							>E-Fatura, E-Arşiv, E-İrsaliye, E-Müstahsil, E-SMM Kontör Paketleri</td
						>
					</tr>
					<tr>
						<th>Kontör Adedi</th>
						<th class="d-none d-md-table-cell text-end pe-2">Birim Fiyatı</th>
						<th class="text-end pe-2">Tutarı</th>
						<th class="text-center">Seçiniz</th>
					</tr>
				</thead>
				<tbody>
					{#each getPackages(data.packages, 1) as pkg (pkg.id)}
						<tr class="cursor-pointer">
							<td>{formatThousands(pkg.amount)} Adet</td>
							<td class="d-none d-md-table-cell text-end pe-2"
								>{formatTurkishCurrency(pkg.unitPrice)}</td
							>
							<td class="text-end pe-2">{formatTurkishCurrency(pkg.total)}</td>
							<td class="text-center">
								<button
									type="button"
									onclick={() => checkType(pkg.id)}
									class="btn btn-outline-primary btn-sm px-4">Satın Al</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<table class="table table-sm table-bordered table-hover align-middle bg-white shadow-sm mb-4">
				<thead class="table-light">
					<tr>
						<td colspan="4" class="text-danger p-2 fs-6">E-Adisyon Kontör Paketleri</td>
					</tr>
					<tr>
						<th>Kontör Adedi</th>
						<th class="d-none d-md-table-cell text-end pe-2">Birim Fiyatı</th>
						<th class="text-end pe-2">Tutarı</th>
						<th class="text-center">Seçiniz</th>
					</tr>
				</thead>
				<tbody>
					{#each getPackages(data.packages, 2) as pkg (pkg.id)}
						<tr class="cursor-pointer">
							<td>{formatThousands(pkg.amount)} Adet</td>
							<td class="d-none d-md-table-cell text-end pe-2"
								>{formatTurkishCurrency(pkg.unitPrice)}</td
							>
							<td class="text-end pe-2">{formatTurkishCurrency(pkg.total)}</td>
							<td class="text-center">
								<button
									type="button"
									onclick={() => checkType(pkg.id)}
									class="btn btn-outline-primary btn-sm px-4">Satın Al</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="alert alert-warning py-2" role="alert">
				<i class="bi bi-exclamation-triangle"></i> <strong>UYARI:</strong> Tablonun altında yer alan
				kontör paketleri yalnız E-Adisyon için geçerlidir.
			</div>
		</div>
	</div>
</div>

<div
	bind:this={packageWarningModal}
	class="modal fade"
	id="packageWarningModal"
	tabindex="-1"
	aria-labelledby="packageWarningModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header border-0">
				<h1 class="modal-title fs-5" id="packageWarningModalLabel">Uyarı</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body p-4 lead">
				Seçmiş olduğunuz paket yalnız E-Adisyon paketlerinde geçerlidir.
			</div>
			<div class="modal-footer border-0">
				<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Kapat</button>
				<button
					onclick={() => purchase(selected)}
					type="button"
					class="btn btn-outline-secondary"
					data-bs-dismiss="modal">Satın Al</button
				>
			</div>
		</div>
	</div>
</div>

<style>
	.table th,
	.table td {
		vertical-align: middle;
		cursor: pointer;
	}
	.card {
		border-radius: 1rem;
	}
	.btn-success {
		font-weight: 500;
		letter-spacing: 0.5px;
	}
</style>
