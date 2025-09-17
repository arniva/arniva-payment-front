<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let selectedCard = $state(data.testCards[0]);
	let cardNumber = $state(selectedCard.number);
	let expiryMonth = $state('12');
	let expiryYear = $state('26');
	let cvv = $state(selectedCard.cvv);

	function selectCard(card: typeof selectedCard) {
		selectedCard = card;
		cardNumber = card.number;
		cvv = card.cvv;
	}

	const encodedPageData = $derived(
		btoa(encodeURIComponent(JSON.stringify({ testing: 'This is testing', testing2: 444 })))
	);
</script>

<div class="container mx-auto max-w-2xl p-6">
	<h1 class="text-3xl font-bold mb-6 text-center">NestPay Test Payment</h1>
	<p class="text-lg text-center mb-8 text-gray-600">Test payment for 1 Turkish Lira (₺1.00)</p>

	<!-- Test Card Selection -->
	<div class="mb-6 p-4 bg-blue-50 rounded-lg">
		<h2 class="text-xl font-semibold mb-3">Test Credit Cards</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each data.testCards as card}
				<div
					class="p-3 border rounded cursor-pointer transition-colors {selectedCard === card
						? 'bg-blue-100 border-blue-500'
						: 'bg-white border-gray-300 hover:border-blue-300'}"
					onclick={() => selectCard(card)}
				>
					<div class="font-semibold">{card.type}</div>
					<div class="text-sm text-gray-600">{card.number}</div>
					<div class="text-xs text-gray-500">
						Expiry: {card.expiry} | CVV: {card.cvv} | 3D Password: {card.securePassword}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Payment Form -->
	<form method="post" action={data.paymentData.gatewayUrl} class="space-y-6">
		<!-- Hidden payment parameters -->
		<input type="hidden" name="Desc1" value={encodedPageData} />
		<input type="hidden" name="clientid" value={data.paymentData.clientid} />
		<input type="hidden" name="storetype" value={data.paymentData.storetype} />
		<input type="hidden" name="hash" value={data.paymentData.hash} />
		<input type="hidden" name="islemtipi" value={data.paymentData.islemtipi} />
		<input type="hidden" name="amount" value={data.paymentData.amount} />
		<input type="hidden" name="currency" value={data.paymentData.currency} />
		<input type="hidden" name="oid" value={data.paymentData.oid} />
		<input type="hidden" name="okUrl" value={data.paymentData.okUrl} />
		<input type="hidden" name="failUrl" value={data.paymentData.failUrl} />
		<input type="hidden" name="lang" value={data.paymentData.lang} />
		<input type="hidden" name="rnd" value={data.paymentData.rnd} />

		<!-- Card Information -->
		<div class="bg-white p-6 rounded-lg border">
			<h2 class="text-xl font-semibold mb-4">Card Information</h2>

			<div class="space-y-4">
				<div>
					<label for="pan" class="block text-sm font-medium text-gray-700 mb-1">
						Card Number
					</label>
					<input
						type="text"
						id="pan"
						name="pan"
						bind:value={cardNumber}
						placeholder="1234 5678 9012 3456"
						maxlength="20"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				<div class="grid grid-cols-3 gap-4">
					<div>
						<label for="expiry-month" class="block text-sm font-medium text-gray-700 mb-1">
							Month
						</label>
						<select
							id="expiry-month"
							name="Ecom_Payment_Card_ExpDate_Month"
							bind:value={expiryMonth}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						>
							{#each Array(12) as _, i}
								<option value={(i + 1).toString().padStart(2, '0')}>
									{(i + 1).toString().padStart(2, '0')}
								</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="expiry-year" class="block text-sm font-medium text-gray-700 mb-1">
							Year
						</label>
						<select
							id="expiry-year"
							name="Ecom_Payment_Card_ExpDate_Year"
							bind:value={expiryYear}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						>
							{#each Array(10) as _, i}
								<option value={(24 + i).toString()}>
									20{24 + i}
								</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="cv2" class="block text-sm font-medium text-gray-700 mb-1"> CVV </label>
						<input
							type="text"
							id="cv2"
							name="cv2"
							bind:value={cvv}
							placeholder="123"
							maxlength="4"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Payment Summary -->
		<div class="bg-gray-50 p-6 rounded-lg">
			<h3 class="text-lg font-semibold mb-3">Payment Summary</h3>
			<div class="flex justify-between items-center">
				<span>Amount:</span>
				<span class="font-bold text-xl">₺{data.paymentData.amount}</span>
			</div>
			<div class="flex justify-between items-center mt-2 text-sm text-gray-600">
				<span>Order ID:</span>
				<span>{data.paymentData.oid}</span>
			</div>
		</div>

		<!-- Submit Button -->
		<button
			type="submit"
			class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
		>
			Pay ₺{data.paymentData.amount} with NestPay
		</button>
	</form>

	<!-- Test Instructions -->
	<div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
		<h3 class="text-lg font-semibold mb-2 text-yellow-800">Test Instructions</h3>
		<ul class="text-sm text-yellow-700 space-y-1">
			<li>• Use the provided test card numbers above</li>
			<li>• CVV: 001 for all test cards</li>
			<li>• 3D Secure password: "a" (lowercase)</li>
			<li>• In the 3D verification screen, click "YES" for successful payment</li>
			<li>• Click "NO" for failed payment simulation</li>
		</ul>
	</div>
</div>
