import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_stub_for_build');

export const sendConfirmationEmail = async (to: string, data: {
    applicantName: string;
    visaType: string;
    invoiceUrl: string;
    isPayPal?: boolean;
}) => {
    try {
        const { applicantName, visaType, invoiceUrl, isPayPal } = data;
        
        let message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #9155FD;">Application Received!</h2>
                <p>Hello ${applicantName},</p>
                <p>Thank you for choosing <strong>Indonesian Visas Agency</strong>. We have received your application for <strong>${visaType}</strong>.</p>
                
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
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
                <p style="font-size: 12px; color: #999;">PT Indonesian Visas Agency™<br/>Jl. Tibungsari No.11C, Bali, Indonesia</p>
            </div>
        `;

        await resend.emails.send({
            from: 'Indonesian Visas <contact@indonesianvisas.agency>',
            to: [to],
            subject: `Application Submission: ${visaType}`,
            html: message,
        });
        
        return { success: true };
    } catch (error) {
        console.error("Resend Confirmation Email Error:", error);
        return { success: false, error };
    }
};

export const sendPaymentSuccessEmail = async (to: string, data: {
    applicantName: string;
    invoiceId: string;
    invoiceUrl: string;
}) => {
    try {
        const { applicantName, invoiceUrl } = data;
        
        let message = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #56CA00;">Payment Confirmed!</h2>
                <p>Hello ${applicantName},</p>
                <p>Thanks for the trusted payment! We have received your payment correctly.</p>
                <p>We will now review your application process and send the answer ASAP.</p>
                
                <div style="margin: 30px 0; text-align: center;">
                    <a href="${invoiceUrl}" style="background-color: #56CA00; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Download Paid Invoice</a>
                </div>

                <p style="color: #666; font-size: 14px;">Your application status has been updated to <strong>Paid</strong>.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
                <p style="font-size: 12px; color: #999;">PT Indonesian Visas Agency™<br/>Jl. Tibungsari No.11C, Bali, Indonesia</p>
            </div>
        `;

        await resend.emails.send({
            from: 'Indonesian Visas <contact@indonesianvisas.agency>',
            to: [to],
            subject: `Payment Success - Indonesian Visas`,
            html: message,
        });
        
        return { success: true };
    } catch (error) {
        console.error("Resend Payment Email Error:", error);
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

        await resend.emails.send({
            from: 'Indonesian Visas System <system@indonesianvisas.agency>',
            to: ['indonesianvisas@gmail.com'],
            subject: `NEW ORDER: ${applicantName} - ${visaType}`,
            html: message,
        });
        
        return { success: true };
    } catch (error) {
        console.error("Resend Admin Notification Error:", error);
        return { success: false, error };
    }
};
