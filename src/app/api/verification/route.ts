import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { getAdminAuth } from '@/lib/auth-helpers';
import { getSignedUrl } from '@/lib/storage';
import { logAdminAction } from '@/lib/auditLogger';
import { generateIDNumber } from '@/utils/idNumberGenerator';

function cleanContaminatedPhotoUrl(url: any): string | null {
    if (!url) return null;
    let clean = url;
    
    // If it's an array, take the first element
    if (Array.isArray(clean)) {
        clean = clean[0];
    } else if (typeof clean === 'string' && clean.startsWith('[') && clean.endsWith(']')) {
        // In case it was stringified array in DB
        try {
            const parsed = JSON.parse(clean);
            if (Array.isArray(parsed)) {
                clean = parsed[0];
            }
        } catch {}
    }

    if (typeof clean !== 'string') return null;

    if (clean.startsWith('http') && clean.includes('supabase.co')) {
        try {
            const urlObj = new URL(clean);
            const parts = urlObj.pathname.split('/object/public/')?.[1] || urlObj.pathname.split('/object/sign/')?.[1];
            if (parts) {
                clean = parts;
            }
        } catch {}
    }

    // Auto-heal missing "verifications/" folder prefix for documents bucket
    if (clean.startsWith('documents/') && !clean.includes('documents/verifications/')) {
        const remaining = clean.substring('documents/'.length);
        if (!remaining.includes('/')) {
            clean = `documents/verifications/${remaining}`;
        }
    }

    return clean;
}

