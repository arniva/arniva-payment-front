<script lang="ts">
	let { pagination } = $props();
</script>

<nav aria-label="Page navigation">
	<ul class="pagination justify-content-center">
		<li class="page-item" class:disabled={pagination.offset <= 0}>
			<a
				class="page-link"
				target="_self"
				href="?offset={Math.max(0, pagination.offset - pagination.limit)}&limit={pagination.limit}"
				><i class="bi bi-arrow-left-short"></i></a
			>
		</li>
		<li class="page-item disabled">
			<span class="page-link">Sayfa {pagination.page} / {pagination.totalPages}</span>
		</li>
		<li class="page-item" class:disabled={pagination.offset + pagination.limit >= pagination.total}>
			<a
				class="page-link"
				target="_self"
				href="?offset={pagination.offset + pagination.limit}&limit={pagination.limit}"
				><i class="bi bi-arrow-right-short"></i></a
			>
		</li>
	</ul>
</nav>
