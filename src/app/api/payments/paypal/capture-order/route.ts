
import { NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import prisma from '@/lib/prisma';
import { sendPaymentSuccessEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { orderID } = await req.json();

        if (!orderID) {
            return NextResponse.json({ error: "Missing Order ID" }, { status: 400 });
        }

        // Capture payment via PayPal API
        const captureData = await capturePayPalOrder(orderID);

        // Get payment record to find invoice
        const payment = await prisma.payment.findUnique({
            where: { orderId: orderID }
        });

        if (!payment) {
            console.warn(`[PAYPAL_CAPTURE] Payment record not found for Order ID: ${orderID}`);
        }

        const captureStatus = captureData.status;

        if (captureStatus === 'COMPLETED') {
            // Update Payment Record
            await prisma.payment.update({
                where: { orderId: orderID },
                data: {
                    status: 'SUCCESS',
                    transactionId: captureData.purchase_units[0].payments.captures[0].id,
                    metadata: captureData as any
                }
            });

            if (payment?.invoiceId) {
                // Update Invoice
                const invoice = await prisma.invoice.update({
                    where: { id: payment.invoiceId },
                    data: {
                        status: 'PAID',
                        paymentMethod: 'PAYPAL',
                        paymentReference: captureData.purchase_units[0].payments.captures[0].id,
                        paidAt: new Date()
                    }
                });

                if (invoice.applicationId) {
                    // Update Visa Application
                    const visaApp = await prisma.visaApplication.update({
                        where: { id: invoice.applicationId },
                        data: {
                            status: 'Review by Agent',
                            paymentMethod: 'PAYPAL'
                        }
                    });

                    // Trigger Success Notifications
                    try {
                        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
                        const invoiceUrl = `${appUrl}/invoice/${visaApp.slug || visaApp.id}`;
                        
                        if (visaApp.guestEmail) {
                            await sendPaymentSuccessEmail(visaApp.guestEmail, {
                                applicantName: visaApp.guestName || 'Applicant',
                                orderId: invoice.id,
                                invoiceUrl: invoiceUrl
                            });
                        }

                        // Notify Business via Formspree
                        await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ORDER_ID || 'mqeawejv'}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                OrderType: "PayPal API Payment Success",
                                VisaType: visaApp.visaName,
                                Applicant: visaApp.guestName,
                                Email: visaApp.guestEmail,
                                InvoiceID: invoice.id,
                                Amount: invoice.amount.toString(),
                                PayPalTransactionID: captureData.purchase_units[0].payments.captures[0].id
                            })
                        });
                    } catch (e) {
                        console.error("[PAYPAL_CAPTURE] Post-payment triggers failed:", e);
                    }
                }
            }
        }

        return NextResponse.json(captureData);
    } catch (error: any) {
        console.error("[PAYPAL_CAPTURE_ORDER]", error);
        return NextResponse.json({ error: error.message || "Failed to capture PayPal order" }, { status: 500 });
    }
}
