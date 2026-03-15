
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

    if (normalizedChannel.includes('PAYPAL')) {
        // PayPal: 5.4% + 5,000 IDR
        gatewayFee = Math.round((subtotal * 0.054) + 5000);
    } else if (normalizedChannel.includes('DOKU_CC') || normalizedChannel === 'CREDIT_CARD') {
        // DOKU Credit Card: 2.9% + 2,000 IDR
        gatewayFee = Math.round((subtotal * 0.029) + 2000);
    } else if (normalizedChannel.includes('DOKU_VA') || normalizedChannel === 'VIRTUAL_ACCOUNT') {
        // DOKU Virtual Account: 4,500 IDR Flat
        gatewayFee = 4500;
    } else if (normalizedChannel.includes('DOKU_QRIS') || normalizedChannel === 'QRIS') {
        // DOKU QRIS: 0.7%
        gatewayFee = Math.round(subtotal * 0.007);
    } else if (normalizedChannel.includes('DOKU_WALLET') || normalizedChannel === 'GOPAY' || normalizedChannel === 'SHOPEEPAY') {
        // DOKU E-Wallet: 2%
        gatewayFee = Math.round(subtotal * 0.02);
    } else if (normalizedChannel.includes('DOKU')) {
        // Fallback for general DOKU channel (e.g. redirected checkout)
        // Default to a safe average or CC rate if unknown
        gatewayFee = Math.round((subtotal * 0.029) + 2000);
    }

    return {
        serviceFee,
        pph23Amount,
        gatewayFee,
        totalAmount: subtotal + gatewayFee
    };
}
