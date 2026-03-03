
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

// GET /api/verification?id=... OR ?slug=...
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const slug = searchParams.get('slug');
        const userId = searchParams.get('userId');

        if (id) {
            // SINGLE VERIFICATION BY ID
            const verification = await prisma.verification.findUnique({
                where: { id }
            });
            if (!verification) return NextResponse.json({ error: 'Not found' }, { status: 404 });
            const data = await appendInvoice(verification);
            return NextResponse.json(data);
        }
        else if (userId) {
            // SINGLE VERIFICATION BY USER ID
            const verification = await prisma.verification.findUnique({
                where: { userId }
            });

            // Return null if not found (expected by frontend check)
            if (!verification) return NextResponse.json(null);

            const data = await appendInvoice(verification);
            return NextResponse.json(data);
        }
        else if (slug) {
            // SINGLE VERIFICATION BY SLUG
            const verification = await prisma.verification.findUnique({
                where: { slug }
            });
            if (!verification) return NextResponse.json({ error: 'Not found' }, { status: 404 });
            const data = await appendInvoice(verification);
            return NextResponse.json(data);
        }
        else {
            // ALL VERIFICATIONS (Admin)
            const verifications = await prisma.verification.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json(verifications);
        }
    } catch (error) {
        console.error('Get verification error:', error);
        return NextResponse.json({ error: 'Failed to fetch verification' }, { status: 500 });
    }
}

// HELPER: Fetch Invoice
async function appendInvoice(verification: any) {
    if (!verification || !verification.userId) return verification;

    try {
        // Find latest Paid/Active application
        const app = await prisma.visaApplication.findFirst({
            where: { userId: verification.userId },
            orderBy: { appliedAt: 'desc' },
            select: { id: true, slug: true, status: true }
        });

        if (app) {
            verification.invoice = {
                id: app.id,
                slug: app.slug,
                url: `/invoice/${app.id}`
            };
        }
    } catch (e) {
        console.error("Error fetching invoice for verification", e);
    }
    return verification;
}

// POST /api/verification (Create/Update)
// POST /api/verification (Create/Update)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, userId, fullName, passportNumber, visaType, status } = body;

        // Basic validation
        if (!fullName || !passportNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const now = new Date();
        const issuedDate = body.issuedDate ? new Date(body.issuedDate) : now;
        const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

        if (id) {
            // UPDATE
            // SECTION 5 - VERIFICATION OVERRIDE LOGIC
            await prisma.$executeRawUnsafe(`
                INSERT INTO "ai_business_actions" ("action_type", "target_id", "initiated_by", "override_flag", "status")
                VALUES ('VERIFICATION_OVERRIDE', $1, 'admin_or_master', true, 'EXECUTED')
            `, id);

            console.log("Updating verification:", id, body);
            const updated = await prisma.verification.update({
                where: { id },
                data: {
                    fullName,
                    passportNumber,
                    visaType,
                    status: status || 'Active', // Default to Active/VALID consistency? Schema says VALID. Let's use what is passed.
                    // If frontend sends 'Active', we save 'Active'.
                    issuedDate,
                    expiresAt,
                    updatedAt: now
                }
            });

            return NextResponse.json({ success: true, id: updated.id });
        } else {
            // CREATE
            // Ensure unique slug
            const slug = crypto.randomUUID().substring(0, 8);

            console.log("Creating verification for:", userId);

            const newVerification = await prisma.verification.create({
                data: {
                    userId: userId || null,
                    fullName,
                    passportNumber,
                    visaType,
                    status: status || 'Active',
                    slug,
                    issuedDate,
                    expiresAt
                }
            });

            return NextResponse.json({ success: true, id: newVerification.id, slug: newVerification.slug });
        }

    } catch (error) {
        console.error('Create/Update verification error:', error);
        return NextResponse.json({ error: 'Failed to save verification' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.verification.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete verification error:", error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
