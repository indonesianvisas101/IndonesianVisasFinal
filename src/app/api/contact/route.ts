import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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
        const body = await request.json();
        const { formType, name, email, whatsapp, category, message } = body;

        if (!email || !whatsapp || !message) {
            return NextResponse.json({ error: "Email, WhatsApp, and message are required" }, { status: 400 });
        }

        const type = formType?.toLowerCase() === 'complaint' ? 'complaint' : 'inquiry';

        // Save to Database
        const contactMessage = await prisma.contactMessage.create({
            data: {
                type,
                name: type === 'inquiry' ? (name || "Anonymous") : "Complaint Submitter",
                email,
                whatsapp,
                category: type === 'complaint' ? (category || "Others") : null,
                message,
                status: 'PENDING'
            }
        });

        // Trigger system notification
        await prisma.notification.create({
            data: {
                title: type === 'complaint' ? '🚨 Customer Complaint' : '📨 Customer Message',
                message: type === 'complaint' 
                    ? `[${category || "Others"}] Issue from ${email} (${whatsapp})` 
                    : `Inquiry from ${name || "Anonymous"} (${email})`,
                type: type === 'complaint' ? 'complaint' : 'inquiry',
                isRead: false,
                actionLink: '/admin?tab=message_panel',
                actionText: 'View Messages'
            }
        }).catch(e => console.error("Failed to create system notification", e));

        // Build email html
        const subject = type === "complaint"
            ? `[COMPLAINT] Category: ${category || "Others"} - From ${email}`
            : `[INQUIRY] Message from ${name || email}`;

        const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
                ${getEmailHeader()}
                <h2 style="color: ${type === 'complaint' ? '#dc2626' : '#7c3aed'}; font-size: 20px; font-weight: 800; border-bottom: 2px solid ${type === 'complaint' ? '#dc2626' : '#7c3aed'}; padding-bottom: 10px; margin-top: 0;">
                    ${type === 'complaint' ? '🚨 Customer Complaint Received' : '📨 New Customer Inquiry'}
                </h2>
                <div style="margin: 20px 0; font-size: 15px; line-height: 1.6;">
                    ${type === 'inquiry' ? `<p><strong>Name:</strong> ${name || "Anonymous"}</p>` : ''}
                    <p><strong>Email Address:</strong> ${email}</p>
                    <p><strong>WhatsApp Number:</strong> ${whatsapp}</p>
                    ${type === 'complaint' ? `<p><strong>Complaint Category:</strong> <span style="background-color: #fee2e2; color: #dc2626; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${category || "Others"}</span></p>` : ''}
                    <p><strong>Submitted Date:</strong> ${new Date().toLocaleString()}</p>
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-top: 15px; white-space: pre-wrap;">
                        <strong>Message/Details:</strong><br/>
                        ${message}
                    </div>
                </div>
                ${getEmailFooter()}
            </div>
        `;

        // Build email recipients list
        const recipients: string[] = [];
        if (type === 'complaint') {
            recipients.push('damnbayu@gmail.com');
        }

        const masterForwardSetting = await prisma.globalSetting.findUnique({
            where: { key: 'MASTER_FORWARD_EMAILS' }
        });

        if (masterForwardSetting?.isEnabled && masterForwardSetting.value) {
            try {
                const parsed = JSON.parse(masterForwardSetting.value);
                if (Array.isArray(parsed)) {
                    parsed.forEach((e: string) => {
                        const trimmed = e.trim().toLowerCase();
                        if (trimmed && !recipients.includes(trimmed)) {
                            recipients.push(trimmed);
                        }
                    });
                }
            } catch (e) {
                masterForwardSetting.value.split(',').forEach((e: string) => {
                    const trimmed = e.trim().toLowerCase();
                    if (trimmed && !recipients.includes(trimmed)) {
                        recipients.push(trimmed);
                    }
                });
            }
        }

        // Fallback
        if (recipients.length === 0) {
            recipients.push('indonesianvisas@gmail.com');
        }

        // Send Email
        await resend.emails.send({
            from: 'Indonesian Visas System <system@indonesianvisas.agency>',
            to: recipients,
            subject: subject,
            html: emailHtml,
        });

        // Log Email
        await prisma.emailLog.create({
            data: {
                recipient: recipients.join(', '),
                subject: subject,
                content: emailHtml,
                status: 'SENT'
            }
        }).catch(e => console.error("Failed to log email forwarding", e));

        return NextResponse.json({ success: true, id: contactMessage.id });
    } catch (error: any) {
        console.error('Contact Form Submit Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
