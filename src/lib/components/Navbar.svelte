<script lang="ts">
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark" aria-label="Offcanvas navbar large">
	<div class="container-fluid">
		<a class="navbar-brand" href="/"><img src="/arnivalogo_small_new.webp" height="35" alt="" /></a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="offcanvas"
			data-bs-target="#offcanvasNavbar2"
			aria-controls="offcanvasNavbar2"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div
			class="offcanvas offcanvas-end text-bg-dark"
			tabindex="-1"
			id="offcanvasNavbar2"
			aria-labelledby="offcanvasNavbar2Label"
		>
			<div class="offcanvas-header">
				<h5 class="offcanvas-title" id="offcanvasNavbar2Label">Offcanvas</h5>
				<button
					type="button"
					class="btn-close btn-close-white"
					data-bs-dismiss="offcanvas"
					aria-label="Close"
				></button>
			</div>
			<div class="offcanvas-body">
				<ul class="navbar-nav d-flex align-items-center gap-3 justify-content-end flex-grow-1 pe-3">
					<li class="nav-item">
						<a target="_self" href="/admin" class="btn btn-outline-light">Admin Paneli</a>
					</li>
					<li class="nav-item">
						<span>Arniva Ödeme Portalı</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</nav>

<style>
	.navbar-brand img {
		filter: hue-rotate(180deg) invert(1);
	}
</style>
