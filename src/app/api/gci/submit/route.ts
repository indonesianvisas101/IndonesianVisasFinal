import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { email, locale, metadata } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // 1. Save to Database (Optional: Tracking prospects)
        const prospect = await prisma.notification.create({
            data: {
                userId: null,
                title: "New GCI Application Prospect",
                message: `New interest from ${email} regarding the Global Citizen of Indonesia program.`,
                type: "info",
                actionLink: "/admin?tab=analytics",
                actionText: "View Analytics"
            }
        });

        // 2. Dispatch Email via Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        const adminEmail = "damnbayu@gmail.com";

        if (resendApiKey) {
            // Email to Admin (Boss)
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'GCI Global Hub <onboarding@resend.dev>',
                    to: [adminEmail],
                    subject: `[GCI ORDER] New Application Interest: ${email}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #2563eb;">New GCI Lead Detected</h2>
                            <p>Boss, we have a new potential applicant for the <strong>Global Citizen of Indonesia (GCI)</strong> program.</p>
                            <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
                                <p><strong>Email Address:</strong> ${email}</p>
                                <p><strong>Source Locale:</strong> ${locale || 'en'}</p>
                                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                            </div>
                            <p>Please check the Intelligence dashboard for more details.</p>
                            <hr />
                            <p style="font-size: 12px; color: #64748b;">This is an automated notification from the GCI Hardened Hub.</p>
                        </div>
                    `
                })
            });

            // Email to Client (Confirmation)
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Indonesian Visas <onboarding@resend.dev>',
                    to: [email],
                    subject: 'Thank You for Your Interest in Global Citizen of Indonesia (GCI)',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #2563eb;">Acknowledgment: GCI Application Interest</h2>
                            <p>Hello,</p>
                            <p>Thank you for expressing interest in the <strong>Global Citizen of Indonesia (GCI)</strong> program. We have received your email <strong>${email}</strong>.</p>
                            <p>Our strategic team is currently reviewing the eligibility criteria for the current quota. You will receive a detailed briefing package if your profile matches the diaspora priorities for the 2026/2027 fiscal year.</p>
                            <br />
                            <p>Best regards,</p>
                            <p><strong>Strategic Intelligence Unit</strong><br />IndonesianVisas.com</p>
                        </div>
                    `
                })
            });
        }

        return NextResponse.json({ success: true, prospectId: prospect.id });

    } catch (error: any) {
        console.error("GCI Submission Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
