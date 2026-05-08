import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSignedUrl } from '@/lib/storage';

import { getAdminAuth } from '@/lib/auth-helpers';

export async function POST(request: Request) {
    try {
        const { slug, pin, isAdminBypass } = await request.json();

        if (!slug || (!pin && !isAdminBypass)) {
            return NextResponse.json({ error: 'Slug and credentials required' }, { status: 400 });
        }

        const verification = await (prisma.verification as any).findUnique({
            where: { slug }
        });

        if (!verification) {
            return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
        }

        // Logic Bypass for Admin
        let isAuthorized = false;
        if (isAdminBypass) {
            const auth = await getAdminAuth();
            if (auth.authorized) isAuthorized = true;
        }

        // Check PIN if not admin
        if (!isAuthorized && verification.accessPin !== pin) {
            return NextResponse.json({ error: 'Invalid PIN' }, { status: 403 });
        }

        // Access Granted: Return secure document links
        console.log(`[SecureDoc] Access granted for: ${verification.fullName} (ID: ${verification.id})`);
        
        const documents = [];
        
        // 1. Holder Photo from Verification Record
        if (verification.photoUrl) {
            console.log(`[SecureDoc] Found photoUrl in verification record`);
            documents.push({
                name: 'Profile Photo',
                url: await getSignedUrl(verification.photoUrl),
                type: 'image'
            });
        }

        // 2. Search for Application & Its Documents
        const application = await (prisma.visaApplication as any).findFirst({
            where: { 
                OR: [
                    { verificationId: verification.id },
                    { userId: verification.userId || undefined }
                ]
            },
            include: {
                applicationDocuments: true
            }
        });

        if (application?.applicationDocuments) {
            console.log(`[SecureDoc] Found ${application.applicationDocuments.length} docs in linked application`);
            for (const doc of application.applicationDocuments) {
                documents.push({
                    name: doc.fileName || 'Visa Document',
                    url: await getSignedUrl(doc.filePath),
                    type: doc.fileType || 'application/pdf'
                });
            }
        }

        // 3. Search for User General Documents (Back-up)
        if (verification.userId) {
            const userDocs = await (prisma as any).document.findMany({
                where: { userId: verification.userId }
            });
            if (userDocs && userDocs.length > 0) {
                console.log(`[SecureDoc] Found ${userDocs.length} docs in user general documents`);
                for (const d of userDocs) {
                    // Avoid duplicates
                    if (!documents.find(existing => existing.name === d.name)) {
                        documents.push({
                            name: d.name,
                            url: await getSignedUrl(d.url),
                            type: d.type
                        });
                    }
                }
            }
        }

        if (documents.length === 0) {
            console.warn(`[SecureDoc] No documents found for ${verification.fullName}`);
        }

        return NextResponse.json({
            fullName: verification.fullName,
            passportNumber: verification.passportNumber,
            documents
        });

    } catch (error) {
        console.error('Secure doc access error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