// GET /api/verification?id=... OR ?slug=...
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const slug = searchParams.get('slug');
        const userId = searchParams.get('userId');
        const query = searchParams.get('query');

        const auth = await getAdminAuth();
        const isAdmin = auth.authorized;

        // Only enforce admin check if NO identifying param is provided (i.e. requesting full list)
        if (!id && !slug && !userId && !query) {
            if (!isAdmin) {
                return NextResponse.json({ error: auth.error }, { status: auth.status });
            }
        }

        let verification = null;

        if (query) {
            // SEARCH BY QUERY (ID, Slug, or Passport) - Case Insensitive
            verification = await (prisma.verification as any).findFirst({
                where: {
                    OR: [
                        { id: { equals: query, mode: 'insensitive' } },
                        { slug: { equals: query, mode: 'insensitive' } },
                        { passportNumber: { equals: query, mode: 'insensitive' } }
                    ]
                },
                include: { user: true }
            });

            // v12.2 - Support searchable 16-digit ID number (formatted or clean)
            if (!verification) {
                const cleanQuery = query.replace(/\D/g, ""); // Keep only digits
                if (cleanQuery.length === 16) {
                    // Fetch all verifications to resolve their deterministic ID numbers
                    const allVerifications = await (prisma.verification as any).findMany({
                        include: { user: true }
                    });

                    const matched = allVerifications.find((v: any) => {
                        let birthPlaceDate = "";
                        if (v.address && v.address.trim().startsWith('{')) {
                            try {
                                const parsed = JSON.parse(v.address);
                                birthPlaceDate = parsed.birthPlaceDate || parsed.BIRTHPLACEDATE || parsed.dob || parsed.DOB || "";
                            } catch {}
                        }

                        const generated = generateIDNumber(
                            v.nationality || "Unknown",
                            v.issuedDate ? new Date(v.issuedDate).toISOString() : "",
                            birthPlaceDate,
                            undefined,
                            "01",
                            (v.slug || v.id) + (v.fullName || "")
                        );

                        return generated === cleanQuery;
                    });

                    if (matched) {
                        verification = matched;
                    }
                }
            }
        }
        else if (id) {
            verification = await (prisma.verification as any).findUnique({ 
                where: { id },
                include: { user: true }
            });
        }
        else if (slug) {
            verification = await (prisma.verification as any).findFirst({ 
                where: {
                    OR: [
                        { slug: slug },
                        { id: slug }
                    ]
                },
                include: { user: true }
            });
        }
        else if (userId) {
            verification = await (prisma.verification as any).findUnique({ 
                where: { userId },
                include: { user: true }
            });
            if (!verification) return NextResponse.json(null);
        }
        else {
            // ALL VERIFICATIONS (Admin)
            const verificationsRaw = await (prisma.verification as any).findMany({
                orderBy: { createdAt: 'desc' }
            });
            
            // Harden Photo URLs & Unpack premium fields
            const verifications = await Promise.all(verificationsRaw.map(async (v: any) => {
                // v11.0.1 - AUTO FALLBACK FOR LIST VIEW
                if (!v.photoUrl && v.userId) {
                    try {
                        const latestApp = await prisma.visaApplication.findFirst({
                            where: { userId: v.userId },
                            orderBy: { appliedAt: 'desc' },
                            select: { documents: true }
                        });
                        const fallbackPhoto = (latestApp?.documents as any)?.recentPhoto || (latestApp?.documents as any)?.photo;
                        if (fallbackPhoto) v.photoUrl = fallbackPhoto;
                    } catch (e) {}
                }

                if (v.photoUrl) {
                    const rawPhoto = cleanContaminatedPhotoUrl(v.photoUrl);
                    if (rawPhoto) {
                        v.photoUrl = await getSignedUrl(rawPhoto);
                    }
                }
                
                // v11.0.7 - PASSPORT FIX: Passport number must be text/identity, not a signed image link.
                // Removed the previous logic that signed the passport number if it started with http.
                
                // Unpack premium fields from JSON-packed address
                let isIdivPurchased = false;
                let idivPreviewExpiresAt = null;
                if (v.address && v.address.trim().startsWith('{')) {
                    try {
                        const p = JSON.parse(v.address);
                        isIdivPurchased = p.isIdivPurchased === true;
                        idivPreviewExpiresAt = p.idivPreviewExpiresAt || null;
                    } catch {}
                }
                
                return {
                    ...JSON.parse(JSON.stringify(v)),
                    isIdivPurchased,
                    idivPreviewExpiresAt
                };
            }));

            return NextResponse.json(verifications);
        }

        if (!verification) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Unpack premium fields from JSON-packed address
        let isIdivPurchased = false;
        let idivPreviewExpiresAt = null;
        if (verification.address && verification.address.trim().startsWith('{')) {
            try {
                const p = JSON.parse(verification.address);
                isIdivPurchased = p.isIdivPurchased === true;
                idivPreviewExpiresAt = p.idivPreviewExpiresAt || null;
            } catch {}
        }

        const verificationData = {
            ...JSON.parse(JSON.stringify(verification)),
            isIdivPurchased,
            idivPreviewExpiresAt
        };

        const data = await appendCombinedData(verificationData);
        
        // Unpack visaActiveUrl from JSON-packed address
        if (data && data.address) {
            try {
                const addrParsed = JSON.parse(data.address);
                if (addrParsed.visaActiveUrl) {
                    // Sign visaActiveUrl if it's a Supabase URL
                    data.visaActiveUrl = await getSignedUrl(addrParsed.visaActiveUrl);
                }
            } catch { /* address is plain text, no visaActiveUrl */ }
        }
        
        // Harden Photo URL & Passport Document
        // Harden Photo URL & Passport Document
        if (data) {
            // v11.0.0 - AUTO FALLBACK TO RECENT PHOTO
            if (!data.photoUrl) {
                try {
                    const latestApp = await prisma.visaApplication.findFirst({
                        where: { userId: data.userId },
                        orderBy: { appliedAt: 'desc' },
                        select: { documents: true }
                    });
                    const fallbackPhoto = (latestApp?.documents as any)?.recentPhoto || (latestApp?.documents as any)?.photo;
                    if (fallbackPhoto) data.photoUrl = fallbackPhoto;
                } catch (e) { /* ignore fallback error */ }
            }

            if (data.photoUrl) {
                const rawPhoto = cleanContaminatedPhotoUrl(data.photoUrl);
                if (rawPhoto) {
                    data.photoUrl = await getSignedUrl(rawPhoto);
                }
            }

            // REDACT SENSITIVE PII for non-admins (IDOR Protection)
            // Public verification should only expose necessary validation details
            if (!isAdmin) {
                delete data.user;
                delete data.email;
                delete data.phoneNumber;
                delete data.invoice;
                delete data.accessPin; // Prevent PIN bypass on secure-doc
                if (data.application) {
                    delete data.application.guestEmail;
                    delete data.application.whatsapp;
                }
            }
        }
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Get verification error:', error);
        return NextResponse.json({ error: 'Failed to fetch verification' }, { status: 500 });
    }
}

