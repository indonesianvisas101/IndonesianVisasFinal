
import { NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { invoiceId, amount, currency = 'USD' } = await req.json();

        if (!invoiceId || !amount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Create PayPal Order
        const paypalOrder = await createPayPalOrder(Number(amount), currency, invoiceId);

        // Record the payment attempt in Database
        await prisma.payment.create({
            data: {
                orderId: paypalOrder.id,
                invoiceId: invoiceId,
                grossAmount: Number(amount),
                currency: currency,
                paymentType: 'PAYPAL',
                status: 'CREATED',
                metadata: {
                    paypalOrderId: paypalOrder.id,
                    links: paypalOrder.links
                }
            }
        });

        return NextResponse.json({ id: paypalOrder.id });
    } catch (error: any) {
        console.error("[PAYPAL_CREATE_ORDER]", error);
        return NextResponse.json({ error: error.message || "Failed to create PayPal order" }, { status: 500 });
    }
}
