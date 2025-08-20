<script lang="ts">
	import type { PageProps } from './$types'; // removed unused import
	import type { Package } from './types';
	let { data }: PageProps = $props(); // removed unused variable
	let packageWarningModal: HTMLDivElement | null;

	let selected: string | null = $state(null);

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
		console.log('p', p);
		return p.filter((pkg) => pkg.type === type);
	}
</script>

<form action="/credits/details" method="POST">
	<input type="hidden" name="selectedPackageId" value={selected} />

	<div class="row justify-content-center">
		<div class="col-12 col-lg-9">
			<div class="d-flex align-items-start justify-content-between mb-3">
				<div>
					<h4 class="mb-0 text-muted">Kontör Seçiniz</h4>
					<span class="text-muted d-none d-md-inline"
						>Devam etmek için lütfen bir kontör paketi seçiniz.</span
					>
				</div>
				<button type="submit" class="btn btn-lg btn-arniva text-white" disabled={!selected}
					><span class="d-none d-md-inline">Devam Et</span>
					<i class="bi bi-arrow-right"></i></button
				>
			</div>
			<div class="table-responsive">
				<table
					class="table table-sm table-bordered table-hover align-middle bg-white shadow-sm mb-4"
				>
					<thead class="table-light">
						<tr>
							<td colspan="4" class="text-success p-2 fs-6"
								>E-Fatura, E-Arşiv, E-İrsaliye, E-Müstahsil, E-SMM Kontör Paketleri</td
							>
						</tr>
						<tr>
							<th>Kontör Adedi</th>
							<th class="d-none d-md-table-cell">Birim Fiyatı</th>
							<th>Tutarı</th>
							<th class="text-center">Seçiniz</th>
						</tr>
					</thead>
					<tbody>
						{#each getPackages(data.packages, 1) as pkg (pkg.id)}
							<tr class="cursor-pointer {selected === pkg.id ? 'table-primary' : ''}">
								<td>{formatThousands(pkg.amount)} Adet</td>
								<td class="d-none d-md-table-cell">{formatTurkishCurrency(pkg.unitPrice)}</td>
								<td>{formatTurkishCurrency(pkg.total)}</td>
								<td class="text-center">
									<button
										type="button"
										onclick={() => {
											selected = pkg.id;
											if (pkg.type === 1) return;
											let mdl = new bootstrap.Modal(packageWarningModal);
											mdl.show();
										}}
										class="btn {selected === pkg.id
											? 'btn-primary'
											: 'btn-outline-primary'} btn-sm px-4"
										>{selected === pkg.id ? 'Seçildi' : 'Seçiniz'}</button
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<table
					class="table table-sm table-bordered table-hover align-middle bg-white shadow-sm mb-4"
				>
					<thead class="table-light">
						<tr>
							<td colspan="4" class="text-danger p-2 fs-6">E-Adisyon Kontör Paketleri</td>
						</tr>
						<tr>
							<th>Kontör Adedi</th>
							<th class="d-none d-md-table-cell">Birim Fiyatı</th>
							<th>Tutarı</th>
							<th class="text-center">Seçiniz</th>
						</tr>
					</thead>
					<tbody>
						{#each getPackages(data.packages, 2) as pkg (pkg.id)}
							<tr class="cursor-pointer {selected === pkg.id ? 'table-primary' : ''}">
								<td>{formatThousands(pkg.amount)} Adet</td>
								<td class="d-none d-md-table-cell">{formatTurkishCurrency(pkg.unitPrice)}</td>
								<td>{formatTurkishCurrency(pkg.total)}</td>
								<td class="text-center">
									<button
										type="button"
										onclick={() => {
											selected = pkg.id;
											if (pkg.type === 1) return;
											let mdl = new bootstrap.Modal(packageWarningModal);
											mdl.show();
										}}
										class="btn {selected === pkg.id
											? 'btn-primary'
											: 'btn-outline-primary'} btn-sm px-4"
										>{selected === pkg.id ? 'Seçildi' : 'Seçiniz'}</button
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
</form>

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
