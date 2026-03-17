
/**
 * PayPal API Utility for IndonesianVisas.com
 * Handles authentication and communication with PayPal REST API
 */

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_URL = process.env.NEXT_PUBLIC_PAYPAL_ENV === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

/**
 * Generates an access token from PayPal
 */
export async function getPayPalAccessToken() {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("PayPal configuration missing");
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`PayPal Auth Error: ${data.error_description || 'Unknown'}`);
    }

    return data.access_token;
}

/**
 * Creates a PayPal order
 */
export async function createPayPalOrder(amount: number, currency: string = 'USD', invoiceId: string) {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: invoiceId,
                    amount: {
                        currency_code: currency,
                        value: currency === 'IDR' ? Math.round(amount).toString() : amount.toFixed(2),
                    },
                    description: `Indonesian Visa Services - Invoice #${invoiceId}`,
                },
            ],
            application_context: {
                brand_name: 'Indonesian Visas Agency',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
            }
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`PayPal Order Creation Error: ${JSON.stringify(data)}`);
    }

    return data;
}

/**
 * Captures an approved PayPal order
 */
export async function capturePayPalOrder(orderId: string) {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`PayPal Capture Error: ${JSON.stringify(data)}`);
    }

    return data;
}
