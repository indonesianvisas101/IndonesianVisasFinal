
/**
 * Financial Calculation Utility for IndonesianVisas.com
 * Handles PPh 23 (2%) and Gateway Fees for DOKU & PayPal
 */

export type PaymentChannel = 'PAYPAL' | 'DOKU_CC' | 'DOKU_VA' | 'DOKU_QRIS' | 'DOKU_WALLET' | 'MANUAL' | string;

export interface FeeBreakdown {
    serviceFee: number;
    pph23Amount: number;
    gatewayFee: number;
    totalAmount: number;
}

/**
 * Calculates the full breakdown of fees for an order.
 * @param baseAmount The total service price (price * quantity)
 * @param channel The payment channel to determine gateway fees
 */
export function calculateOrderFees(visaAmount: number, channel: PaymentChannel, addonsAmount: number = 0): FeeBreakdown {
    // 1. Base Processing (Visa Amount)
    const serviceFee = visaAmount + addonsAmount;
    
    // 2. PPh 23 = 2% of the Base Processing (Visa Amount) ONLY!
    const pph23Amount = Math.round(visaAmount * 0.02);
    
    // 3. Payment Fee = 4% of the Base Processing (Visa Amount) ONLY!
    // As per Master's simplified legal requirement for PayPal/Doku parity
    const gatewayFee = Math.round(visaAmount * 0.04);

    return {
        serviceFee,
        pph23Amount,
        gatewayFee,
        totalAmount: serviceFee + pph23Amount + gatewayFee
    };
}
