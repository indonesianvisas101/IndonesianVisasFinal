require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');

async function testDokuMin() {
    const clientId = process.env.NEXT_PUBLIC_DOKU_CLIENT_ID;
    const secretKey = process.env.DOKU_SECRET_KEY;
    
    const baseUrl = 'https://api.doku.com';
    const targetPath = '/checkout/v1/payment';
    const requestId = crypto.randomBytes(16).toString('hex');
    const timestamp = new Date().toISOString().split('.')[0] + 'Z';

    const requestBody = {
        order: {
            amount: 750000,
            invoice_number: 'INV-' + Math.floor(Math.random() * 1000000),
            currency: "IDR",
            callback_url: "https://indonesianvisas.com/thanks"
        },
        payment: {
            payment_due_date: 60
        },
        customer: {
            name: "Applicant Name",
            email: "test@example.com",
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

        console.log("Status:", res.status);
        console.log("Response:", await res.text());
    } catch (e) {
        console.error(e);
    }
}
testDokuMin();
