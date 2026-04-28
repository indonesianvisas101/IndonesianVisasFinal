import { Resend } from 'resend';
import prisma from '@/lib/prisma';

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

export const sendConfirmationEmail = async (to: string, data: {
    applicantName: string;
    visaType: string;
    invoiceUrl: string;
    orderId: string;
    isPayPal?: boolean;
    hasIdiv?: boolean;
    verificationSlug?: string;
}) => {
    try {
        const { applicantName, visaType, invoiceUrl, orderId, isPayPal, hasIdiv, verificationSlug } = data;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
        
        let message = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
                ${getEmailHeader()}
                
                <h2 style="color: #7c3aed; font-size: 24px; font-weight: 800; margin-bottom: 10px;">Application Received</h2>
                <p style="font-size: 16px; line-height: 1.6;">Dear ${applicantName},</p>
                <p style="font-size: 16px; line-height: 1.6;">Thank you for choosing <strong>Indonesian Visas Agency</strong>. We have successfully received your application for <strong>${visaType}</strong>.</p>
                
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 4px 0; font-size: 14px; color: #64748b;">ORDER REFERENCE</td>
                            <td style="padding: 4px 0; font-size: 14px; font-weight: 700; text-align: right; color: #1e293b;">#${orderId.toUpperCase()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 4px 0; font-size: 14px; color: #64748b;">SERVICE TYPE</td>
                            <td style="padding: 4px 0; font-size: 14px; font-weight: 700; text-align: right; color: #1e293b;">${visaType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 4px 0; font-size: 14px; color: #64748b;">SUBMISSION DATE</td>
                            <td style="padding: 4px 0; font-size: 14px; font-weight: 700; text-align: right; color: #1e293b;">${new Date().toLocaleDateString()}</td>
                        </tr>
                    </table>
                </div>

                <p style="font-size: 15px; line-height: 1.6;">Our legal team is currently conducting an initial review of your submission. We will notify you immediately if any additional documentation is required.</p>

                ${isPayPal ? `
                <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>PayPal Processing Note:</strong> Funds may take up to 3 business days to clear. Official processing will commence once the transaction is verified in our system.</p>
                </div>
                ` : ''}

                <div style="margin: 30px 0; text-align: center;">
                    <a href="${invoiceUrl}" style="background-color: #7c3aed; color: white; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);">Manage Order & Invoice</a>
                </div>

                <!-- IDIV PROMOTION SECTION -->
                ${!hasIdiv && verificationSlug ? `
                <div style="margin-top: 40px; padding: 25px; border: 2px dashed #7c3aed; border-radius: 16px; background-color: #fdfaff; text-align: center;">
                    <div style="display: inline-block; background-color: #7c3aed; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 15px;">Smart Travel Perk</div>
                    <h3 style="margin: 0 0 10px 0; color: #1e1b4b; font-size: 20px;">Upgrade Your Travel Identity</h3>
                    <p style="font-size: 14px; color: #475569; line-height: 1.5; margin-bottom: 20px;">
                        Every traveler in Indonesia is legally required to have a local sponsor. Our <strong>IDiv (Verified Smart ID)</strong> digitalizes this requirement into a secure, verifiable mobile profile.
                    </p>
                    
                    <div style="margin: 15px 0;">
                        <a href="${appUrl}/verify/${verificationSlug}" style="background-color: #1e1b4b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; display: block; margin-bottom: 10px;">Preview Your Verified ID</a>
                        <a href="${appUrl}/why-travelers-need-a-sponsor-id" style="background-color: #ffffff; color: #7c3aed; padding: 10px 20px; text-decoration: none; border: 1px solid #7c3aed; border-radius: 8px; font-size: 14px; font-weight: 600; display: block;">Why You Need This?</a>
                    </div>
                </div>
                ` : ''}

                <p style="color: #64748b; font-size: 14px; margin-top: 30px; border-top: 1px solid #f1f5f9; pt: 20px;">
                    Questions? Simply reply to this email or visit our <a href="${appUrl}/faq" style="color: #7c3aed; text-decoration: none;">Help Center</a>.
                </p>
                ${getEmailFooter()}
            </div>
        `;

        const emailSubject = `Application Received: #${orderId.toUpperCase()} for ${visaType}`;
        await resend.emails.send({
            from: 'Indonesian Visas <contact@indonesianvisas.agency>',
            to: [to],
            subject: emailSubject,
            html: message,
        });
        
        await prisma.emailLog.create({
            data: { recipient: to, subject: emailSubject, content: message, status: 'SENT' }
        }).catch(e => console.error("Failed to log sent email", e));
        
        // TRIGGER 24H TRIAL START (Hardening Activation Logic)
        if (verificationSlug) {
            try {
                // Safe update: If column doesn't exist, it won't crash the email process
                await (prisma.verification as any).update({
                    where: { slug: verificationSlug },
                    data: { idivPreviewExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) }
                });
                console.log(`[IDiv] 24h Preview trial initialized for ${verificationSlug}`);
            } catch (e: any) {
                // Log the warning but DON'T stop the email flow
                console.warn("[IDiv Warning] Could not set preview expiration. Database might need sync, but email flow is safe.");
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Resend Confirmation Email Error:", error);
        return { success: false, error };
    }
};

export const sendPaymentSuccessEmail = async (to: string, data: {
    applicantName: string;
    orderId: string;
    invoiceUrl: string;
}) => {
    try {
        const { applicantName, orderId, invoiceUrl } = data;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
        
        let message = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
                ${getEmailHeader()}
                
                <div style="text-align: center; margin-bottom: 25px;">
                    <div style="display: inline-block; background-color: #ecfdf5; color: #059669; padding: 8px 16px; border-radius: 30px; font-weight: 700; font-size: 14px; margin-bottom: 15px;">✓ PAYMENT CONFIRMED</div>
                    <h2 style="color: #1e1b4b; font-size: 24px; font-weight: 800; margin: 0;">We've Received Your Payment</h2>
                </div>

                <p style="font-size: 16px; line-height: 1.6;">Dear ${applicantName},</p>
                <p style="font-size: 16px; line-height: 1.6;">Great news! Your payment for order <strong>#${orderId.toUpperCase()}</strong> has been successfully processed and verified. We appreciate your prompt action.</p>
                
                <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #166534; font-weight: 600;">NEW APPLICATION STATUS</p>
                    <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 800; color: #166534; text-transform: uppercase;">Under Official Review</p>
                </div>

                <p style="font-size: 16px; line-height: 1.6;">Your application has been fast-tracked to our legal processing department. Our team will now finalize the sponsorship documents and proceed with the official immigration submission.</p>
                
                <div style="margin: 35px 0; text-align: center; display: flex; flex-direction: column; gap: 10px; align-items: center;">
                    <a href="${invoiceUrl}" style="background-color: #059669; color: white; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);">Download Paid Invoice (PDF)</a>
                    <a href="${appUrl}/login" style="margin-top: 15px; color: #64748b; font-size: 14px; text-decoration: underline;">Track Status in Dashboard</a>
                </div>

                <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 30px 0;">
                    <p style="margin: 0; font-size: 15px; color: #1e293b; font-weight: 700;">What's next?</p>
                    <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.6;">
                        <li>Final document verification by our agents.</li>
                        <li>Submission to the Indonesian Directorate General of Immigration.</li>
                        <li>Notification of approval and visa issuance via this email.</li>
                    </ul>
                </div>

                <p style="color: #64748b; font-size: 14px;">If you have any urgent questions, our support team is available via WhatsApp or by replying directly to this email.</p>
                ${getEmailFooter()}
            </div>
        `;

        const emailSubject = `Payment Confirmed: Order #${orderId.toUpperCase()} is Now Processing`;
        await resend.emails.send({
            from: 'Indonesian Visas <contact@indonesianvisas.agency>',
            to: [to],
            subject: emailSubject,
            html: message,
        });
        
        await prisma.emailLog.create({
            data: { recipient: to, subject: emailSubject, content: message, status: 'SENT' }
        }).catch(e => console.error("Failed to log sent email", e));
        
        return { success: true };
    } catch (error) {
        console.error("Resend Payment Email Error:", error);
        return { success: false, error };
    }
};

export const sendPaymentReminderEmail = async (to: string, data: {
    applicantName: string;
    visaType: string;
    amount: string;
    paymentUrl: string;
}) => {
    try {
        const { applicantName, visaType, amount, paymentUrl } = data;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
        
        let message = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
                ${getEmailHeader()}
                
                <h2 style="color: #ea580c; font-size: 24px; font-weight: 800; margin-bottom: 10px;">Action Required: Payment Pending</h2>
                <p style="font-size: 16px; line-height: 1.6;">Dear ${applicantName},</p>
                <p style="font-size: 16px; line-height: 1.6;">We noticed that your application for <strong>${visaType}</strong> is currently awaiting payment. To avoid any processing delays, we recommend completing this step as soon as possible.</p>
                
                <div style="background-color: #fff7ed; border: 1px solid #ffedd5; padding: 20px; border-radius: 12px; margin: 25px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 4px 0; font-size: 14px; color: #9a3412;">SERVICE</td>
                            <td style="padding: 4px 0; font-size: 14px; font-weight: 700; text-align: right; color: #ea580c;">${visaType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 4px 0; font-size: 14px; color: #9a3412;">STATUS</td>
                            <td style="padding: 4px 0; font-size: 14px; font-weight: 700; text-align: right; color: #ea580c;">PENDING PAYMENT</td>
                        </tr>
                        <tr>
                            <td style="padding: 4px 0; font-size: 14px; color: #9a3412;">TOTAL DUE</td>
                            <td style="padding: 4px 0; font-size: 18px; font-weight: 800; text-align: right; color: #ea580c;">${amount}</td>
                        </tr>
                    </table>
                </div>

                <p style="font-size: 15px; line-height: 1.6;">Official processing typically begins within 4 hours of payment verification. By completing your payment now, you lock in the current regulatory fees and prioritize your submission.</p>
                
                <div style="margin: 35px 0; text-align: center;">
                    <a href="${paymentUrl}" style="background-color: #ea580c; color: white; padding: 16px 35px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);">Secure Checkout Now</a>
                </div>

                <div style="background-color: #f8fafc; border-radius: 12px; padding: 15px; margin: 20px 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                    <p style="margin: 0;"><strong>Why complete payment now?</strong></p>
                    <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                        <li>Regulatory immigration fees are subject to change without notice.</li>
                        <li>Priority queue placement for legal document review.</li>
                        <li>24/7 dedicated support for active paid orders.</li>
                    </ul>
                </div>
                
                <p style="color: #64748b; font-size: 14px;">If you have already made the payment via bank transfer, please reply to this email with your transfer proof for faster verification.</p>
                ${getEmailFooter()}
            </div>
        `;

        const emailSubject = `Action Required: Complete Your Payment for ${visaType}`;
        await resend.emails.send({
            from: 'Indonesian Visas <contact@indonesianvisas.agency>',
            to: [to],
            subject: emailSubject,
            html: message,
        });
        
        await prisma.emailLog.create({
            data: { recipient: to, subject: emailSubject, content: message, status: 'SENT' }
        }).catch(e => console.error("Failed to log sent email", e));
        
        return { success: true };
    } catch (error) {
        console.error("Resend Reminder Email Error:", error);
        return { success: false, error };
    }
};

export const sendAdminOrderNotification = async (data: {
    orderType: string;
    applicantName: string;
    applicantEmail: string;
    visaType: string;
    amount: string;
    invoiceUrl: string;
    details?: string;
}) => {
    try {
        const { orderType, applicantName, applicantEmail, visaType, amount, invoiceUrl, details } = data;
        
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
        const loginUrl = `${appUrl}/login`;

        let message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #fcfcfc;">
                <h2 style="color: #9155FD; border-bottom: 2px solid #9155FD; padding-bottom: 10px;">New Order Alert!</h2>
                <div style="margin: 20px 0;">
                    <p><strong>Order Type:</strong> ${orderType}</p>
                    <p><strong>Applicant:</strong> ${applicantName} (${applicantEmail})</p>
                    <p><strong>Service:</strong> ${visaType}</p>
                    <p><strong>Amount:</strong> ${amount}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                ${details ? `<div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <p style="margin: 0; white-space: pre-wrap;"><strong>Additional Details:</strong><br/>${details}</p>
                </div>` : ''}

                <div style="margin: 30px 0; text-align: center;">
                    <a href="${invoiceUrl}" style="background-color: #9155FD; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Order in Admin</a>
                </div>

                <div style="text-align: center; margin-top: 10px;">
                    <a href="${loginUrl}" style="color: #666; font-size: 12px;">Login to Dashboard</a>
                </div>

                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
                <p style="font-size: 12px; color: #999;">System Notification - Indonesian Visas Agency</p>
            </div>
        `;

        const emailSubject = `NEW ORDER: ${applicantName} - ${visaType}`;
        await resend.emails.send({
            from: 'Indonesian Visas System <system@indonesianvisas.agency>',
            to: ['indonesianvisas@gmail.com'],
            subject: emailSubject,
            html: message,
        });
        
        await prisma.emailLog.create({
            data: { recipient: 'indonesianvisas@gmail.com', subject: emailSubject, content: message, status: 'SENT' }
        }).catch(e => console.error("Failed to log sent email", e));
        
        return { success: true };
    } catch (error) {
        console.error("Resend Admin Notification Error:", error);
        await prisma.emailLog.create({
            data: { recipient: 'indonesianvisas@gmail.com', subject: `FAILED: New Order Alert`, content: String(error), status: 'FAILED' }
        }).catch(() => {});
        return { success: false, error };
    }
};

export const sendAbandonedCartEmail = async (to: string, data: {
    applicantName: string;
    visaType: string;
    resumeUrl: string;
}) => {
    try {
        const { applicantName, visaType, resumeUrl } = data;
        
        let message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #ffffff;">
                ${getEmailHeader()}
                <h2 style="color: #9155FD;">Need help with your ${visaType}?</h2>
                <p>Hello ${applicantName},</p>
                <p>We noticed you started an application for an <strong>Indonesian ${visaType}</strong> but didn't quite finish.</p>
                <p>In Bali, things move fast! We've saved your progress so you can pick up exactly where you left off.</p>
                
                <div style="margin: 30px 0; text-align: center;">
                    <a href="${resumeUrl}" style="background-color: #9155FD; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Resume Your Application</a>
                </div>

                <div style="background-color: #F4F0FF; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; color: #5B21B6; font-size: 14px;"><strong>Why complete your application now?</strong><br/>
                    • Guaranteed review by our legal experts within 4 hours.<br/>
                    • Avoid last-minute price increases or regulatory changes.<br/>
                    • 100% Secure & Official Indonesian Visa Agency.</p>
                </div>
                
                <p style="color: #666; font-size: 14px;">If you have any questions, just reply to this email or reach out via WhatsApp.</p>
                ${getEmailFooter()}
            </div>
        `;

        const emailSubject = `Wait! Your Indonesia Visa application for ${visaType} is almost ready`;
        await resend.emails.send({
            from: 'Indonesian Visas <contact@indonesianvisas.agency>',
            to: [to],
            subject: emailSubject,
            html: message,
        });
        
        await prisma.emailLog.create({
            data: { recipient: to, subject: emailSubject, content: message, status: 'SENT' }
        }).catch(e => console.error("Failed to log sent email", e));
        
        return { success: true };
    } catch (error) {
        console.error("Resend Abandoned Cart Error:", error);
        await prisma.emailLog.create({
            data: { recipient: to, subject: `FAILED: Abandoned Cart ${data.visaType}`, content: String(error), status: 'FAILED' }
        }).catch(() => {});
        return { success: false, error };
    }
};
