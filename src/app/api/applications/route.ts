
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { logAdminAction } from '@/lib/auditLogger';
import { createClient } from '@/utils/supabase/server'; // Use server client
import { sendConfirmationEmail, sendAdminOrderNotification } from '@/lib/email';
import { calculateOrderFees } from '@/utils/feeCalculator';
import { getAdminAuth } from '@/lib/auth-helpers';

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
                whereClause = 'WHERE a."id" = $1';
                param = id;
            } else {
                whereClause = 'WHERE a."slug" = $1';
                param = slug!;
            }

            // Fetch with Invoice joined to ensure latest Admin Edits are visible
            const rawApps = await prisma.$queryRawUnsafe(`
                SELECT a.*, i.status as "paymentStatus", i.amount as "invoiceAmount", i."paymentReference", i."adminNotes", i.quantity as "invoiceQuantity",
                       i."serviceFee", i."gatewayFee", i."pph23Amount"
                FROM "visa_applications" a
                LEFT JOIN "invoices" i ON a.id = i."applicationId"
                ${whereClause}
            `, param) as any[];

            if (!rawApps || rawApps.length === 0) {
                console.error(`Application not found for ${id ? 'id' : 'slug'}: ${param}`);
                return NextResponse.json({ error: 'Invoice or Application not found' }, { status: 404 });
            }
            const app = rawApps[0];
            const uId = app.userId || app.user_id;

            let userData = null;
            if (uId) {
                userData = await prisma.user.findUnique({ where: { id: uId } }).catch(() => null);
            }

            let verificationData = null;
            if (app.verificationId) {
                const verifResult: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "Verification" WHERE id = $1`, app.verificationId);
                if (verifResult.length > 0) {
                    verificationData = verifResult[0];
                }
            } else if (uId) {
                const verifResult: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "Verification" WHERE "userId" = $1::uuid`, uId);
                if (verifResult.length > 0) {
                    verificationData = verifResult[0];
                }
            }

            const response = JSON.parse(JSON.stringify({
                ...app,
                // Normalized keys
                id: app.id,
                slug: app.slug || app.id,
                userId: uId,
                visaId: app.visaId || app.visa_id,
                visaName: app.visaName || app.visa_name,
                guestName: app.guestName,
                guestEmail: app.guestEmail,
                guestAddress: app.guestAddress,
                appliedAt: app.appliedAt || app.applied_at,
                customAmount: app.customAmount,
                status: app.status,
                quantity: app.quantity || 1,

                // Injected Invoice Data (for real-time sync)
                invoice: {
                    status: app.paymentStatus,
                    amount: app.invoiceAmount,
                    paymentReference: app.paymentReference,
                    adminNotes: app.adminNotes,
                    quantity: app.invoiceQuantity || app.quantity || 1,
                    serviceFee: app.serviceFee,
                    gatewayFee: app.gatewayFee,
                    pph23Amount: app.pph23Amount
                },

                user: userData || {
                    name: app.guestName,
                    email: app.guestEmail,
                    address: app.guestAddress || "Guest Customer"
                },
                verification: verificationData
            }));
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

                invoice: linkedInvoice ? {
                    status: linkedInvoice.status,
                    amount: Number(linkedInvoice.amount || 0),
                    serviceFee: Number(linkedInvoice.serviceFee || 0),
                    gatewayFee: Number(linkedInvoice.gatewayFee || 0),
                    pph23Amount: Number(linkedInvoice.pph23Amount || 0),
                    paymentReference: linkedInvoice.paymentReference,
                    adminNotes: linkedInvoice.adminNotes,
                    quantity: linkedInvoice.quantity || app.quantity || 1
                } : null,

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

import { ApplicationSchema, MultiApplicationSchema } from '@/types/schemas';

