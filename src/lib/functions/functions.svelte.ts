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

export function getPaymentErrorMessage(formData: FormData): string {
    const response = formData.get('Response')?.toString();
    const errMsg = formData.get('ErrMsg')?.toString();
    const mdStatus = formData.get('mdStatus')?.toString();
    const mdErrorMsg = formData.get('mdErrorMsg')?.toString();
    console.log("====================.");
    console.log("errMsg:", errMsg);
    console.log("mdStatus:", mdStatus, "mdErrorMsg:", mdErrorMsg);
    console.log("====================.");
    // Check 3D Secure status first (Netspay specific mappings)
    if (mdStatus) {
        switch (mdStatus) {
            case '0':
                return 'Kart 3D Secure doğrulaması başarısız oldu. Lütfen tekrar deneyin.';
            case '2':
            case '3':
            case '4':
                return 'Kartınız 3D Secure için kayıtlı değil. İşlem yarı güvenli olarak tamamlandı.';
            case '5':
            case '6':
            case '7':
            case '8':
                return 'Geçerli 3D Secure doğrulaması bulunamadı veya sistem hatası oluştu. Lütfen tekrar deneyin.';
        }
    }

    // Check for specific MPI errors
    if (mdErrorMsg) {
        return `3D Secure hatası: ${mdErrorMsg}`;
    }

    // General response handling
    if (response === 'Declined') {
        if (errMsg) {
            return `İşlem reddedildi: ${errMsg}`;
        }
        return 'Ödeme işlemi reddedildi. Lütfen kart bilgilerinizi kontrol edin veya farklı bir kart deneyin.';
    }

    if (response === 'Error') {
        if (errMsg) {
            return `Hata: ${errMsg}`;
        }
        return 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }

    // If we have a specific error message, use it
    if (errMsg) {
        return errMsg;
    }

    // Default fallback
    return 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.';
}