require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');

async function test() {
    const clientId = process.env.NEXT_PUBLIC_DOKU_CLIENT_ID;
    const secretKey = process.env.DOKU_SECRET_KEY;
    const isProd = process.env.NEXT_PUBLIC_DOKU_IS_PRODUCTION === 'true';
    
    console.log("Client-Id:", clientId);
    console.log("Secret-Key-Length:", secretKey?.length);
    console.log("Is Production:", isProd);

    const baseUrl = isProd ? 'https://api.doku.com' : 'https://api-sandbox.doku.com';
    const targetPath = '/checkout/v1/payment';
    const requestId = crypto.randomBytes(16).toString('hex');
    const timestamp = new Date().toISOString().split('.')[0] + 'Z';

    const requestBody = {
        order: {
            amount: 750000,
            invoice_number: 'INV-TEST-001',
            currency: "IDR",
            callback_url: "https://indonesianvisas.com/thanks",
            line_items: [
                {
                    name: "Visa / Corporate Service",
                    price: 750000,
                    quantity: 1
                }
            ]
        },
        customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "628123456789"
        }
    };

    const jsonBody = JSON.stringify(requestBody);
    const digest = crypto.createHash('sha256').update(jsonBody).digest('base64');

    const signaturePayload = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${targetPath}\nDigest:${digest}`;
    const signature = crypto.createHmac('sha256', secretKey).update(signaturePayload).digest('base64');

    try {
        const fetch = (await import('node-fetch')).default;
        const res = await fetch(`${baseUrl}${targetPath}`, {
            method: 'POST',
            headers: {
                'Client-Id': clientId,
                'Request-Id': requestId,
                'Request-Timestamp': timestamp,
                'Signature': `HMACSHA256=${signature}`,
                'Content-Type': 'application/json'
            },
            body: jsonBody
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (e) {
        console.error(e);
    }
}
test();