// HELPER: Fetch Combined Data (Application + Invoice)
async function appendCombinedData(verification: any) {
    if (!verification) return null;

    try {
        // 1. Try to find application by verificationId or userId
        const app = await (prisma.visaApplication as any).findFirst({
            where: { 
                OR: [
                    { verificationId: verification.id },
                    { userId: verification.userId || undefined }
                ]
            },
            orderBy: { appliedAt: 'desc' },
            include: {
                invoices: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        if (app) {
            verification.application = {
                id: app.id,
                slug: app.slug,
                status: app.status,
                visaName: app.visaName,
                appliedAt: app.appliedAt
            };

            if (app.invoices && app.invoices.length > 0) {
                const inv = app.invoices[0];
                verification.invoice = {
                    id: inv.id,
                    status: inv.status,
                    amount: inv.amount,
                    currency: inv.currency,
                    url: `/invoice/${inv.id}`
                };
            }

            // --- HARDENING: Pull contact details from application if not in verification ---
            if (!verification.email) verification.email = app.guestEmail || app.user?.email;
            if (!verification.phoneNumber) verification.phoneNumber = app.user?.whatsapp;
        }

        // Try to pull from user relation if still missing
        if (!verification.email && verification.user?.email) {
            verification.email = verification.user.email;
        }
        if (!verification.phoneNumber && verification.user?.whatsapp) {
            verification.phoneNumber = verification.user.whatsapp;
        }
    } catch (e) {
        console.error("Error fetching combined data for verification", e);
    }
    return verification;
}

// POST /api/verification (Create/Update)
export async function POST(request: Request) {
    try {
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const body = await request.json();
        const { 
            id, userId, fullName, passportNumber, visaType, status, address, nationality, photoUrl,
            isAgreementRequired, agreementStatus, depositAmount, accessPin, invoiceId,
            isIdivPurchased, idivPreviewExpiresAt
        } = body;

        // Normalization & Sanitization: Uppercase and strip HTML tags
        // Hardening: Do NOT toUpperCase if it looks like JSON to preserve key structures
        const sanitize = (str: any) => {
            if (typeof str !== 'string' || !str) return str;
            const clean = str.replace(/<[^>]*>?/gm, '');
            // Preserve JSON and URLs (case-sensitive)
            if (clean.trim().startsWith('{') || clean.trim().toLowerCase().startsWith('http')) return clean; 
            return clean.toUpperCase();
        };

        const fullNameFinal = sanitize(fullName);
        const passportNumberFinal = sanitize(passportNumber);
        const visaTypeFinal = sanitize(visaType);
        const nationalityFinal = sanitize(nationality);
        const photoUrlFinal = cleanContaminatedPhotoUrl(photoUrl);
        
        // --- HARDENING: Pack premium fields into address JSON ---
        let addressFinal = address;
        if (typeof address === 'string' && address.trim().startsWith('{')) {
            try {
                const addrObj = JSON.parse(address);
                addrObj.isIdivPurchased = isIdivPurchased ?? false;
                addrObj.idivPreviewExpiresAt = idivPreviewExpiresAt || null;
                addressFinal = JSON.stringify(addrObj);
            } catch {
                addressFinal = sanitize(address);
            }
        } else {
            addressFinal = sanitize(address);
        }

        // Basic validation
        if (!fullNameFinal || !passportNumberFinal) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const now = new Date();
        const issuedDate = body.issuedDate ? new Date(body.issuedDate) : now;
        const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

        if (id) {
            // UPDATE
            console.log("Updating verification:", id, body);
            const updated = await (prisma.verification as any).update({
                where: { id },
                data: {
                    fullName: fullNameFinal,
                    passportNumber: passportNumberFinal,
                    visaType: visaTypeFinal,
                    status: status || 'VALID',
                    issuedDate,
                    expiresAt,
                    address: addressFinal,
                    nationality: nationalityFinal,
                    photoUrl: photoUrlFinal,
                    isAgreementRequired: isAgreementRequired ?? false,
                    agreementStatus: agreementStatus || 'NONE',
                    depositAmount: (depositAmount !== undefined && depositAmount !== null) ? parseFloat(depositAmount) : null,
                    accessPin: accessPin || '123456',
                    invoiceId: invoiceId || null,
                    updatedAt: now
                }
            });
            
            // Audit Log
            if (auth.dbUser) {
                await logAdminAction(auth.dbUser.id, "UPDATE_VERIFICATION", "Verification", id, { fullName: fullNameFinal, status });
            }

            return NextResponse.json(updated);
        } else {
            // CREATE
            // Use provided slug or ensure unique
            const slug = body.slug || crypto.randomUUID().substring(0, 8);

            console.log("Creating verification for:", userId);

            const newVerification = await (prisma.verification as any).create({
                data: {
                    userId: userId || null,
                    fullName: fullNameFinal,
                    passportNumber: passportNumberFinal,
                    visaType: visaTypeFinal,
                    status: status || 'VALID',
                    slug,
                    issuedDate,
                    expiresAt,
                    address: addressFinal,
                    nationality: nationalityFinal,
                    photoUrl: photoUrlFinal,
                    isAgreementRequired: isAgreementRequired ?? false,
                    agreementStatus: agreementStatus || 'NONE',
                    depositAmount: (depositAmount !== undefined && depositAmount !== null) ? parseFloat(depositAmount) : null,
                    accessPin: accessPin || '123456',
                    invoiceId: invoiceId || null
                }
            });
            
            // Audit Log
            if (auth.dbUser) {
                await logAdminAction(auth.dbUser.id, "CREATE_VERIFICATION", "Verification", newVerification.id, { fullName: fullNameFinal, slug });
            }

            return NextResponse.json(newVerification);
        }

    } catch (error: any) {
        console.error('Create/Update verification error:', error);
        return NextResponse.json({ 
            error: 'Failed to save verification', 
            details: error.message,
            code: error.code
        }, { status: 500 });
    }
}


// PUT /api/verification (Partial Update / Status Toggle)
export async function PUT(request: Request) {
    try {
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        // --- HARDENING: Remove virtual fields from updateData to prevent Prisma validation errors ---
        if (updateData.isIdivPurchased !== undefined) delete updateData.isIdivPurchased;
        if (updateData.idivPreviewExpiresAt !== undefined) delete updateData.idivPreviewExpiresAt;

        const updated = await (prisma.verification as any).update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date()
            }
        });
        
        // Audit Log
        if (auth.dbUser) {
            await logAdminAction(auth.dbUser.id, "TOGGLE_VERIFICATION_STATUS", "Verification", id, updateData);
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update verification error:', error);
        return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        await prisma.verification.delete({
            where: { id }
        });
        
        // Audit Log
        if (auth.dbUser) {
            await logAdminAction(auth.dbUser.id, "DELETE_VERIFICATION", "Verification", id, {});
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete verification error:", error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
