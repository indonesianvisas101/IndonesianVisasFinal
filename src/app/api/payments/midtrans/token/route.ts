import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { invoiceId, amount, customerDetails, items } = body;

        // Basic validation
        if (!invoiceId || !amount) {
            return NextResponse.json({ error: "Missing required fields (invoiceId, amount)" }, { status: 400 });
        }

        // Append timestamp to ensure order_id uniqueness across retries
        const orderId = `INV-${invoiceId}-${Date.now()}`;

        // Environment-aware Midtrans keys
        const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
        const serverKey = isProduction
            ? process.env.MIDTRANS_PROD_SERVER_KEY
            : process.env.MIDTRANS_SERVER_KEY;

        const apiUrl = isProduction
            ? 'https://app.midtrans.com/snap/v1/transactions'
            : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

        if (!serverKey) {
            console.error("Missing Midtrans Server Key in .env.local");
            return NextResponse.json({ error: "Payment gateway configuration is missing" }, { status: 500 });
        }

        // Midtrans requires the server key to be Base64 encoded as 'ServerKey:'
        const authString = Buffer.from(`${serverKey}:`).toString('base64');

        // Validation for Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let customerEmail = customerDetails?.email || "help@indonesianvisas.info";
        if (!emailRegex.test(customerEmail)) {
            console.warn("Invalid email format for Midtrans, using fallback:", customerEmail);
            customerEmail = "help@indonesianvisas.info";
        }

        const payload = {
            transaction_details: {
                order_id: orderId,
                gross_amount: Math.round(amount), // Must be an integer
            },
            customer_details: {
                first_name: customerDetails?.first_name || "Client",
                last_name: customerDetails?.last_name || "",
                email: customerEmail,
                phone: customerDetails?.phone || ""
            },
            item_details: items || [{
                id: invoiceId,
                price: Math.round(amount),
                quantity: 1,
                name: "Indonesian Visas Service"
            }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${authString}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Midtrans API Error:", data);
            return NextResponse.json({ error: "Failed to generate Snap token", details: data }, { status: response.status });
        }

        // Securely log the payment intent in Prisma database
        await prisma.payment.create({
            data: {
                orderId: orderId,
                invoiceId: invoiceId,
                grossAmount: amount,
                status: 'PENDING',
                snapToken: data.token,
                snapRedirectUrl: data.redirect_url,
            }
        });

        return NextResponse.json({
            success: true,
            token: data.token,
            redirect_url: data.redirect_url,
            orderId: orderId
        });

    } catch (error: any) {
        console.error("Payment Token Generator Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
