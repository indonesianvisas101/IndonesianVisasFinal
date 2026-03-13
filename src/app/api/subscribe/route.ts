import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        // Mock subscription logic - in a real app, you'd save to DB or Mailchimp
        // Here we send an email to the default admin as requested
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
            from: `"Visa Updates" <${process.env.SMTP_USER}>`,
            to: "damnbayu@gmail.com",
            subject: "New Newsletter Subscription",
            text: `A new user has subscribed to the immigration updates: ${email}`,
            html: `<div style="font-family: sans-serif; padding: 20px;">
                <h2 style="color: #0066FF;">New Newsletter Subscription</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p>Date: ${new Date().toLocaleString()}</p>
            </div>`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Subscription error:", error);
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }
}
