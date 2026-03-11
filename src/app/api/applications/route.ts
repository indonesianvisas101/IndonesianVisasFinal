
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { logAdminAction } from '@/lib/auditLogger';
import { createClient } from '@/utils/supabase/server'; // Use server client
import { sendConfirmationEmail, sendAdminOrderNotification } from '@/lib/email';

// GET /api/applications?userId=... OR ?id=... OR ?slug=... OR (no params for all)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const id = searchParams.get('id');
        const slug = searchParams.get('slug');

        // 1. GET SINGLE INVOICE (Detailed) - By ID OR Slug
        if (id || slug) {
            let whereClause = '';
            let param = '';

            if (id) {
                whereClause = 'WHERE "id" = $1';
                param = id;
            } else {
                whereClause = 'WHERE "slug" = $1';
                param = slug!;
            }

            const apps: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "visa_applications" ${whereClause}`, param);

            if (!apps || apps.length === 0) {
                return NextResponse.json({ error: 'Application not found' }, { status: 404 });
            }
            const app = apps[0];
            const uId = app.userId || app.user_id;

            let userData = null;
            if (uId) {
                userData = await prisma.user.findUnique({ where: { id: uId } }).catch(() => null);
            }

            let verificationData = null;
            if (app.verificationId) {
                // Use Raw SQL to avoid schema mismatch
                const verifResult: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "Verification" WHERE id = $1`, app.verificationId);
                if (verifResult.length > 0) {
                    verificationData = verifResult[0];
                }
            } else if (uId) {
                // Fallback: Check if user has a verification record
                const verifResult: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "Verification" WHERE "userId" = $1::uuid`, uId);
                if (verifResult.length > 0) {
                    verificationData = verifResult[0];
                }
            }

            const response = {
                ...app,
                // Normalized keys
                id: app.id,
                slug: app.slug || app.id, // Fallback
                userId: uId,
                visaId: app.visaId || app.visa_id,
                visaName: app.visaName || app.visa_name,
                guestName: app.guestName,
                guestEmail: app.guestEmail,
                guestAddress: app.guestAddress,
                appliedAt: app.appliedAt || app.applied_at,
                customAmount: app.customAmount,
                status: app.status,

                user: userData || {
                    name: app.guestName,
                    email: app.guestEmail,
                    address: app.guestAddress || "Guest Customer"
                },
                verification: verificationData
            };
            return NextResponse.json(response);
        }

        // 2. GET LIST (User History or Admin All)
        let query = `SELECT * FROM "visa_applications"`;
        let params: any[] = [];

        if (userId) {
            const userMatch = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
            if (userMatch?.email) {
                query += ` WHERE "user_id" = $1::uuid OR "guestEmail" = $2`;
                params.push(userId, userMatch.email);
            } else {
                query += ` WHERE "user_id" = $1::uuid`;
                params.push(userId);
            }
        }

        query += ` ORDER BY "appliedAt" DESC`;

        const applications: any[] = await prisma.$queryRawUnsafe(query, ...params);

        const allUsers = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
        const userMap = new Map(allUsers.map(u => [u.id, u]));

        const appIds = applications.map(a => a.id);
        const invoices = await prisma.invoice.findMany({ where: { applicationId: { in: appIds } } });
        const invoiceMap = new Map(invoices.map(i => [i.applicationId, i]));

        const mappedApps = applications.map(app => {
            const uId = app.userId || app.user_id;
            const linkedUser = uId ? userMap.get(uId) : null;
            const linkedInvoice = invoiceMap.get(app.id);

            return {
                ...app,
                id: app.id,
                slug: app.slug || app.id,
                userId: uId,
                visaId: app.visaId || app.visa_id,
                visaName: app.visaName || app.visa_name,
                appliedAt: app.appliedAt || app.applied_at,
                customAmount: app.customAmount,
                status: app.status,
                paymentReference: linkedInvoice?.paymentReference || "",
                adminNotes: linkedInvoice?.adminNotes || "",
                paymentStatus: linkedInvoice?.status || "",

                user: linkedUser || {
                    name: app.guestName || "Guest",
                    email: app.guestEmail || "-"
                }
            };
        });

        return NextResponse.json(mappedApps);

    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}

// POST /api/applications (Create Invoice/Application)
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user: actor } } = await supabase.auth.getUser(); // Actor (Admin or User)

        const body = await request.json();
        const {
            userId, visaId, visaName, status,
            guestName, guestEmail, guestAddress, paymentMethod, customAmount,
            description, verificationId, appliedAt,
            // New fields
            paymentReference, adminNotes, documents
        } = body;

        // Validation
        if (!visaId) return NextResponse.json({ error: "Visa Product is required" }, { status: 400 });
        if (!userId && !guestName) return NextResponse.json({ error: "Required: User or Guest Name" }, { status: 400 });

        const finalUserId = (userId && userId.trim() !== "") ? userId : undefined;
        const id = crypto.randomUUID();
        const now = appliedAt ? new Date(appliedAt).toISOString() : new Date().toISOString();

        // --- 1. GENERATE SLUG ---
        let namePart = "guest";
        if (finalUserId) {
            const u = await prisma.user.findUnique({ where: { id: finalUserId } });
            if (u && u.name) namePart = u.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        } else if (guestName) {
            namePart = guestName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        }

        let passportPart = crypto.randomBytes(2).toString('hex').toLowerCase();
        if (verificationId) {
            const verif = await prisma.$queryRawUnsafe(`SELECT * FROM "Verification" WHERE id = $1`, verificationId);
            if (verif && (verif as any[]).length > 0) {
                const v = (verif as any[])[0];
                if (v.passportNumber) passportPart = v.passportNumber.slice(-3).toLowerCase();
            }
        }

        const visaPart = visaId === 'custom' ? 'cust' : visaId.slice(0, 4).toLowerCase();
        let slug = `${namePart}-${passportPart}-${visaPart}`;

        const checkSlug = await prisma.$queryRawUnsafe(`SELECT id FROM "visa_applications" WHERE slug = $1`, slug);
        if ((checkSlug as any[]).length > 0) slug = `${slug}-${crypto.randomBytes(1).toString('hex')}`;

        // --- 1.5 AUTO-CREATE VERIFICATION (If not provided) ---
        let finalVerificationId = verificationId;
        if (!finalVerificationId) {
            try {
                const newVerifId = crypto.randomUUID();
                const verifSlug = crypto.randomBytes(4).toString('hex');
                const passportNum = `DUMMY-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

                await prisma.$executeRawUnsafe(`
                    INSERT INTO "Verification" (
                        "id", "userId", "fullName", "passportNumber", "visaType", 
                        "status", "slug", "createdAt", "updatedAt", "issuedDate", "expiresAt"
                    ) VALUES (
                        $1, $2, $3, $4, $5, 
                        $6, $7, $8::timestamptz, $8::timestamptz, $8::timestamptz, NULL
                    )
                `, newVerifId, finalUserId || null, finalUserId ? (await prisma.user.findUnique({ where: { id: finalUserId } }))?.name || guestName : guestName || "Guest", passportNum, visaName || visaId || 'Visa', status === 'Approved' || status === 'Active' ? 'VALID' : 'PENDING', verifSlug, now);

                finalVerificationId = newVerifId;
            } catch (verifErr) { console.error("Failed to auto-create verification:", verifErr); }
        }

        // --- 2. CREATE APPLICATION via Prisma ORM ---
        const result = await prisma.visaApplication.create({
            data: {
                id,
                userId: finalUserId,
                visaId: visaId,
                visaName: visaName,
                status: status || 'Pending',
                guestName,
                guestEmail,
                paymentMethod,
                customAmount: customAmount !== undefined && customAmount !== null ? String(customAmount) : null,
                verificationId: finalVerificationId,
                slug,
                documents: documents || null,
            }
        });

        // --- 3. AUTO-CREATE DOCUMENT (Users Only) ---
        if (finalUserId) {
            // Document
            try {
                const webUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com'}/invoice/${slug}`;
                const docId = crypto.randomUUID();
                await prisma.$executeRawUnsafe(`
                    INSERT INTO "Document" ("id", "userId", "name", "url", "type", "size", "createdAt", "updatedAt")
                    VALUES ($1, $2, $3, $4, $5, $6, $7::timestamptz, $7::timestamptz)
                `, docId, finalUserId, `INVOICE: ${visaName || visaId}`, webUrl, 'application/invoice', 'LINK', now);
            } catch (err) { console.error("Failed to sync invoice document:", err); }
        }

        // --- 4. HARDENED INVOICE (Payment Lifecycle for Everyone) ---
        let createdInvoice = null;
        try {
            const invAmount = customAmount ? parseFloat(customAmount) : 0;
            createdInvoice = await prisma.invoice.create({
                data: {
                    userId: finalUserId || null,
                    applicationId: id,
                    amount: invAmount,
                    status: (status === 'Paid' || status === 'Active') ? 'PAID' : 'UNPAID',
                    paymentMethod: paymentMethod || 'Manual',
                    paymentReference: paymentReference,
                    adminNotes: adminNotes || `Auto-generated from Application ${slug}`,
                    createdAt: now, // Sync with appliedAt 
                    updatedAt: now
                }

            });
        } catch (invErr) { console.error("Failed to create hardened invoice:", invErr); }

        // --- 4.5 REALTIME BROADCAST TO ADMIN ---
        try {
            const supabaseAdmin = createClient(); // Use common client for broadcast
            // We use the same channel name as the admin dashboard listener
            await (await supabaseAdmin).channel('admin_dashboard_global').send({
                type: 'broadcast',
                event: 'NEW_ORDER',
                payload: {
                    id: result.id,
                    guestName: result.guestName,
                    guestEmail: result.guestEmail,
                    visaName: result.visaName,
                    appliedAt: now,
                    slug: slug
                }
            });
        } catch (realtimeErr) { console.error("Admin realtime broadcast failed", realtimeErr); }

        // --- 5. AUDIT LOG ---
        if (actor) {
            // Assume Admin if accessing this route to create
            // If checking role is hard, we log anyway
            await logAdminAction(actor.id, "CREATE_APPLICATION", "Application", id, { slug, status, userId: finalUserId });
        }

        // --- 6. SEND CONFIRMATION EMAIL ---
        if (guestEmail || finalUserId) {
            const recipientEmail = guestEmail || (await prisma.user.findUnique({ where: { id: finalUserId } }))?.email;
            if (recipientEmail) {
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
                const invoiceUrl = `${appUrl}/invoice/${slug}`;
                
                await sendConfirmationEmail(recipientEmail, {
                    applicantName: guestName || (await prisma.user.findUnique({ where: { id: finalUserId! } }))?.name || 'Applicant',
                    visaType: visaName || visaId,
                    invoiceUrl: invoiceUrl,
                    isPayPal: paymentMethod?.toLowerCase().includes('paypal')
                });
            }
        }

        // --- 7. SEND ADMIN NOTIFICATION ---
        try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
            await sendAdminOrderNotification({
                orderType: "Visa Application / Invoice",
                applicantName: guestName || "System User",
                applicantEmail: guestEmail || "-",
                visaType: visaName || visaId,
                amount: customAmount ? `${customAmount}` : "Standard Rate",
                invoiceUrl: `${appUrl}/invoice/${slug}`,
                details: body.adminNotes || "No additional notes."
            });
        } catch (e) { console.error("Admin notification failed", e); }

        return NextResponse.json({
            application: result,
            invoice: createdInvoice
        });

    } catch (error: any) {
        console.error("Create application error:", error);
        return NextResponse.json({ error: error.message || "Failed to create" }, { status: 500 });
    }
}

