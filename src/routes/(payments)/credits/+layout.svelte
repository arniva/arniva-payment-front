<script lang="ts">
	import type { LayoutProps } from './$types';
	import { page } from '$app/state'; // removed unused import
	let { data, children }: LayoutProps = $props();
	// Wizard step info from page data
	const wizard = page?.data?.custom || {};
</script>

<div class="py-4 card card-body">
	<div class="row justify-content-center mb-4">
		<div class="col-lg-8">
			{#if wizard?.step === 4}
				<div class="d-flex align-items-center justify-content-between">
					<h4 class="mb-0 text-muted">İşlem Sonucu</h4>
					<div class="d-flex gap-2">
						<a href="/credits" target="_self" class="btn btn-danger">
							<i class="bi bi-view-list"></i>
							<span class="d-none d-md-inline">Kontörleri Görüntüle</span></a
						>
						<a href="/credits" target="_self" class="btn btn-outline-secondary">
							<i class="bi bi-bag"></i>
							<span class="d-none d-md-inline">Yeni Kontör Al</span></a
						>
					</div>
				</div>
				<div class="alert alert-warning mt-4 p-4" role="alert">
					<h4 class="alert-heading">Ödemeniz Alındı!</h4>
					<p>
						Ödeme işleminiz başarıyla gerçekleştirilmiştir. Kontörleriniz en kısa sürede hesabınıza
						yüklenecektir. Eğer bir sorunla karşılaşırsanız, lütfen destek ekibimizle iletişime
						geçin.
					</p>
					<hr />
					<p class="mb-0">
						Ödemenin hatalı olduğunu mu düşünüyorsunuz? Lütfen <a href="#">buraya tıklayın.</a>
					</p>
				</div>
			{:else}
				<div class="wizard-steps d-flex justify-content-between align-items-center mb-3">
					{#each data.steps as step, i (step.title)}
						<div class="wizard-step text-center flex-fill">
							<div class="step-circle mx-auto mb-1 {i + 1 === wizard.step ? 'active' : ''}">
								{i + 1}
							</div>
							<div
								class="step-title {i + 1 === wizard.step ? 'fw-bold text-primary' : 'text-muted'}"
							>
								{step.title}
							</div>
						</div>
						{#if i < data.steps.length - 1}
							<div class="wizard-line mx-2 {i + 1 < wizard.step ? 'completed' : ''}"></div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>

	{@render children()}

	<div class="row justify-content-center mb-4 mt-3">
		<div class="col-lg-8">
			<p class="mb-3 text-secondary">
				Bu sayfa üzerinden, Hızlı Bilişim Teknolojileri altyapısını kullanarak e-dönüşüm entegrasyon
				paketleri için gerekli kontörleri kolayca satın alabilirsiniz.
				<code> Tüm fiyatlara KDV dahildir. </code>
			</p>
			<div class="d-flex justify-content-end">
				<img src="/Gemini_Generated_Image_8fcq2h8fcq2h8fcq.webp" height="40" alt="" />
			</div>
		</div>
	</div>
</div>

<style>
	.wizard-steps {
		gap: 0.5rem;
	}

	.wizard-step {
		min-width: 90px;
	}

	.step-circle {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #e9ecef;
		color: #6c757d;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 500;
		font-size: 1.1rem;
		transition:
			background 0.2s,
			color 0.2s,
			box-shadow 0.2s;
		border: 2px solid #e9ecef;
	}

	.step-circle.active {
		background: var(--bs-primary);
		color: #fff;
		border-color: var(--bs-primary);
		box-shadow: 0 0 0 4px #b6d4fe;
		font-size: 1.25rem;
	}

	.step-title {
		font-size: 0.97rem;
		margin-top: 2px;
		transition:
			color 0.2s,
			font-weight 0.2s;
	}

	.wizard-line {
		height: 3px;
		background: #e9ecef;
		flex: 1 1 0%;
		border-radius: 2px;
		margin-bottom: 18px;
		transition: background 0.2s;
	}

	.wizard-line.completed {
		background: #0d6efd;
	}
</style>
