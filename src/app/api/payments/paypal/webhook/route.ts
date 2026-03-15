
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
            const captureId = body.resource.id;
            const orderId = body.resource.supplementary_data?.related_ids?.order_id || body.resource.parent_payment;
            
            console.log(`[PAYPAL_WEBHOOK] Capture completed: ${captureId} for Order: ${orderId}`);

            // The capture logic is already in /api/payments/paypal/capture-order
            // But if the client fails to call it, we can sync here based on orderId
            // To be robust, we'd find the payment record and update status
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("[PAYPAL_WEBHOOK_ERROR]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
