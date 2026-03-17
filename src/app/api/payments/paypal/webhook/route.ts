
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { capturePayPalOrder } from '@/lib/paypal';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const eventType = body.event_type;

        console.log(`[PAYPAL_WEBHOOK] Received event: ${eventType}`);

        // Handle specific events
        if (eventType === 'CHECKOUT.ORDER.APPROVED') {
            const orderId = body.resource.id;
            // Optionally auto-capture here if not done via client
            console.log(`[PAYPAL_WEBHOOK] Order approved: ${orderId}`);
        } 
        else if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
            const resource = body.resource;
            const captureId = resource.id;
            const orderId = resource.supplementary_data?.related_ids?.order_id || resource.parent_payment;
            
            console.log(`[PAYPAL_WEBHOOK] Capture completed: ${captureId} for Order: ${orderId}`);

            if (orderId) {
                // Find payment by orderId
                const payment = await prisma.payment.findFirst({
                    where: { orderId: orderId }
                });

                if (payment) {
                    await prisma.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: 'COMPLETED',
                            transactionId: captureId,
                            updatedAt: new Date()
                        }
                    });

                    if (payment.invoiceId) {
                        await prisma.invoice.update({
                            where: { id: payment.invoiceId },
                            data: {
                                status: 'PAID',
                                updatedAt: new Date(),
                                paidAt: new Date()
                            }
                        });
                        console.log(`[PAYPAL_WEBHOOK] Updated Invoice ${payment.invoiceId} to PAID`);
                    }
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("[PAYPAL_WEBHOOK_ERROR]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
