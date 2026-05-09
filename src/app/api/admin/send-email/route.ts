import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/auth-helpers';
import { 
    sendPaymentSuccessEmail, 
    sendInvoiceSettledEmail, 
    sendVisaApprovedEmail,
    sendConfirmationEmail
} from '@/lib/email';
import prisma from '@/lib/prisma';
import { logAdminAction } from '@/lib/auditLogger';

export async function POST(request: Request) {
    try {
        const { authorized, error, status, dbUser } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const body = await request.json();
        const { type, email, data } = body;

        if (!email || !type) {
            return NextResponse.json({ error: "Email and Type are required" }, { status: 400 });
        }

        let result;
        switch (type) {
            case 'PAYMENT_CONFIRMED':
                result = await sendPaymentSuccessEmail(email, {
                    applicantName: data.applicantName,
                    orderId: data.orderId,
                    invoiceUrl: data.invoiceUrl,
                    hasIdiv: data.hasIdiv,
                    hasArrivalCard: data.hasArrivalCard
                });
                break;
            case 'INVOICE_SETTLED':
                result = await sendInvoiceSettledEmail(email, {
                    applicantName: data.applicantName,
                    orderId: data.orderId,
                    invoiceUrl: data.invoiceUrl
                });
                break;
            case 'VISA_APPROVED':
                result = await sendVisaApprovedEmail(email, {
                    applicantName: data.applicantName,
                    visaType: data.visaType,
                    downloadUrl: data.downloadUrl,
                    orderId: data.orderId
                });
                break;
            case 'APPLICATION_RECEIVED':
                result = await sendConfirmationEmail(email, {
                    applicantName: data.applicantName,
                    visaType: data.visaType,
                    invoiceUrl: data.invoiceUrl,
                    orderId: data.orderId,
                    isPayPal: data.isPayPal,
                    hasIdiv: data.hasIdiv,
                    verificationSlug: data.verificationSlug
                });
                break;
            default:
                return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
        }

        if (result.success) {
            if (dbUser) {
                await logAdminAction(
                    dbUser.id,
                    "SEND_MANUAL_EMAIL",
                    "Email",
                    data.orderId || email,
                    { type, email }
                );
            }
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 });
        }

    } catch (err: any) {
        console.error("Admin Send Email Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
