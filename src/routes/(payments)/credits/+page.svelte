<script lang="ts">
	import type { PageProps } from './$types'; // removed unused import
	let { data }: PageProps = $props(); // removed unused variable
	let packageWarningModal: HTMLDivElement | null;

	let selected: null | number = $state(null);

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

	function formatPackages(p) {
		// sort p by p.tip
		if (!p || !p.length) return [];
		p.sort((a, b) => (a.type < b.type ? -1 : 1));
		return p;
	}
</script>

<form action="/credits/details" method="POST">
	<input type="hidden" name="selectedPackageId" value={selected} />

	<div class="row justify-content-center">
		<div class="col-12 col-lg-9">
			<div class="d-flex align-items-start justify-content-between mb-3">
				<div>
					<h4 class="mb-0 text-muted">Kontür Seçiniz</h4>
					<span class="text-muted d-none d-md-inline"
						>Devam etmek için lütfen bir kontör paketi seçin.</span
					>
				</div>
				<button type="submit" class="btn btn-lg btn-danger" disabled={!selected}
					><span class="d-none d-md-inline">Devam Et</span>
					<i class="bi bi-arrow-right"></i></button
				>
			</div>
			<div class="table-responsive">
				<table class="table table-sm table-bordered table-hover align-middle bg-white shadow-sm">
					<thead class="table-light">
						<tr>
							<th>Kontör Adedi</th>
							<th class="d-none d-md-table-cell">Birim Fiyatı</th>
							<th>Tutarı</th>
							<th class="text-center">Seçiniz</th>
						</tr>
					</thead>
					<tbody>
						{#each formatPackages(data.packages) as pkg, i (pkg.id)}
							{@const typeText =
								pkg.type === 1
									? 'E-Arşiv Kontörü (Önerilir)'
									: 'E-Adisyon ve Perakende Satış E-Arşiv Fatura'}
							{#if i === 0 || pkg.type !== formatPackages(data.packages)[i - 1].type}
								<tr>
									<td
										colspan="4"
										class="table-light fw-bold fs-6 {pkg.type === 1
											? 'text-success'
											: 'text-danger'}">{typeText}</td
									>
								</tr>
							{/if}
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
					kontör paketleri E-Adisyon ve Perakende Satış E-Arşiv Faturası için önerilmektedir.
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
			<div class="modal-body p-4">
				Seçmiş olduğunuz paket, E-Adisyon ve Perakende Satış E-Arşiv Faturası için önerilmemektedir.
				Eğer E-Arşiv Kontörü kullanmak istiyorsanız, lütfen önerilen paketlerden birini seçin.
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
