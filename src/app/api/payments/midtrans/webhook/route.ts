import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            order_id,
            status_code,
            gross_amount,
            signature_key,
            transaction_status,
            fraud_status,
            payment_type,
            transaction_id
        } = body;

        // Verify Environment
        const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
        const serverKey = isProduction
            ? process.env.MIDTRANS_PROD_SERVER_KEY
            : process.env.MIDTRANS_SERVER_KEY;

        if (!serverKey) {
            console.error("Missing Midtrans Server Key during webhook callback.");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        // Security Validation: Verify the Signature Key
        // Midtrans format: SHA512(order_id + status_code + gross_amount + ServerKey)
        const hashPayload = `${order_id}${status_code}${gross_amount}${serverKey}`;
        const generatedSignature = crypto.createHash('sha512').update(hashPayload).digest('hex');

        if (generatedSignature !== signature_key) {
            console.error(`Invalid Signature for order ${order_id}. Expected ${generatedSignature}, got ${signature_key}`);
            return NextResponse.json({ error: "Invalid Signature Key" }, { status: 403 });
        }

        // Determine final mapped status
        let finalStatus = transaction_status;
        if (transaction_status === 'capture') {
            if (fraud_status === 'challenge') {
                finalStatus = 'CHALLENGE';
            } else if (fraud_status === 'accept') {
                finalStatus = 'SUCCESS';
            }
        } else if (transaction_status === 'settlement') {
            finalStatus = 'SUCCESS';
        } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
            finalStatus = 'FAILED';
        } else if (transaction_status === 'pending') {
            finalStatus = 'PENDING';
        }

        // Update the Payment Model
        const paymentData = await prisma.payment.update({
            where: { orderId: order_id },
            data: {
                status: finalStatus.toUpperCase(),
                transactionId: transaction_id,
                paymentType: payment_type,
                metadata: body as any
            }
        });

        // Autoplay: If Successful, also mark the parent Invoice / Application as PAID
        if (finalStatus === 'SUCCESS') {
            if (paymentData.invoiceId) {
                await prisma.invoice.update({
                    where: { id: paymentData.invoiceId },
                    data: {
                        status: 'PAID',
                        paymentMethod: payment_type,
                        paymentReference: transaction_id,
                        paidAt: new Date()
                    }
                });

                // If invoice references a VisaApplication, update the VisaApplication status to Paid
                const invoice = await prisma.invoice.findUnique({
                    where: { id: paymentData.invoiceId }
                });

                if (invoice?.applicationId) {
                    const visaApp = await prisma.visaApplication.update({
                        where: { id: invoice.applicationId },
                        data: {
                            status: 'Paid',
                            paymentMethod: payment_type
                        }
                    });

                    // Send Automated Email Receipt via Formspree
                    if (visaApp.guestEmail || visaApp.userId) {
                        try {
                            const targetEmail = visaApp.guestEmail || "Registered User";
                            await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ORDER_ID || 'mqeawejv'}`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    OrderType: "Payment Success Receipt (Auto-Generated)",
                                    Message: "Your payment was successfully received and your order is now Processing.",
                                    VisaType: visaApp.visaName,
                                    ApplicantName: visaApp.guestName || "Registered User",
                                    ApplicantEmail: targetEmail,
                                    InvoiceID: invoice.id,
                                    TotalAmount: invoice.amount.toString(),
                                    PaymentMethod: payment_type,
                                    TransactionID: transaction_id
                                })
                            });
                        } catch (e) {
                            console.error("Failed to trigger email receipt", e);
                        }
                    }
                }
            }
        }

        console.log(`Midtrans Webhook: Successfully updated order ${order_id} to ${finalStatus}`);
        return NextResponse.json({ message: "Webhook Processed successfully", status: finalStatus });

    } catch (error: any) {
        console.error("Midtrans Webhook Error:", error);
        // We must return 200 or 500 so Midtrans knows tracking status.
        return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
    }
}
