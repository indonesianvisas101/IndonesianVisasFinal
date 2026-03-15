
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Simple in-memory rate limiting (Production should use Redis/KV)
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 lookups per minute per IP

function isRateLimited(ip: string) {
    const now = Date.now();
    const rate = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    
    if (now - rate.lastReset > RATE_LIMIT_WINDOW) {
        rate.count = 1;
        rate.lastReset = now;
        rateLimitMap.set(ip, rate);
        return false;
    }
    
    if (rate.count >= MAX_REQUESTS) return true;
    
    rate.count++;
    rateLimitMap.set(ip, rate);
    return false;
}

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    
    if (isRateLimited(ip)) {
        return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }

    try {
        const body = await req.json();
        const { order_id, invoice_number, email, passport_number } = body;

        if (!order_id && !invoice_number && (!email || !passport_number)) {
            return NextResponse.json({ error: "Insufficient search parameters provided." }, { status: 400 });
        }

        let application: any = null;

        // 1. Search by Order ID (ID or Slug)
        if (order_id) {
            application = await prisma.visaApplication.findFirst({
                where: { OR: [{ id: order_id }, { slug: order_id }] },
                include: { user: { select: { name: true } } }
            });
        }

        // 2. Search by Invoice Number (INV-XXXXXX)
        if (!application && invoice_number) {
            const shortId = invoice_number.replace('INV-', '').toLowerCase();
            const invoices = await (prisma.invoice as any).findMany({
                where: { id: { endsWith: shortId } },
                include: { visaApplication: { include: { user: { select: { name: true } } } } }
            });
            if (invoices.length > 0) {
                application = invoices[0].visaApplication;
            }
        }

        // 3. Search by Email + Passport
        if (!application && email && passport_number) {
            // Check Verification model first (Official source)
            const verification = await prisma.verification.findFirst({
                where: { 
                    passportNumber: { contains: passport_number, mode: 'insensitive' },
                    user: { email: { equals: email, mode: 'insensitive' } }
                }
            });

            if (verification && verification.userId) {
                application = await prisma.visaApplication.findFirst({
                    where: { userId: verification.userId },
                    orderBy: { appliedAt: 'desc' }
                });
            }

            // Fallback: Check guest fields
            if (!application) {
                application = await prisma.visaApplication.findFirst({
                    where: { 
                        guestEmail: { equals: email, mode: 'insensitive' },
                        status: { not: 'Deleted' }
                    },
                    orderBy: { appliedAt: 'desc' }
                });
                // Note: We can't easily verify passport without documents join if not in verification table
                // But we'll trust the email match for guest status lookup if needed.
            }
        }

        if (!application) {
            return NextResponse.json({ error: "Order not found. Please verify your details." }, { status: 404 });
        }

        // Fetch associated Invoice for financial status
        const invoice = await prisma.invoice.findFirst({
            where: { applicationId: application.id }
        });

        // PRIVACY FILTER: Remove sensitive data
        const publicStatus = {
            order_id: application.id.slice(-8).toUpperCase(),
            visa_name: application.visaName,
            applicant_first_name: (application.guestName || application.user?.name || "").split(' ')[0],
            application_status: application.status,
            invoice_status: invoice?.status || "PENDING",
            payment_method: invoice?.paymentMethod || "MANUAL",
            last_update: application.updatedAt,
            applied_at: application.appliedAt
        };

        return NextResponse.json(publicStatus);

    } catch (error: any) {
        console.error("Status Search Error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
