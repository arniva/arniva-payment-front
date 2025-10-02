<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { Pagination } from '@components';
	import { onMount } from 'svelte';
	import {
		convertQueryObjectToString,
		convertQueryStringToObject
	} from '$lib/functions/query_convert.js';

	let { data }: PageProps = $props();
	let { movements, pagination, error } = data;

	let selected = $state(null as string | null);

	// Filter and search state
	let searchTerm = $state('');
	let searchColumn = $state('unvan'); // Default search column
	let statusFilter = $state(''); // Empty string means no filter
	let startDate = $state('');
	let endDate = $state('');
	let sortConfig = $state({ key: 'id', order: 'desc' } as { key: string; order: 'asc' | 'desc' });

	// Available filter options based on the table columns
	const statusOptions = [
		{ value: '', label: 'Tümü' },
		{ value: '0', label: 'Bekleniyor' },
		{ value: '1', label: 'Ödendi' },
		{ value: '2', label: 'Yüklendi' },
		{ value: '-1', label: 'Hatalı' }
	];

	const searchColumns = [
		{ value: 'unvan', label: 'Ünvan' },
		{ value: 'vtc', label: 'VTC' },
		{ value: 'aciklama', label: 'Açıklama' },
		{ value: 'kartsahibi', label: 'Kart Sahibi' }
	];

	async function changeStatus(id: string) {
		let confirmed = confirm(
			'Durumu "Kontör Yüklendi" olarak değiştirmek istediğinize emin misiniz?'
		);
		if (!confirmed || !id) return;
		try {
			const response = await fetch(`https://payment-api.arniva.tr/v1/hareketler/${id}`, {
				method: 'PUT'
			});
			if (response.ok) {
				const responseData = await response.json();
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

	// Filter and search functions
	function applyFilters() {
		const filter: any = {};

		// Add search filter if search term exists
		if (searchTerm.trim()) {
			filter.search = {
				column: searchColumn,
				value: searchTerm.trim()
			};
		}

		// Add status filter if selected
		if (statusFilter) {
			filter.durum = parseInt(statusFilter);
		}

		// Add date range filter if dates are provided
		if (startDate || endDate) {
			filter.created_at = {};
			if (startDate) {
				filter.created_at.start = startDate;
			}
			if (endDate) {
				filter.created_at.end = endDate;
			}
		}

		// Build query string
		const queryString = convertQueryObjectToString(
			{ offset: 0, limit: pagination?.limit || 10 },
			filter,
			sortConfig
		);

		// Navigate to new URL with filters
		window.location.href = window.location.pathname + queryString;
	}

	function clearFilters() {
		searchTerm = '';
		statusFilter = '';
		startDate = '';
		endDate = '';
		sortConfig = { key: 'id', order: 'desc' };
		hasActiveFilters = false;
		window.location.href =
			window.location.pathname + '?offset=0&limit=' + (pagination?.limit || 10);
	}

	// Check if any filters are active (from URL)
	let hasActiveFilters = $state(false);

	// Check for active filters on mount
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		hasActiveFilters = urlParams.has('filter');
	});
	$effect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const { filter, sort } = convertQueryStringToObject(window.location.search);

		if (filter.search) {
			searchTerm = filter.search.value || '';
			searchColumn = filter.search.column || 'unvan';
		}

		if (filter.durum !== undefined) {
			statusFilter = filter.durum.toString();
		}

		if (filter.created_at && typeof filter.created_at === 'object') {
			startDate = filter.created_at.start || '';
			endDate = filter.created_at.end || '';
		}

		if (sort) {
			sortConfig = sort;
		}
	});
</script>

<div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-3">
	<h1 class="mb-4 mb-lg-0">Hareketler</h1>
	{#if movements && pagination}
		<div class="d-flex align-items-center justify-content-between">
			<button
				data-bs-toggle="modal"
				data-bs-target="#filterModal"
				class="btn d-flex d-lg-none btn-outline-secondary mb-3">Filtrele</button
			>
			<Pagination {pagination} />
		</div>
	{/if}
</div>

{#if hasActiveFilters}
	<div class="alert alert-info d-flex align-items-start align-items-lg-center" role="alert">
		<i class="fs-3 bi bi-funnel-fill me-2"></i>
		<span>Filtreler uygulandı. Sonuçlar filtrelenmiş olarak gösteriliyor.</span>
		<button type="button" class="btn btn-sm btn-primary ms-auto" onclick={clearFilters}>
			Temizle
		</button>
	</div>
{/if}

<!-- Search and Filter Section -->
{#snippet filterBox()}
	<div class="card mb-4 border-0">
		<div class="card-body">
			<div class="row g-3">
				<!-- Search Section -->
				<div class="col-lg-3 col-md-6">
					<label for="searchColumn" class="form-label">Arama</label>
					<div class="input-group">
						<select class="form-select" id="searchColumn" bind:value={searchColumn}>
							{#each searchColumns as column}
								<option value={column.value}>{column.label}</option>
							{/each}
						</select>
						<input
							type="text"
							class="form-control"
							placeholder="Arama..."
							bind:value={searchTerm}
							onkeydown={(e) => {
								if (e.key === 'Enter') {
									applyFilters();
								}
							}}
						/>
					</div>
				</div>

				<!-- Status Filter -->
				<div class="col-lg-2 col-md-3">
					<label for="statusFilter" class="form-label">Durum</label>
					<select class="form-select" id="statusFilter" bind:value={statusFilter}>
						{#each statusOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>

				<!-- Date Range Filter -->
				<div class="col-lg-4 col-md-6">
					<label class="form-label">Tarih Aralığı</label>
					<div class="row g-2">
						<div class="col-6">
							<input
								type="date"
								class="form-control"
								placeholder="Başlangıç"
								bind:value={startDate}
							/>
						</div>
						<div class="col-6">
							<input type="date" class="form-control" placeholder="Bitiş" bind:value={endDate} />
						</div>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="col-lg-3 col-md-6">
					<label class="form-label">&nbsp;</label>
					<div class="d-flex gap-2">
						<button class="btn btn-danger flex-fill" onclick={applyFilters}>
							<i class="bi bi-search"></i> Filtrele
						</button>
						<button class="btn btn-outline-secondary flex-fill" onclick={clearFilters}>
							<i class="bi bi-x-circle"></i> Temizle
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/snippet}

<div class="d-none d-lg-block">
	{@render filterBox()}
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
				{:else}
					<tr>
						<td colspan="6" class="text-center fs-6 py-3 text-danger">Kayıt bulunamadı.</td>
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
								<th>Ünvan</th>
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
								<th>Oluşturulma Tarihi</th>
								<td>{selectedItem.created_at || '-'}</td>
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

<div
	class="modal fade"
	id="filterModal"
	tabindex="-1"
	aria-labelledby="filterModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header border-0">
				<h1 class="modal-title fs-5" id="filterModalLabel">Filtrele</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				{@render filterBox()}
			</div>
			<div class="modal-footer border-0">
				<button type="button" class="btn btn-secondary">Kapat</button>
			</div>
		</div>
	</div>
</div>

<style>
	.w-35 {
		width: 35% !important;
	}
	.w-65 {
		width: 65% !important;
	}
	#searchColumn {
		max-width: 120px;
	}
</style>
