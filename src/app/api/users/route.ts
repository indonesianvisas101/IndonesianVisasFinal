import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { getAdminAuth } from '@/lib/auth-helpers';

export async function GET() {
    try {
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        // Use Raw SQL to safely fetch users without crashing on relation mismatches
        // TABLE NAME FIX: "users" (lowercase plural) is the actual table name based on DB inspection
        const users: any[] = await prisma.$queryRawUnsafe(`
            SELECT 
                u.*,
                (
                    SELECT json_build_object(
                        'visaName', va."visaName", 
                        'expiresAt', va."expiresAt",
                        'updatedAt', va."updatedAt"
                    )
                    FROM "visa_applications" va 
                    WHERE va."user_id" = u.id
                    ORDER BY va."updatedAt" DESC 
                    LIMIT 1
                ) as latest_app,
                (
                    SELECT json_agg(va.*)
                    FROM "visa_applications" va 
                    WHERE va."user_id" = u.id
                ) as applications,
                (
                    SELECT json_agg(v.*)
                    FROM "Verification" v
                    WHERE v."userId" = u.id
                ) as verification,
                (
                    SELECT json_agg(d.*)
                    FROM "Document" d
                    WHERE d."userId" = u.id
                ) as documents
            FROM "users" u
            ORDER BY u.created_at DESC
        `);

        // Normalizing data structure for frontend
        const formattedUsers = users.map(user => {
            const latestApp = user.latest_app;
            const apps = user.applications || [];
            const docs = user.documents || [];
            const verif = user.verification ? user.verification[0] : null;

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status || 'Active', // Default if missing
                avatar: user.avatar,
                visa: latestApp ? (latestApp.visaName || 'None') : 'None',
                expires: latestApp && latestApp.expiresAt ? new Date(latestApp.expiresAt).toLocaleDateString() : 'N/A',
                createdAt: user.created_at || user.createdAt,
                verified: !!verif,
                applications: apps,
                documents: docs,
            };
        });

        return NextResponse.json(formattedUsers);
    } catch (error: any) {
        return NextResponse.json({
            error: 'Failed to fetch users',
            details: error?.message || 'Unknown error',
            stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
        }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const body = await request.json();
        const { id, status, visa, expires } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
        }

        // Update User Status - Table "users"
        await prisma.$executeRawUnsafe(`UPDATE "users" SET "status" = $1 WHERE "id" = $2::uuid`, status, id);

        // Create Visa History Record if visa is set
        if (visa && visa !== 'None') {
            let expiresDate: Date | undefined = undefined;
            if (expires && expires !== 'N/A') {
                const parsed = new Date(expires);
                if (!isNaN(parsed.getTime())) {
                    expiresDate = parsed;
                }
            }

            const appId = crypto.randomUUID();
            const now = new Date().toISOString();
            const expiresISO = expiresDate ? expiresDate.toISOString() : null;

            // Raw Insert
            await prisma.$executeRawUnsafe(
                `INSERT INTO "visa_applications" ("id", "user_id", "userId", "visaId", "visa_id", "visaName", "status", "appliedAt", "expiresAt", "updatedAt") 
                 VALUES ($1::uuid, $2::uuid, $2::uuid, $3, $3, $4, $5, $6::timestamptz, $7::timestamptz, $8::timestamptz)`,
                appId, id, 'admin-manual', visa, 'Active', now, expiresISO, now
            );

            // Auto-Generate Invoice Document (Optional)
            try {
                const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com'}/invoice/${appId}`;
                const docId = crypto.randomUUID();
                await prisma.$executeRawUnsafe(
                    `INSERT INTO "Document" ("id", "userId", "name", "url", "type", "size", "createdAt", "updatedAt")
                     VALUES ($1, $2, $3, $4, $5, $6, $7::timestamptz, $7::timestamptz)`,
                    docId, id, `INVOICE: ${visa}`, invoiceUrl, 'application/invoice', 'PDF', now
                );
            } catch (invErr) {
                console.error("Failed to auto-create invoice doc", invErr);
            }
        }

        // Fetch updated user to return
        const updatedUser = await prisma.$queryRawUnsafe(`SELECT * FROM "users" WHERE id = $1::uuid`, id);
        return NextResponse.json((updatedUser as any[])[0]);

    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: 'Failed to update user', details: String(error) }, { status: 500 });
    }
}
