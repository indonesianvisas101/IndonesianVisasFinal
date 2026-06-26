
/**
 * Financial Calculation Utility for IndonesianVisas.com
 * Handles PPh 23 (2%), Gateway Fees for DOKU & PayPal, and Discount
 */

export type PaymentChannel = 'PAYPAL' | 'DOKU_CC' | 'DOKU_VA' | 'DOKU_QRIS' | 'DOKU_WALLET' | 'MANUAL' | string;

export interface FeeBreakdown {
    serviceFee: number;
    pph23Amount: number;
    gatewayFee: number;
    discountAmount: number;
    totalAmount: number;
}

/**
 * Calculates the full breakdown of fees for an order.
 * @param baseAmount The total service price (price * quantity)
 * @param channel The payment channel to determine gateway fees
 * @param addonsAmount Total add-on services amount
 * @param discountPct Optional discount percentage (0–100) applied to (visa + addons) before tax
 */
export function calculateOrderFees(
    visaAmount: number,
    channel: PaymentChannel,
    addonsAmount: number = 0,
    discountPct: number = 0
): FeeBreakdown {
    // 1. Base Processing (Visa Amount + Addons)
    const serviceFee = visaAmount + addonsAmount;

    // 2. Discount = X% of (visa + addons), applied BEFORE tax
    const discountAmount = discountPct > 0
        ? Math.round(serviceFee * discountPct / 100)
        : 0;

    const discountedServiceFee = serviceFee - discountAmount;

    // 3. PPh 23 = 2% of the Base Processing (Visa Amount) ONLY — unchanged
    const pph23Amount = Math.round(visaAmount * 0.02);

    // 4. Payment Fee = 4% of the Base Processing (Visa Amount) ONLY — unchanged
    const gatewayFee = Math.round(visaAmount * 0.04);

    return {
        serviceFee,
        pph23Amount,
        gatewayFee,
        discountAmount,
        totalAmount: discountedServiceFee + pph23Amount + gatewayFee
    };
}