// POST /api/applications (Create Invoice/Application)
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user: actor } } = await supabase.auth.getUser();

        const rawBody = await request.json();
        
        // Check if it's a multi-application request
        const isMulti = Array.isArray(rawBody.applications);
        const appsToProcess = isMulti 
            ? MultiApplicationSchema.parse(rawBody).applications 
            : [ApplicationSchema.parse(rawBody)];

        const results = await prisma.$transaction(async (tx) => {
            const createdData = [];

            for (const body of appsToProcess) {
                const {
                    userId, visaId, visaName, status,
                    guestName, guestEmail, guestAddress, paymentMethod, customAmount,
                    verificationId, appliedAt, visaAmount, addonsAmount,
                    paymentReference, adminNotes, documents, attribution, quantity, upsells
                } = body;

                const finalUserId = (userId && userId.trim() !== "") ? userId : undefined;
                const id = crypto.randomUUID();
                const now = appliedAt ? new Date(appliedAt).toISOString() : new Date().toISOString();

                // --- 1. GENERATE SLUG ---
                let namePart = "guest";
                if (finalUserId) {
                    const u = await tx.user.findUnique({ where: { id: finalUserId } });
                    if (u && u.name) namePart = u.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                } else if (guestName) {
                    namePart = guestName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                }

                let passportPart = crypto.randomBytes(2).toString('hex').toLowerCase();
                if (verificationId) {
                    const verif = await tx.$queryRawUnsafe(`SELECT * FROM "Verification" WHERE id = $1`, verificationId) as any[];
                    if (verif && verif.length > 0) {
                        passportPart = verif[0].passportNumber?.slice(-3).toLowerCase() || passportPart;
                    }
                }

                const visaPart = visaId === 'custom' ? 'cust' : visaId.slice(0, 4).toLowerCase();
                let slug = `${namePart}-${passportPart}-${visaPart}`;

                const checkSlug = await tx.$queryRawUnsafe(`SELECT id FROM "visa_applications" WHERE slug = $1`, slug) as any[];
                if (checkSlug.length > 0) slug = `${slug}-${crypto.randomBytes(1).toString('hex')}`;

                // --- 1.5 AUTO-CREATE VERIFICATION (If not provided) ---
                let finalVerificationId = verificationId;
                if (!finalVerificationId) {
                    const newVerifId = crypto.randomUUID();
                    const verifSlug = crypto.randomBytes(4).toString('hex');
                    const passportNum = `DUMMY-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
                    const guestNameFinal = guestName || (finalUserId ? (await tx.user.findUnique({ where: { id: finalUserId } }))?.name : null) || "Guest";

                    await tx.$executeRawUnsafe(`
                        INSERT INTO "Verification" (
                            "id", "userId", "fullName", "passportNumber", "visaType", 
                            "status", "slug", "createdAt", "updatedAt", "issuedDate", "expiresAt"
                        ) VALUES (
                            $1, $2, $3, $4, $5, 
                            $6, $7, $8::timestamptz, $8::timestamptz, $8::timestamptz, NULL
                        )
                    `, newVerifId, finalUserId || null, guestNameFinal, passportNum, visaName || visaId || 'Visa', status === 'Approved' || status === 'Active' ? 'VALID' : 'PENDING', verifSlug, now);

                    finalVerificationId = newVerifId;
                }

                // --- 2. CREATE APPLICATION ---
                const application = await (tx.visaApplication as any).create({
                    data: {
                        id,
                        userId: finalUserId,
                        visaId,
                        visaName,
                        status: status || 'Apply to Agent',
                        guestName,
                        guestEmail,
                        paymentMethod,
                        customAmount: customAmount ? String(customAmount) : null,
                        verificationId: finalVerificationId,
                        slug,
                        documents: documents || null,
                        attribution: attribution ? { ...attribution, upsells: upsells || {} } : { upsells: upsells || {} },
                        quantity: quantity || 1,
                    }
                });

                // --- 3. AUTO-CREATE DOCUMENT (Users Only) ---
                if (finalUserId) {
                    const webUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com'}/invoice/${slug}`;
                    const docId = crypto.randomUUID();
                    await tx.$executeRawUnsafe(`
                        INSERT INTO "Document" ("id", "userId", "name", "url", "type", "size", "createdAt", "updatedAt")
                        VALUES ($1, $2, $3, $4, $5, $6, $7::timestamptz, $7::timestamptz)
                    `, docId, finalUserId, `INVOICE: ${visaName || visaId}`, webUrl, 'application/invoice', 'LINK', now);
                }

                // --- 4. HARDENED INVOICE ---
                const baseServiceAmount = customAmount ? parseFloat(String(customAmount).replace(/\./g, '').replace(/[^0-9.-]+/g, '')) : 0;
                const visaAmt = visaAmount ? parseFloat(String(visaAmount).replace(/\./g, '').replace(/[^0-9.-]+/g, '')) : baseServiceAmount;
                const addonsAmt = addonsAmount ? parseFloat(String(addonsAmount).replace(/\./g, '').replace(/[^0-9.-]+/g, '')) : 0;
                
                const { serviceFee, gatewayFee, pph23Amount, totalAmount } = calculateOrderFees(visaAmt, paymentMethod || 'Manual', addonsAmt);

                const invoice = await (tx.invoice as any).create({
                    data: {
                        id: slug,
                        userId: finalUserId || null,
                        applicationId: id,
                        amount: totalAmount,
                        serviceFee,
                        gatewayFee,
                        pph23Amount,
                        currency: "IDR",
                        status: (status === 'Paid' || status === 'Active') ? 'PAID' : 'UNPAID',
                        paymentMethod: paymentMethod || 'Manual',
                        paymentReference,
                        adminNotes: adminNotes || `Auto-generated from Application ${slug}`,
                        quantity: quantity || 1,
                        createdAt: now,
                        updatedAt: now
                    }
                });

                createdData.push({ application, invoice, slug, actor });
            }
            return createdData;
        });

        // --- SIDE EFFECTS (Post-Transaction) ---
        for (const data of results) {
            const { application, invoice, slug, actor } = data;
            
            // 4.5 REALTIME BROADCAST
            try {
                const supabaseAdmin = await createClient();
                await supabaseAdmin.channel('admin_dashboard_global').send({
                    type: 'broadcast',
                    event: 'NEW_ORDER',
                    payload: {
                        id: application.id,
                        guestName: application.guestName,
                        guestEmail: application.guestEmail,
                        visaName: application.visaName,
                        appliedAt: application.appliedAt,
                        slug
                    }
                });
            } catch (realtimeErr) { console.error("Broadcast failed", realtimeErr); }

            // 5. AUDIT LOG
            if (actor) {
                await logAdminAction(actor.id, "CREATE_APPLICATION", "Application", application.id, { slug, status: application.status, userId: application.userId });
            }

            // 6. EMAILS
            const recipientEmail = application.guestEmail || (application.userId ? (await prisma.user.findUnique({ where: { id: application.userId } }))?.email : null);
            if (recipientEmail) {
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
                await sendConfirmationEmail(recipientEmail, {
                    applicantName: application.guestName || 'Applicant',
                    visaType: application.visaName || application.visaId,
                    invoiceUrl: `${appUrl}/invoice/${slug}`,
                    orderId: slug,
                    isPayPal: application.paymentMethod?.toLowerCase().includes('paypal')
                });
            }

            // 7. NOTIFICATIONS
            if (application.userId) {
                try {
                    await prisma.notification.create({
                        data: {
                            id: crypto.randomUUID(),
                            userId: application.userId,
                            title: "Application Received",
                            message: `We received your application for ${application.visaName}.`,
                            type: "info",
                            actionLink: `/invoice/${slug}`,
                            actionText: "View Invoice"
                        }
                    });
                } catch (err) { console.error("Notification failed", err); }
            }

            // ADMIN EMAIL
            try {
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
                await sendAdminOrderNotification({
                    orderType: "Visa Application / Invoice",
                    applicantName: application.guestName || "System User",
                    applicantEmail: application.guestEmail || "-",
                    visaType: application.visaName || application.visaId,
                    amount: application.customAmount || "Standard Rate",
                    invoiceUrl: `${appUrl}/invoice/${slug}`,
                    details: application.adminNotes || "No additional notes."
                });
            } catch (e) { console.error("Admin notification failed", e); }
        }

        return NextResponse.json(isMulti ? { results } : results[0]);

    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: "Validation Failed", details: error.errors }, { status: 400 });
        }
        console.error("Create application error:", error);
        return NextResponse.json({ error: error.message || "Failed to create" }, { status: 500 });
    }
}

