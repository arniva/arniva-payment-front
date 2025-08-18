<script lang="ts">
	let { formData = $bindable() } = $props();
</script>

<div class="card-container">
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
</div>

<style>
	.card-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 300px;
	}
	.credit-card {
		width: 100%;
		height: 0;
		padding-bottom: 57.14%; /* Maintains 350:200 aspect ratio */
		border-radius: 20px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
		color: #fff;
		position: relative;
		font-family: 'Segoe UI', 'Roboto', sans-serif;
	}
	.card-chip {
		width: 70px;
		height: 50px;
		border-radius: 8px;
		background: linear-gradient(90deg, #e0e0e0 0%, #bdbdbd 100%);
		margin-bottom: 16px;
	}
	.card-content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 24px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.card-number {
		font-size: 1.5rem;
		letter-spacing: 2px;
		margin-bottom: 12px;
	}
	.card-info {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 20px;
		margin-bottom: 16px;
	}
	.card-cvc {
		font-size: 1rem;
		font-weight: 500;
	}
	.card-bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}
	.card-holder {
		font-size: 1.2rem;
		font-weight: 500;
	}
	.card-expiry {
		font-size: 1rem;
		font-weight: 500;
	}
	.card-logo {
		width: 48px;
		height: 32px;
		opacity: 0.9;
	}
</style>
