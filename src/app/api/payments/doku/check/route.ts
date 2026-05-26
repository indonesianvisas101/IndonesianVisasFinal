import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendPaymentSuccessEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing required invoice/application ID" }, { status: 400 });
        }

        const clientId = process.env.NEXT_PUBLIC_DOKU_CLIENT_ID;
        const secretKey = process.env.DOKU_SECRET_KEY;
        const isProduction = process.env.NEXT_PUBLIC_DOKU_IS_PRODUCTION === 'true';

        if (!clientId || !secretKey) {
            return NextResponse.json({ error: "Payment Gateway configuration error. Please contact administrator." }, { status: 500 });
        }

        // 1. Locate the Invoice using direct and flexible lookups (id, applicationId, or application slug)
        const invoice = await prisma.invoice.findFirst({
            where: {
                OR: [
                    { id: id },
                    { applicationId: id },
                    { visaApplication: { slug: id } }
                ]
            },
            include: {
                visaApplication: true
            }
        });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found in database" }, { status: 404 });
        }

        // If the invoice is already paid, return early to save API calls
        if (invoice.status === 'PAID') {
            return NextResponse.json({ 
                success: true, 
                message: "Invoice has already been marked as PAID.",
                status: 'PAID'
            });
        }

        // 2. Retrieve all related payment records for this invoice
        const payments = await prisma.payment.findMany({
            where: { invoiceId: invoice.id }
        });

        // Collect all orderIds to check (including a fallback for the base invoice ID itself)
        const orderIdsToCheck = new Set<string>();
        payments.forEach(p => {
            if (p.orderId) orderIdsToCheck.add(p.orderId);
        });
        
        // Add direct base invoice ID as a fallback check
        orderIdsToCheck.add(invoice.id);

        const baseUrl = isProduction 
            ? 'https://api.doku.com' 
            : 'https://api-sandbox.doku.com';

        let wasPaid = false;
        let successfulPaymentData = null;
        let matchedOrderId = "";

        // 3. Query Doku orders status API for each potential checkout transaction
        for (const orderId of orderIdsToCheck) {
            try {
                const targetPath = `/orders/v1/status/${orderId}`;
                const requestId = crypto.randomBytes(16).toString('hex');
                const timestamp = new Date().toISOString().split('.')[0] + 'Z';

                // Signature Payload for GET requests (NO digest needed because GET has no body)
                const signaturePayload = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${targetPath}`;
                const signature = crypto.createHmac('sha256', secretKey).update(signaturePayload).digest('base64');

                console.log(`[DOKU Status Check] Querying ${orderId}...`);
                const dokuRes = await fetch(`${baseUrl}${targetPath}`, {
                    method: 'GET',
                    headers: {
                        'Client-Id': clientId,
                        'Request-Id': requestId,
                        'Request-Timestamp': timestamp,
                        'Signature': `HMACSHA256=${signature}`
                    }
                });

                if (dokuRes.ok) {
                    const dokuData = await dokuRes.json();
                    console.log(`[DOKU Status Check] Response for ${orderId}:`, JSON.stringify(dokuData, null, 2));

                    const status = dokuData.transaction?.status || dokuData.status;
                    if (status === 'SUCCESS') {
                        wasPaid = true;
                        successfulPaymentData = dokuData;
                        matchedOrderId = orderId;
                        break; // Stop checking other attempts if we found a paid one!
                    }
                } else {
                    console.warn(`[DOKU Status Check] Doku returned non-ok status for ${orderId}:`, dokuRes.status);
                }
            } catch (err: any) {
                console.error(`[DOKU Status Check] Failed to verify status for ${orderId}:`, err.message);
            }
        }

        // 4. If transaction was indeed paid in Doku, perform the DB self-healing synchronization!
        if (wasPaid && successfulPaymentData) {
            const { transaction, service } = successfulPaymentData;
            
            // A. Upsert the matching payment record to SUCCESS
            await prisma.payment.upsert({
                where: { orderId: matchedOrderId },
                update: {
                    status: 'SUCCESS',
                    transactionId: transaction?.id || null,
                    paymentType: service?.id || null,
                    metadata: successfulPaymentData as any
                },
                create: {
                    orderId: matchedOrderId,
                    invoiceId: invoice.id,
                    grossAmount: invoice.amount,
                    status: 'SUCCESS',
                    transactionId: transaction?.id || null,
                    paymentType: service?.id || null,
                    metadata: successfulPaymentData as any
                }
            });

            // B. Mark the Invoice as PAID
            await prisma.invoice.update({
                where: { id: invoice.id },
                data: {
                    status: 'PAID',
                    paymentMethod: `DOKU_${service?.id || 'ONLINE'}`,
                    paymentReference: transaction?.id || null,
                    paidAt: new Date()
                }
            });

            // C. Move the Visa Application to "Review by Agent"
            if (invoice.applicationId) {
                const visaApp = await prisma.visaApplication.update({
                    where: { id: invoice.applicationId },
                    data: {
                        status: 'Review by Agent',
                        paymentMethod: 'DOKU'
                    }
                });

                let accessPin: string | undefined = undefined;

                // D. Auto-verify the Verification document record
                if (visaApp.verificationId) {
                    try {
                        const verif = await prisma.verification.update({
                            where: { id: visaApp.verificationId },
                            data: {
                                status: 'VALID'
                            }
                        });
                        if (verif.accessPin) accessPin = verif.accessPin;
                    } catch (e) {
                        console.error("Failed to update verification status on status sync", e);
                    }
                }

                // E. Trigger Formspree Notification
                try {
                    await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ORDER_ID || 'mqeawejv'}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            OrderType: "DOKU Status Sync Success",
                            VisaType: visaApp.visaName,
                            Applicant: visaApp.guestName,
                            Email: visaApp.guestEmail,
                            InvoiceID: invoice.id,
                            Amount: invoice.amount.toString(),
                            TransactionID: transaction?.id
                        })
                    }).catch(() => {});
                } catch {}

                // F. Send Confirmation Email to the customer
                try {
                    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
                    const invoiceUrl = `${appUrl}/invoice/${visaApp.slug || visaApp.id}`;
                    
                    await sendPaymentSuccessEmail(visaApp.guestEmail!, {
                        applicantName: visaApp.guestName || 'Applicant',
                        orderId: invoice.id,
                        invoiceUrl: invoiceUrl,
                        accessPin: accessPin
                    });
                } catch (e) {
                    console.error("Payment success email sync failed:", e);
                }
            }

            return NextResponse.json({ 
                success: true, 
                message: "Rekonsiliasi sukses! Invoice berhasil ditandai sebagai PAID.",
                status: 'PAID'
            });
        }

        return NextResponse.json({ 
            success: false, 
            message: "Pembayaran belum terkonfirmasi di server DOKU atau transaksi belum diselesaikan.",
            status: 'UNPAID'
        });

    } catch (error: any) {
        console.error("DOKU Check Status Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