// PATCH /api/applications (Update Application/Invoice)
export async function PATCH(request: Request) {
    try {
        const { authorized, error, status } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const body = await request.json();
        const { 
            id: targetId, status: newStatus, paymentReference, adminNotes, 
            paymentMethod, paymentStatus, guestName, guestEmail, 
            visaName, customAmount, userId, quantity, 
            attribution // FIX: Support attribution edits from frontend
        } = body;

        if (!targetId) return NextResponse.json({ error: "ID Required" }, { status: 400 });

        // 1. Update Application Core Info
        const appUpdateData: any = {};
        if (newStatus !== undefined) appUpdateData.status = newStatus;
        if (guestName !== undefined) appUpdateData.guestName = guestName;
        if (guestEmail !== undefined) appUpdateData.guestEmail = guestEmail;
        if (visaName !== undefined) appUpdateData.visaName = visaName;
        if (customAmount !== undefined) appUpdateData.customAmount = String(customAmount).replace(/\./g, '').replace(/[^0-9.-]+/g, '');
        if (userId !== undefined) appUpdateData.userId = userId ? userId : null;
        if (quantity !== undefined) appUpdateData.quantity = parseInt(String(quantity)) || 1;
        if (attribution !== undefined) appUpdateData.attribution = attribution; // FIX: Update attribution

        if (Object.keys(appUpdateData).length > 0) {
            await prisma.visaApplication.update({
                where: { id: targetId },
                data: appUpdateData
            });
        }

        // 2. Update Linked Invoice (if exists)
        if (paymentStatus !== undefined || paymentReference !== undefined || adminNotes !== undefined || customAmount !== undefined || paymentMethod !== undefined) {
            // Find invoice
            const invoice = await prisma.invoice.findFirst({ where: { applicationId: targetId } });
            if (invoice) {
                const dataToUpdate: any = {};
                if (paymentStatus !== undefined) dataToUpdate.status = paymentStatus;
                if (paymentReference !== undefined) dataToUpdate.paymentReference = paymentReference;
                if (adminNotes !== undefined) dataToUpdate.adminNotes = adminNotes;
                
                // Recalculate fees if amount or method changes
                const methodToUse = paymentMethod || invoice.paymentMethod || 'Manual';
                let amountToUse = customAmount !== undefined 
                    ? parseFloat(String(customAmount).replace(/\./g, '').replace(/[^0-9.-]+/g, '')) 
                    : Number((invoice as any).serviceFee || invoice.amount);
                
                if (isNaN(amountToUse)) {
                    amountToUse = Number((invoice as any).serviceFee || invoice.amount);
                }
                
                // BACKWARDS RECONSTRUCTION FOR ADD-ONS (Fixes dropping addonsAmt on update)
                const prevPph23 = Number(invoice.pph23Amount || 0);
                const prevServiceFee = Number((invoice as any).serviceFee || invoice.amount || 0);
                
                let visaAmount = prevPph23 * 50; 
                let addonsAmount = prevServiceFee - visaAmount;

                if (addonsAmount < 0) addonsAmount = 0; // Guard

                if (customAmount !== undefined) {
                    visaAmount = amountToUse; 
                    addonsAmount = 0;
                }

                const { serviceFee, gatewayFee, pph23Amount, totalAmount } = calculateOrderFees(visaAmount, methodToUse, addonsAmount);
                
                dataToUpdate.amount = totalAmount;
                dataToUpdate.serviceFee = serviceFee;
                dataToUpdate.gatewayFee = gatewayFee;
                dataToUpdate.pph23Amount = pph23Amount;
                if (paymentMethod !== undefined) dataToUpdate.paymentMethod = paymentMethod;
                if (quantity !== undefined) dataToUpdate.quantity = parseInt(String(quantity)) || 1;

                await prisma.invoice.update({
                    where: { id: invoice.id },
                    data: dataToUpdate
                });
            }
        }

        // 3. Audit Log
        const authData = await getAdminAuth();
        if (authData.dbUser) {
            await logAdminAction(
                authData.dbUser.id,
                "UPDATE_APPLICATION",
                "Application",
                targetId,
                { ...appUpdateData, paymentStatus, paymentReference, adminNotes }
            );
        }

        // 4. Send User In-App Notification if Status or PaymentStatus changed
        if (newStatus || paymentStatus) {
            try {
                // Find user associated with this application
                const appRow: any[] = await prisma.$queryRawUnsafe(`SELECT "user_id", "visaName", "slug" FROM "visa_applications" WHERE id = $1`, targetId);
                if (appRow.length > 0 && appRow[0].user_id) {
                    const uId = appRow[0].user_id;
                    const vName = appRow[0].visaName || "Visa";
                    const slug = appRow[0].slug;
                    
                    let notifTitle = "Application Updated";
                    let notifMsg = `Your application for ${vName} has been updated.`;
                    
                    if (newStatus) {
                        notifTitle = `Visa Status: ${newStatus}`;
                        notifMsg = `Your visa application status is now ${newStatus}.`;
                    } else if (paymentStatus) {
                        notifTitle = `Payment Status: ${paymentStatus}`;
                        notifMsg = `Your invoice payment status is now ${paymentStatus}.`;
                    }
                    
                    await prisma.$executeRawUnsafe(`
                        INSERT INTO "Notification" ("id", "userId", "title", "message", "type", "actionLink", "actionText", "createdAt")
                        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                    `, crypto.randomUUID(), uId, notifTitle, notifMsg, "success", `/invoice/${slug}`, "View Details");
                }
            } catch (e) {
                console.error("Failed to send update notification", e);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { authorized, error, status, dbUser } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.$queryRawUnsafe(`DELETE FROM "visa_applications" WHERE "id" = $1`, id);

        // Also delete hardened invoice if calls cascade doesn't work (Prisma relation usually handles it if formatted right, but Raw SQL might not)
        await prisma.invoice.deleteMany({ where: { applicationId: id } });

        // Audit Log
        if (dbUser) {
            await logAdminAction(dbUser.id, "DELETE_APPLICATION", "Application", id, {});
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
