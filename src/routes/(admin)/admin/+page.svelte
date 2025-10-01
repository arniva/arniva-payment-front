<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';

	let { data }: PageProps = $props();
	let { movements, pagination, error } = data;
	console.log('movements', movements);
	console.log('pagination', pagination);
	let selected = $state(null as string | null);

	async function changeStatus(id: string) {
		let confirmed = confirm(
			'Durumu "Kontör Yüklendi" olarak değiştirmek istediğinize emin misiniz?'
		);
		if (!confirmed || !id) return;
		try {
			console.log('id', id);
			const response = await fetch(`https://payment-api.arniva.tr/v1/hareketler/${id}`, {
				method: 'PUT'
			});
			console.log('response', response);
			if (response.ok) {
				const responseData = await response.json();
				console.log('responseData', responseData);
				invalidateAll();
				location.reload();
			} else {
				const errorData = await response.json();
				alert(`Hata: ${errorData.message}`);
			}
		} catch (error) {
			alert(`Hata: ${error}`);
		}
	}

	// 0, ödeme bekleniyor
	// 1, yapıldı
	// 2, kontör yüklendi
	// -1, Hatalı işlem

	function getDurum(durum: number) {
		switch (durum) {
			case 0:
				return {
					text: 'Bekleniyor',
					class: 'badge bg-warning'
				};
			case 1:
				return {
					text: 'Ödendi',
					class: 'badge bg-success'
				};
			case 2:
				return {
					text: 'Yüklendi',
					class: 'badge bg-primary'
				};
			case -1:
				return {
					text: 'Hatalı',
					class: 'badge bg-danger'
				};
			default:
				return {
					text: 'Bilinmiyor',
					class: 'badge bg-secondary'
				};
		}
	}

	function getUnvanText(unvan: string) {
		if (unvan.length > 30) {
			return unvan.slice(0, 27) + '...';
		}
		return unvan;
	}
</script>

<div class="d-flex align-items-center justify-content-between">
	<h1 class="mb-4 border-bottom pb-3">Hareketler</h1>
	{#if movements && pagination}
		<nav aria-label="Page navigation">
			<ul class="pagination justify-content-center">
				<li class="page-item" class:disabled={pagination.offset <= 0}>
					<a
						class="page-link"
						target="_self"
						href="?offset={Math.max(
							0,
							pagination.offset - pagination.limit
						)}&limit={pagination.limit}"><i class="bi bi-arrow-left-short"></i></a
					>
				</li>
				<li class="page-item disabled">
					<span class="page-link">Sayfa {pagination.page} / {pagination.totalPages}</span>
				</li>
				<li
					class="page-item"
					class:disabled={pagination.offset + pagination.limit >= pagination.total}
				>
					<a
						class="page-link"
						target="_self"
						href="?offset={pagination.offset + pagination.limit}&limit={pagination.limit}"
						><i class="bi bi-arrow-right-short"></i></a
					>
				</li>
			</ul>
		</nav>
	{/if}
</div>

{#if movements && pagination}
	<div class="table-responsive">
		<table class="table table-striped table-hover">
			<thead>
				<tr>
					<th class="d-none d-lg-table-cell">VTC</th>
					<th>Unvan</th>
					<th class="d-none d-lg-table-cell">Adet</th>
					<th>Toplam</th>
					<th>Durum</th>
					<th>İşlemler</th>
				</tr>
			</thead>
			<tbody>
				{#each movements as movement}
					{@const durum = getDurum(movement.durum)}
					{@const unvanText = getUnvanText(movement.unvan)}
					<tr>
						<td class="d-none d-lg-table-cell">{movement.vtc}</td>
						<td>{unvanText}</td>
						<td class="d-none d-lg-table-cell">{movement.adet}</td>
						<td>{movement.toplam}</td>
						<td>
							<span class={durum.class}>{durum.text}</span>
						</td>
						<td>
							<div class="d-flex gap-2">
								<button
									data-bs-toggle="modal"
									data-bs-target="#detailsModal"
									class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
									onclick={() => (selected = movement.id)}
								>
									<i class="bi bi-eye"></i>
									<span class="d-none d-lg-flex"> İncele </span>
								</button>
								{#if movement.durum !== 2 && movement.tip === 2}
									<button
										disabled={movement.durum === 2}
										class="btn btn-sm btn-danger d-flex align-items-center gap-1"
										onclick={() => changeStatus(movement.id)}
									>
										<i class="bi bi-arrow-left-right"></i>
										<span class="d-none d-lg-flex"> Değiştir</span>
									</button>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else if error}
	<div class="alert alert-danger" role="alert">
		Hata: {error}
	</div>
{:else}
	<div class="d-flex justify-content-center">
		<div class="spinner-border" role="status">
			<span class="visually-hidden">Yükleniyor...</span>
		</div>
	</div>
{/if}

<!-- Modal -->
<div
	class="modal fade"
	id="detailsModal"
	tabindex="-1"
	aria-labelledby="detailsModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			{#if selected}
				{@const selectedItem = movements.find((m) => m.id === selected)}
				<div class="modal-header border-0">
					<h1 class="modal-title fs-5" id="detailsModalLabel">{selectedItem.unvan}</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
					></button>
				</div>
				<div class="modal-body">
					<table class="table table-sm">
						<tbody>
							<tr>
								<th>VTC</th>
								<td>{selectedItem.vtc}</td>
							</tr>
							<tr>
								<th>Unvan</th>
								<td>{selectedItem.unvan}</td>
							</tr>
							<tr>
								<th>Aciklama</th>
								<td>{selectedItem.aciklama}</td>
							</tr>
							<tr>
								<th>Birim Fiyat</th>
								<td>{selectedItem.birimfiyat}</td>
							</tr>
							<tr>
								<th>Tip</th>
								<td
									>{selectedItem.tip === 1
										? 'E-Fatura, E-Arşiv, E-İrsaliye, E-Müstahsil, E-SMM'
										: 'E-Adisyon'}</td
								>
							</tr>
							<tr>
								<th>Adet</th>
								<td>{selectedItem.adet}</td>
							</tr>
							<tr>
								<th>Toplam</th>
								<td>{selectedItem.toplam}</td>
							</tr>
							<tr>
								<th>Taksit</th>
								<td>{selectedItem.taksit}</td>
							</tr>
							<tr>
								<th>Kart4</th>
								<td>{selectedItem.kart4}</td>
							</tr>
							<tr>
								<th>Kart Sahibi</th>
								<td>{selectedItem.kartsahibi}</td>
							</tr>
							<tr>
								<th>Adres</th>
								<td>{selectedItem.adres}</td>
							</tr>
							<tr>
								<th>Il</th>
								<td>{selectedItem.il}</td>
							</tr>
							<tr>
								<th>Ilce</th>
								<td>{selectedItem.ilce}</td>
							</tr>
							<tr>
								<th>Durum</th>
								<td>
									<span class={getDurum(selectedItem.durum)?.class}
										>{getDurum(selectedItem.durum)?.text}</span
									>
								</td>
							</tr>
							<tr>
								<th>Hata</th>
								<td>{selectedItem.hata || '-'}</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/if}
			<div class="modal-footer border-0">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
			</div>
		</div>
	</div>
</div>
