
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace("Rp", "IDR").trim();
}

export function parseCurrency(priceStr: string): number {
    if (!priceStr) return 0;
    // Remove "IDR", "Rp", dots, spaces
    const cleanStr = priceStr.replace(/[^0-9]/g, '');
    return parseInt(cleanStr, 10) || 0;
}

export function calculateVisaTotal(
    price: string | Record<string, string> | any,
    fee: number | Record<string, number> | any
): string | Record<string, string> {

    // Case 1: Complex Object Price (e.g., multiple durations)
    if (typeof price === 'object' && price !== null && !Array.isArray(price)) {
        const totalPrices: Record<string, string> = {};

        // fee might be an object matching the keys of price
        // or a single number (though the data suggests it matches structure)

        for (const [key, val] of Object.entries(price)) {
            const basePrice = parseCurrency(val as string);
            let feeAmount = 0;

            if (typeof fee === 'object' && fee !== null && fee[key] !== undefined) {
                feeAmount = Number(fee[key]);
            } else if (typeof fee === 'number') {
                feeAmount = fee;
            }

            totalPrices[key] = formatCurrency(basePrice + feeAmount);
        }
        return totalPrices;
    }

    // Case 2: String Price
    if (typeof price === 'string') {
        const lowerPrice = price.toLowerCase();

        // Check if price or fee is descriptive (contains multiple options separated by colons or non-formatting words)
        const isDescriptive = price.includes(':') || (typeof fee === 'string' && fee.includes(':'));

        if (isDescriptive) {
            const results: Record<string, string> = {};

            // Helper to parse descriptive str to KV
            const parseDescriptiveStr = (str: string) => {
                if (str.includes(':')) {
                    const parts = str.split(':');
                    results[parts[0].trim()] = parts[1].trim();
                } else {
                    results[str] = str;
                }
            };

            parseDescriptiveStr(price);

            if (typeof fee === 'string' && fee.length > 0 && fee !== "0") {
                parseDescriptiveStr(fee);
            } else if (typeof fee === 'number' && fee > 0) {
                results["Additional Fee"] = formatCurrency(fee);
            }

            return results;
        }

        if (lowerPrice.includes('contact') || lowerPrice.includes('free') || price === 'IDR 0') {
            const basePrice = parseCurrency(price);
            if (basePrice === 0 && (fee === 0 || !fee)) {
                return price;
            }
            if (lowerPrice.includes('contact')) return price;
        }

        const basePrice = parseCurrency(price);
        let feeAmount = 0;
        if (typeof fee === 'number') {
            feeAmount = fee;
        }

        return formatCurrency(basePrice + feeAmount);
    }

    return String(price);
}