// PATCH /api/applications (Update Application/Invoice)
export async function PATCH(request: Request) {
    try {
        const supabase = await createClient();
        let actor = null;

        // 1. Try cookie-based session first
        try {
            const { data: { user } } = await supabase.auth.getUser();
            actor = user;
        } catch { /* ignored */ }

        // 2. Fallback: read Bearer token from Authorization header
        if (!actor) {
            const authHeader = request.headers.get('authorization');
            const token = authHeader?.replace('Bearer ', '').trim();
            if (token) {
                try {
                    const { createClient: createBrowserClient } = await import('@supabase/supabase-js');
                    const anonClient = createBrowserClient(
                        process.env.NEXT_PUBLIC_SUPABASE_URL!,
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                    );
                    const { data: { user } } = await anonClient.auth.getUser(token);
                    actor = user;
                } catch { /* ignored */ }
            }
        }

        // Simple Admin Check (Optional: enforce role)
        if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { id, status, paymentReference, adminNotes, paymentStatus } = body;

        if (!id) return NextResponse.json({ error: "ID Required" }, { status: 400 });

        // 1. Update Application Status
        if (status) {
            await prisma.$executeRawUnsafe(`UPDATE "visa_applications" SET "status" = $1 WHERE "id" = $2::uuid`, status, id);
        }

        // 2. Update Linked Invoice (if exists)
        if (paymentStatus !== undefined || paymentReference !== undefined || adminNotes !== undefined) {
            // Find invoice
            const invoice = await prisma.invoice.findFirst({ where: { applicationId: id } });
            if (invoice) {
                const dataToUpdate: any = {};
                if (paymentStatus !== undefined) dataToUpdate.status = paymentStatus; // UNPAID, PAID, REFUNDED
                if (paymentReference !== undefined) dataToUpdate.paymentReference = paymentReference;
                if (adminNotes !== undefined) dataToUpdate.adminNotes = adminNotes;

                await prisma.invoice.update({
                    where: { id: invoice.id },
                    data: dataToUpdate
                });
            }
        }

        // 3. Audit Log
        await logAdminAction(
            actor.id,
            "UPDATE_APPLICATION",
            "Application",
            id,
            { status, paymentStatus, paymentReference, adminNotes }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user: actor } } = await supabase.auth.getUser();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await prisma.$queryRawUnsafe(`DELETE FROM "visa_applications" WHERE "id" = $1::uuid`, id);

        // Also delete hardened invoice if calls cascade doesn't work (Prisma relation usually handles it if formatted right, but Raw SQL might not)
        await prisma.invoice.deleteMany({ where: { applicationId: id } });

        // Audit Log
        await logAdminAction(actor.id, "DELETE_APPLICATION", "Application", id, {});

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
