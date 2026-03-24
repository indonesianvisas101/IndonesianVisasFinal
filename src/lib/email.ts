import { Resend } from 'resend';
import prisma from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY || 're_stub_for_build');

const getEmailHeader = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
    return `
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9; font-family: sans-serif;">
            <img src="${appUrl}/Favicon.webp" alt="Indonesian Visas Logo" style="width: 52px; height: 52px; border-radius: 50%;" />
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
                    <img src="${appUrl}/Favicon.webp" alt="Logo" style="width: 44px; height: 44px; border-radius: 50%; display: block;" />
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
}) => {
    try {
        const { applicantName, visaType, invoiceUrl, orderId, isPayPal } = data;
        
        let message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #ffffff;">
                ${getEmailHeader()}
                <h2 style="color: #9155FD;">Application Received!</h2>
                <p>Hello ${applicantName},</p>
                <div style="background-color: #f4f0ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p style="margin: 0; font-size: 14px;"><strong>ORDER ID:</strong> ${orderId}</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>SERVICE:</strong> ${visaType}</p>
                </div>
                <p>Thank you for choosing <strong>Indonesian Visas Agency</strong>. We have received your application.</p>
                
                ${isPayPal ? `
                <div style="background-color: #FFF9E6; border-left: 4px solid #FFB400; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #856404;"><strong>Important Note for PayPal:</strong><br/>
                    Confirmation takes up to 3 days. We will start processing your application once the funds arrive in our account.</p>
                </div>
                ` : ''}

                <p>We are currently reviewing your submission and will provide an answer as soon as possible.</p>
                
                <div style="margin: 30px 0; text-align: center;">
                    <a href="${invoiceUrl}" style="background-color: #9155FD; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Your Invoice</a>
                </div>

                <p style="color: #666; font-size: 14px;">If you have any questions, please reply to this email or contact us at support@indonesianvisas.agency</p>
                ${getEmailFooter()}
            </div>
        `;

        const emailSubject = `Order #${orderId} - Application Submission`;
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
        console.error("Resend Confirmation Email Error:", error);
        await prisma.emailLog.create({
            data: { recipient: to, subject: `FAILED: Order #${data.orderId}`, content: String(error), status: 'FAILED' }
        }).catch(() => {});
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
        
        let message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #ffffff;">
                ${getEmailHeader()}
                <h2 style="color: #56CA00;">Payment Confirmed!</h2>
                <p>Hello ${applicantName},</p>
                <div style="background-color: #e6ffeb; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p style="margin: 0; font-size: 14px;"><strong>ORDER ID:</strong> ${orderId}</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #56CA00;">Status: PAID & Review by Agent</p>
                </div>
                <p>Thanks for the trusted payment! We have received your payment correctly.</p>
                <p>Your application is now under <strong>Review by Agent</strong>. We will process your documents and notify you of any updates ASAP.</p>
                
                <div style="margin: 30px 0; text-align: center;">
                    <a href="${invoiceUrl}" style="background-color: #56CA00; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Download Paid Invoice</a>
                </div>

                <div style="background-color: #F0F9FF; border-left: 4px solid #0EA5E9; padding: 15px; margin: 25px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #0369A1; font-weight: bold;">💡 Suggestion: Track Your Progress</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #0C4A6E;">
                        Create an account using this email to track your application status in real-time and download your visa once issued.
                    </p>
                    <p style="margin: 10px 0 0 0;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/register" style="color: #0EA5E9; font-weight: bold; text-decoration: underline;">Create Account Now</a>
                    </p>
                </div>

                <p style="color: #666; font-size: 14px;">If you have any questions, please reply to this email or contact us via WhatsApp.</p>
                ${getEmailFooter()}
            </div>
        `;

        const emailSubject = `Payment Confirmed - Order #${orderId}`;
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
        await prisma.emailLog.create({
            data: { recipient: to, subject: `FAILED: Payment Confirmed #${data.orderId}`, content: String(error), status: 'FAILED' }
        }).catch(() => {});
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
        
        let message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #ffffff;">
                ${getEmailHeader()}
                <h2 style="color: #FFB400;">Action Required: Payment Pending</h2>
                <p>Hello ${applicantName},</p>
                <p>We noticed your order for <strong>${visaType}</strong> is still <strong>UNPAID</strong>.</p>
                
                <div style="background-color: #FFF9E6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p style="margin: 0; font-size: 14px;"><strong>SERVICE:</strong> ${visaType}</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #B45309;"><strong>STATUS:</strong> UNPAID</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>AMOUNT DUE:</strong> ${amount}</p>
                </div>

                <p>To finalize your application and start the legal process, please complete your payment using the secure link below:</p>
                
                <div style="margin: 30px 0; text-align: center;">
                    <a href="${paymentUrl}" style="background-color: #FFB400; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">Complete Payment Now</a>
                </div>

                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 13px;"><strong>Why pay now?</strong><br/>
                    • Prices for Indonesian visas can change without notice based on regulation.<br/>
                    • We cannot start reviewing your documents until payment is confirmed.<br/>
                    • Official processing starts within 4 hours of payment verification.</p>
                </div>
                
                <p style="color: #666; font-size: 14px;">If you have already paid or need assistance, please reply to this email or reach us on WhatsApp.</p>
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
        await prisma.emailLog.create({
            data: { recipient: to, subject: `FAILED: Payment Reminder for ${data.visaType}`, content: String(error), status: 'FAILED' }
        }).catch(() => {});
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
