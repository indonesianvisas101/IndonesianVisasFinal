import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { name, email, locale } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const orderId = `GCI-ORD-${Date.now().toString().slice(-6)}`;

        // 1. Save to Database (Tracking prospects)
        const prospect = await prisma.notification.create({
            data: {
                userId: null,
                title: `New GCI Order: ${name || email}`,
                message: `New official application from ${name} (${email}) for the GCI program. Ref: ${orderId}`,
                type: "info",
                actionLink: "/admin?tab=analytics",
                actionText: "View Analytics"
            }
        });

        // 2. Dispatch Email via Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        const senderEmail = "contact@indonesianvisas.agency";
        const adminEmail = "contact@indonesianvisas.agency";

        if (resendApiKey) {
            // Email to Admin (Order Notification)
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: `GCI System <${senderEmail}>`,
                    to: [adminEmail],
                    subject: `[GCI ORDER] ${orderId}: New Application from ${name || email}`,
                    html: `
                        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #2563eb; font-size: 24px; font-weight: 900; letter-spacing: -0.025em; margin: 0;">GCI APPLICATION DETECTED</h1>
                                <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Reference: <strong>${orderId}</strong></p>
                            </div>
                            
                            <p style="font-size: 16px; line-height: 1.6;">A new Diaspora verified prospect has submitted an application for the <strong>Global Citizen of Indonesia (GCI)</strong> program.</p>
                            
                            <div style="background: #f8fafc; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0; margin: 25px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase;">Applicant Name</td>
                                        <td style="padding: 10px 0; text-align: right; font-weight: 700;">${name || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase;">Email Address</td>
                                        <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #2563eb;">${email}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase;">Locale Profile</td>
                                        <td style="padding: 10px 0; text-align: right; font-weight: 700;">${locale || 'en'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase;">Submission Date</td>
                                        <td style="padding: 10px 0; text-align: right; font-weight: 700;">${new Date().toLocaleDateString()}</td>
                                    </tr>
                                </table>
                            </div>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="https://indonesianvisas.com/admin" style="background: #0f172a; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; display: inline-block;">ACTIVATE ELIGIBILITY REVIEW</a>
                            </div>

                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
                            <p style="font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
                                This is a secure automated order transmission from the GCI Hardened Hub.<br />
                                Indonesian Visas Agency™ Intelligence Unit.
                            </p>
                        </div>
                    `
                })
            });

            // Email to Client (Order Confirmation)
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: `Indonesian Visas <${senderEmail}>`,
                    to: [email],
                    subject: `Order Received: GCI Application Briefing (${orderId})`,
                    html: `
                        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b;">
                            <div style="margin-bottom: 30px;">
                                <h1 style="color: #2563eb; font-size: 24px; font-weight: 900; letter-spacing: -0.025em; margin: 0;">APPLICATION RECEIVED</h1>
                                <p style="color: #64748b; font-size: 14px; margin-top: 5px;">GCI Legacy Program | Ref: <strong>${orderId}</strong></p>
                            </div>
                            
                            <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${name || 'Applicant'}</strong>,</p>
                            <p style="font-size: 16px; line-height: 1.6;">Thank you for your application to secure the <strong>Global Citizen of Indonesia (GCI)</strong> status. This email confirms that your preliminary interest has been successfully logged in our Diaspora Intelligence system.</p>
                            
                            <div style="background: #f8fafc; padding: 25px; border-left: 4px solid #2563eb; border-radius: 4px; margin: 25px 0;">
                                <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #2563eb; text-transform: uppercase; letter-spacing: 0.1em;">Next Tactical Steps:</h3>
                                <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #475569;">
                                    <li>Our compliance unit will verify your blood-bond eligibility.</li>
                                    <li>A strategic briefing PDF will be dispatched to this email.</li>
                                    <li>One of our Diaspora legal consultants may reach out for clarification.</li>
                                </ul>
                            </div>

                            <p style="font-size: 15px; line-height: 1.6;">If you have any immediate questions regarding your property rights or residency status under GCI, please reply directly to this email.</p>

                            <br />
                            <p style="font-size: 14px; color: #64748b; margin-bottom: 5px;">Best regards,</p>
                            <p style="font-size: 16px; font-weight: 900; color: #0f172a; margin: 0;">Strategic Intelligence Unit</p>
                            <p style="font-size: 13px; color: #2563eb; margin: 5px 0 0 0;">IndonesianVisas.com</p>

                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
                            <p style="font-size: 11px; color: #94a3b8; text-align: center;">
                                PT Indonesian Visas Agency™<br />
                                Registered Indonesian Immigration Sponsor #IV-9921
                            </p>
                        </div>
                    `
                })
            });
        }

        return NextResponse.json({ success: true, prospectId: prospect.id, orderId });

    } catch (error: any) {
        console.error("GCI Submission Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
