<script lang="ts">
	import type { PageProps } from './$types'; // removed unused import
	let { data }: PageProps = $props(); // removed unused variable

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
						{#each data.packages as pkg, i (pkg.amount)}
							<tr class="cursor-pointer {selected === pkg.id ? 'table-primary' : ''}">
								<td>{formatThousands(pkg.amount)} Adet</td>
								<td class="d-none d-md-table-cell">{formatTurkishCurrency(pkg.unitPrice)}</td>
								<td>{formatTurkishCurrency(pkg.total)}</td>
								<td class="text-center">
									<button
										type="button"
										onclick={() => (selected = pkg.id)}
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
			</div>
		</div>
	</div>
</form>

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
