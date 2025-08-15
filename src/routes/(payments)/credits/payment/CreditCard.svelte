<script lang="ts">
	let { formData = $bindable() } = $props();

	function formatCardNumber(value: string): string {
		// Remove all existing spaces and non-digit characters
		const cleanValue = value.replace(/\D/g, '');
		// Limit to 16 digits (14 digits would be unusual for credit cards)
		const limitedValue = cleanValue.slice(0, 16);
		// Add space after every 4 digits
		return limitedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
	}

	function formatNameToCapitalized(value: string): string {
		return value
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	function formatYearToLastTwoDigits(year: string): string {
		if (year.length === 4) {
			return year.slice(-2); // Get last two digits
		}
		return year; // Return as is if not 4 digits
	}

	const whichCard = $derived.by(() => {
		return formData.no.startsWith('4')
			? 'visa'
			: formData.no.startsWith('5')
				? 'mastercard'
				: formData.no.startsWith('34') || formData.no.startsWith('37')
					? 'amex'
					: formData.no.startsWith('9792')
						? 'troy'
						: 'mastercard';
	});
</script>

<!-- <div class="card-container">
	<div class="credit-card">
		<div class="card-content">
			<div>
				<div class="card-chip"></div>
				<div class="card-number">1234 5678 9012 3456</div>
				<div class="card-info">
					<div class="card-cvc">123</div>
					<div class="card-expiry">08/25</div>
				</div>
			</div>
			<div class="card-bottom">
				<img class="card-logo" src="/troy.png" alt="Card Logo" />
				<div class="card-holder">John Doe</div>
			</div>
		</div>
	</div>
</div> -->

<div class="credit-card-container ratio ratio-16x9 mb-4 d-none d-md-block">
	<div
		class="card credit-card p-5 d-flex flex-column align-items-start justify-content-between gap-3 rounded-4"
	>
		<div class="images d-flex justify-content-start align-items-center mb-3 gap-2">
			<img class="chip" height="30" src="/chip.png" alt="" />
			<img class="wave" height="25" src="/wave.png" alt="" />
		</div>
		<div class="middle">
			<code class="card-number text-white fs-2 text-shadow"
				>{formatCardNumber(formData.no) || '1234 5678 9012 3456'}</code
			>
			<div class="d-flex gap-3">
				<span class="card-valid-until text-white opacity-75 fs-5"
					>{formData.validUntilMonth || '08'}/{formatYearToLastTwoDigits(formData.validUntilYear) ||
						'25'}</span
				>
				<span class="card-cvc text-white opacity-75 fs-5">{formData.cvc || '123'}</span>
			</div>
		</div>
		<div class="card-bottom d-flex align-items-center justify-content-between w-100">
			<div class="card-holder text-white fs-4">
				{formatNameToCapitalized(formData.name) || 'Ad Soyad'}
			</div>
			<img src="/{whichCard}.png" height="45" alt="" />
		</div>
	</div>
</div>

<div class="credit-card-container-sm ratio ratio-16x9 mb-4 d-block d-md-none">
	<div
		class="card credit-card p-3 d-flex flex-column align-items-start justify-content-between gap-3 rounded-4"
	>
		<div class="images d-flex justify-content-start align-items-center mb-1 gap-2">
			<img class="chip" height="20" src="/chip.png" alt="" />
			<img class="wave" height="15" src="/wave.png" alt="" />
		</div>
		<div class="middle">
			<code class="card-number text-white fs-4 text-shadow"
				>{formatCardNumber(formData.no) || '1234 5678 9012 3456'}</code
			>
			<div class="d-flex gap-3">
				<span class="card-valid-until text-white opacity-75 fs-6"
					>{formData.validUntilMonth || '08'}/{formatYearToLastTwoDigits(formData.validUntilYear) ||
						'25'}</span
				>
				<span class="card-cvc text-white opacity-75 fs-6">{formData.cvc || '123'}</span>
			</div>
		</div>
		<div class="card-bottom d-flex align-items-center justify-content-between w-100">
			<div class="card-holder text-white fs-6">
				{formatNameToCapitalized(formData.name) || 'Ad Soyad'}
			</div>
			<img src="/{whichCard}.png" height="25" alt="" />
		</div>
	</div>
</div>

<style>
	.credit-card {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
	.chip {
		border-radius: 10%;
	}
	.wave {
		filter: invert(0.9);
	}
	.text-shadow {
		text-shadow: 3px 1px 3px #444444;
	}
	.card-bottom img {
		background: #fff;
		border-radius: 5px;
		padding: 5px;
	}
</style>
