export function calculateInstallmentAmount(installment, selectedPackage, installmentOptions) {
    if (!selectedPackage) return '';

    let total = selectedPackage.total;
    let newPricePercentage =
        installmentOptions.find((option) => option.value === installment)?.newPricePercentage || 100;
    let installmentAmount = (total * newPricePercentage) / 100 / installment;
    let totalAmount = installmentAmount * installment;
    return {
        totalAmount: totalAmount,
        installmentAmount: installmentAmount
    };
}

export function formatTurkishCurrency(value: number): string {
    if (!value) return '';
    return (
        value.toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' ₺'
    );
}