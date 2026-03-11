import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

/**
 * DOKU (Jokul) Checkout API Implementation
 * Flow:
 * 1. Receive invoiceId and customer details.
 * 2. Generate Signature (HMAC-SHA256).
 * 3. Call DOKU Checkout API.
 * 4. Return payment URL.
 */

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { invoiceId, amount, customerDetails } = body;

        if (!invoiceId || !amount || !customerDetails) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const clientId = process.env.NEXT_PUBLIC_DOKU_CLIENT_ID;
        const secretKey = process.env.DOKU_SECRET_KEY;
        const isProduction = process.env.NEXT_PUBLIC_DOKU_IS_PRODUCTION === 'true';

        if (!clientId || !secretKey) {
            return NextResponse.json({ error: "DOKU configuration missing" }, { status: 500 });
        }

        const baseUrl = isProduction 
            ? 'https://api.doku.com' 
            : 'https://api-sandbox.doku.com';
        
        const targetPath = '/checkout/v1/payment';
        const requestId = crypto.randomBytes(16).toString('hex');
        const timestamp = new Date().toISOString().split('.')[0] + 'Z';

        // Prepare Request Body
        const requestBody = {
            order: {
                amount: Math.round(Number(amount)),
                invoice_number: invoiceId,
                currency: "IDR",
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.balihelp.id'}/thanks`,
                line_items: [
                    {
                        name: "Visa / Corporate Service",
                        price: Math.round(Number(amount)),
                        quantity: 1
                    }
                ]
            },
            customer: {
                name: customerDetails.name || `${customerDetails.first_name} ${customerDetails.last_name}`,
                email: customerDetails.email,
                phone: customerDetails.phone || ""
            }
        };

        // Generate Digest
        const jsonBody = JSON.stringify(requestBody);
        const digest = crypto.createHash('sha256').update(jsonBody).digest('base64');

        // Signature Components: Client-Id + Request-Id + Request-Timestamp + Request-Target + Digest
        const signaturePayload = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${targetPath}\nDigest:${digest}`;
        const signature = crypto.createHmac('sha256', secretKey).update(signaturePayload).digest('base64');

        // Call DOKU API
        const dokuRes = await fetch(`${baseUrl}${targetPath}`, {
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

        const dokuData = await dokuRes.json();

        if (!dokuRes.ok) {
            console.error("DOKU API Error:", dokuData);
            return NextResponse.json({ error: dokuData.error?.message || "DOKU API Error" }, { status: dokuRes.status });
        }

        return NextResponse.json({ 
            paymentUrl: dokuData.response.payment.url,
            orderId: requestId // Unique ID per payment attempt
        });

    } catch (error: any) {
        console.error("DOKU Checkout Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
