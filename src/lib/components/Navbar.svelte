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
				<ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
					<li class="nav-item">
						<a class="nav-link active" aria-current="page" href="https://arniva.tr/"
							>Web Sitesine Git</a
						>
					</li>
					<li class="nav-item dropdown">
						<a
							class="nav-link dropdown-toggle"
							href="#"
							role="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
							aria-label="Toggle user menu"
						>
							<i class="bi bi-person"></i>
						</a>
						<ul class="dropdown-menu dropdown-menu-end">
							<li>
								<a class="dropdown-item" href="#">Giriş Yap</a>
							</li>
							<li>
								<a class="dropdown-item" href="#">Yardım</a>
							</li>
							<li>
								<hr class="dropdown-divider" />
							</li>
							<li>
								<a class="dropdown-item" href="#">Hakkında</a>
							</li>
						</ul>
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
