import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/auth-helpers';
import { 
    sendPaymentSuccessEmail, 
    sendInvoiceSettledEmail, 
    sendVisaApprovedEmail,
    sendConfirmationEmail,
    sendPaymentReminderEmail
} from '@/lib/email';
import prisma from '@/lib/prisma';
import { logAdminAction } from '@/lib/auditLogger';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_stub_for_build');

const getEmailHeader = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
    return `
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9; font-family: sans-serif;">
            <img src="${appUrl}/Favicon.webp" alt="Indonesian Visas Logo" style="width: 52px; height: 52px; border-radius: 8px; background: transparent;" />
            <h1 style="margin: 8px 0 0 0; font-size: 18px; font-weight: 800; color: #7c3aed; letter-spacing: -0.5px;">Indonesian Visas</h1>
        </div>
    `;
};

const getEmailFooter = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
    return `
        <table style="width: 100%; border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; font-family: sans-serif;">
            <tr>
                <td style="width: 48px; vertical-align: top; padding-right: 12px;">
                    <img src="${appUrl}/Favicon.webp" alt="Logo" style="width: 44px; height: 44px; border-radius: 8px; display: block; background: transparent;" />
                </td>
                <td style="vertical-align: top;">
                    <h4 style="margin: 0; font-size: 14px; color: #1e1b4b; font-weight: 700;">Indonesian Visas Agency</h4>
                    <p style="margin: 2px 0 0 0; font-size: 11px; color: #475569; font-weight: 600;">PT Indonesian Visas Agency™</p>
                    <p style="margin: 1px 0 0 0; font-size: 11px; color: #64748b;">Jl. Tibungsari No.11C, Padangsambian Kaja</p>
                    <p style="margin: 0; font-size: 11px; color: #64748b;">Denpasar, Bali, Indonesia</p>
                    <p style="margin: 6px 0 0 0; font-size: 11px; color: #6366f1; font-weight: 600;">
                        <a href="mailto:support@indonesianvisas.agency" style="color: #6366f1; text-decoration: none;">support@indonesianvisas.agency</a> | 
                        <a href="${appUrl}" style="color: #6366f1; text-decoration: none;">indonesianvisas.com</a>
                    </p>
                </td>
            </tr>
        </table>
    `;
};

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
                    orderId: data.orderId,
                    invoiceUrl: data.invoiceUrl,
                    acOrdered: data.acOrdered,
                    idivOrdered: data.idivOrdered,
                    paymentLink: data.paymentLink,
                    isSigned: data.isSigned,
                    verificationSlug: data.verificationSlug
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

            // NEW: Payment reminder email — requests customer to complete payment
            case 'PAYMENT_REMINDER':
                result = await sendPaymentReminderEmail(email, {
                    applicantName: data.applicantName,
                    visaType: data.visaType,
                    amount: data.amount || 'See Invoice',
                    paymentUrl: data.paymentUrl || data.invoiceUrl
                });
                break;

            // NEW: Free-text email — compose and send custom email from admin
            case 'FREE_TEXT': {
                if (!data.subject || !data.body) {
                    return NextResponse.json({ error: "Subject and body are required for FREE_TEXT email" }, { status: 400 });
                }

                const htmlContent = `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
                        ${getEmailHeader()}
                        <div style="font-size: 15px; line-height: 1.8; color: #1e293b; white-space: pre-wrap;">${data.body.replace(/\n/g, '<br />')}</div>
                        ${getEmailFooter()}
                    </div>
                `;

                await resend.emails.send({
                    from: 'Indonesian Visas <contact@indonesianvisas.agency>',
                    to: [email],
                    subject: data.subject,
                    html: htmlContent,
                });

                await prisma.emailLog.create({
                    data: {
                        recipient: email,
                        subject: data.subject,
                        content: htmlContent,
                        status: 'SENT'
                    }
                }).catch(e => console.error("Failed to log free-text email", e));

                result = { success: true };
                break;
            }

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
            return NextResponse.json({ error: (result as any).error || "Failed to send email" }, { status: 500 });
        }

    } catch (err: any) {
        console.error("Admin Send Email Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
