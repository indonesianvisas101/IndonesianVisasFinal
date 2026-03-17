
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
export function calculateOrderFees(baseAmount: number, channel: PaymentChannel): FeeBreakdown {
    const serviceFee = baseAmount;
    
    // PPh 23 = 2% of the Service Fee
    const pph23Amount = Math.round(serviceFee * 0.02);
    
    const subtotal = serviceFee + pph23Amount;
    let gatewayFee = 0;

    const normalizedChannel = channel?.toUpperCase() || 'MANUAL';

    if (normalizedChannel !== 'MANUAL' && normalizedChannel !== 'NONE') {
        // Standardized for 3rd Party Payments (DOKU/PayPal)
        // Platform Fee = 4%
        gatewayFee = Math.round((subtotal * 0.04));
    }

    return {
        serviceFee,
        pph23Amount,
        gatewayFee,
        totalAmount: subtotal + gatewayFee
    };
}
