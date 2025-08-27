export interface InstallmentOption {
    value: number;
    label: string;
    newPricePercentage: number;
}

export interface Package {
    total: number;
    // Add other properties as needed
}

export function calculateInstallmentAmount(
    installment: number,
    selectedPackage: Package | null,
    installmentOptions: InstallmentOption[]
): { totalAmount: number; installmentAmount: number } | string {
    if (!selectedPackage) return '';

    const total = selectedPackage.total;
    const newPricePercentage =
        installmentOptions.find((option: InstallmentOption) => option.value === installment)?.newPricePercentage || 100;
    const installmentAmount = (total * newPricePercentage) / 100 / installment;
    const totalAmount = installmentAmount * installment;
    return {
        totalAmount,
        installmentAmount
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