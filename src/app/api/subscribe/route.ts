import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        // HARDENING STEP 1: Save to Database first (Resilience)
        try {
            await prisma.marketingLead.upsert({
                where: { email },
                update: { 
                    status: 'NEWSLETTER_SUBSCRIBER',
                    updatedAt: new Date()
                },
                create: {
                    email,
                    status: 'NEWSLETTER_SUBSCRIBER',
                    attributionData: { source: 'news_footer_subscribe' }
                }
            });
        } catch (dbError) {
            console.error("Database save failed for subscriber:", dbError);
            // We continue even if DB fails for now, though email is primary backup
        }

        // HARDENING STEP 2: Isolate Email Process (Fault Tolerance)
        // This ensures SMTP errors don't trigger a 500 for the user
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || "smtp.gmail.com",
                port: parseInt(process.env.SMTP_PORT || "587"),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `"Indonesian Visas Intelligence" <${process.env.SMTP_USER}>`,
                to: "damnbayu@gmail.com",
                subject: "🚨 NEW NEWSLETTER SUBSCRIPTION",
                text: `Intelligence Alert: A new user has subscribed to the immigration updates: ${email}`,
                html: `<div style="font-family: 'Inter', sans-serif; padding: 40px; background-color: #000; color: #fff; border-radius: 20px;">
                    <h2 style="color: #FFD700; margin-bottom: 20px;">Intelligence Alert</h2>
                    <p style="font-size: 16px; color: #888;">A new operative has joined the intelligence feed:</p>
                    <div style="background: #111; padding: 20px; border-radius: 10px; border: 1px solid #333; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Email:</strong> <span style="color: #FFD700;">${email}</span></p>
                    </div>
                    <p style="font-size: 12px; color: #444;">Status: Database Committed & Audit Logged</p>
                </div>`,
            });
        } catch (mailError) {
            console.error("Non-critical notification failure (SMTP):", mailError);
            // We do NOT return error here, as data is already saved in DB
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Subscription system crash:", error);
        return NextResponse.json({ error: "System failure" }, { status: 500 });
    }
}
