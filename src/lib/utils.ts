
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace("Rp", "IDR").trim();
}

export function parseCurrency(priceStr: string | any): number {
    if (!priceStr) return 0;
    if (typeof priceStr !== 'string') return Number(priceStr) || 0;

    let target = priceStr.trim();

    // 1. Handle colons (e.g., "1 Year: IDR 7.000.000")
    if (target.includes(':')) {
        target = target.split(':').pop() || '';
    }

    // 2. Handle duration labels without colons (e.g., "1Y IDR 7.000.000")
    // If there's a space, the price is usually the last word
    const parts = target.trim().split(/\s+/);
    if (parts.length > 1) {
        // Only pop if the last part contains digits (to avoid popping if there's trailing text like "Enquire")
        if (/[0-9]/.test(parts[parts.length - 1])) {
            target = parts.pop() || '';
        }
    }

    // 3. Remove "IDR", "Rp", dots, spaces
    const cleanStr = target.replace(/[^0-9]/g, '');
    return parseInt(cleanStr, 10) || 0;
}

export function calculateVisaTotal(
    price: string | Record<string, string> | any,
    fee: number | string | Record<string, number | string> | any
): string | Record<string, string> {
    // Case 1: Complex Object Price (e.g., multiple durations)
    if (typeof price === 'object' && price !== null && !Array.isArray(price)) {
        const totalPrices: Record<string, string> = {};
        const feeMap: Record<string, number> = {};

        // Pre-parse fee if it's an object or descriptive string
        if (typeof fee === 'object' && fee !== null) {
            Object.entries(fee).forEach(([k, v]) => {
                feeMap[k] = typeof v === 'number' ? v : parseCurrency(String(v));
            });
        } else if (typeof fee === 'string' && fee.includes(':')) {
            const parts = fee.split(':');
            feeMap[parts[0].trim()] = parseCurrency(parts[1].trim());
        } else if (typeof fee === 'number') {
            // Apply same fee to all price keys if it's a flat number
            Object.keys(price).forEach(k => { feeMap[k] = fee; });
        } else if (typeof fee === 'string') {
            Object.keys(price).forEach(k => { feeMap[k] = parseCurrency(fee); });
        }

        for (const [key, val] of Object.entries(price)) {
            const basePrice = parseCurrency(val as string);
            const feeAmount = feeMap[key] || 0;
            totalPrices[key] = formatCurrency(basePrice + feeAmount);
        }

        // Also check if fee has keys NOT in price (descriptive fee list)
        if (typeof fee === 'object' && fee !== null) {
            Object.entries(fee).forEach(([k, v]) => {
                if (!(k in totalPrices)) {
                    totalPrices[k] = formatCurrency(parseCurrency(String(v)));
                }
            });
        }

        return totalPrices;
    }

    // Case 2: String Price
    if (typeof price === 'string') {
        const lowerPrice = price.toLowerCase();

        // Check if price or fee is descriptive (contains multiple options separated by colons)
        const hasPriceColon = price.includes(':');
        const hasFeeColon = typeof fee === 'string' && fee.includes(':');

        if (hasPriceColon || hasFeeColon) {
            const results: Record<string, string> = {};
            
            const processStr = (str: string, isFee = false) => {
                if (str.includes(':')) {
                    const parts = str.split(':');
                    const key = parts[0].trim();
                    const val = parseCurrency(parts[1].trim());
                    const current = parseCurrency(results[key] || "0");
                    results[key] = formatCurrency(current + val);
                } else {
                    const val = parseCurrency(str);
                    // If it's a flat fee and results has keys, add to all
                    const keys = Object.keys(results);
                    if (isFee && keys.length > 0) {
                        keys.forEach(k => {
                            results[k] = formatCurrency(parseCurrency(results[k]) + val);
                        });
                    } else if (!isFee) {
                        results["Total"] = formatCurrency(val);
                    }
                }
            };

            processStr(price);
            if (fee && fee !== "0") {
                processStr(String(fee), true);
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
        } else if (typeof fee === 'string') {
            feeAmount = parseCurrency(fee);
        }

        return formatCurrency(basePrice + feeAmount);
    }

    return String(price);
}
