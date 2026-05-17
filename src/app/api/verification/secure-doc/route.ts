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

        console.log(`[SecureDoc] Record State for ${slug}:`, {
            id: verification.id,
            fullName: verification.fullName,
            isAgreementRequired: verification.isAgreementRequired,
            agreementStatus: verification.agreementStatus
        });


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
        
        // --- GATEKEEPER CHECK: Enforce Agreement Signature BEFORE displaying other files ---
        const isB1VOA = (verification.visaType || '').toUpperCase().includes('B1 VOA') || (verification.visaType || '').toUpperCase().includes('B1 - VOA') || (verification.visaType || '').toUpperCase() === 'B1';
        const agreementRequired = (verification.isAgreementRequired === true || verification.agreementStatus === 'PENDING') && !isB1VOA;
        const isSigned = verification.agreementStatus === 'SIGNED';
        const mustSignAgreement = agreementRequired && !isSigned && !isAuthorized;

        if (mustSignAgreement) {
            console.log(`[SecureDoc] Signature pending for ${verification.fullName}. Gating all visa documents.`);
            documents.push({
                name: 'Sponsorship & Responsibility Agreement (Action Required)',
                url: `/en/verify/agreement/${verification.slug}`,
                type: 'application/pdf',
                isInternal: true,
                status: verification.agreementStatus || 'PENDING'
            });
        } else {
            // 1. Holder Photo from Verification Record
            if (verification.photoUrl) {
                console.log(`[SecureDoc] Found photoUrl in verification record`);
                documents.push({
                    name: 'Profile Photo',
                    url: await getSignedUrl(verification.photoUrl),
                    type: 'image'
                });
            }

            // 2. Sponsorship & Responsibility Agreement (Enhanced)
            if (verification.isAgreementRequired || verification.agreementStatus === 'SIGNED' || verification.agreementStatus === 'PENDING') {
                const isSigned = verification.agreementStatus === 'SIGNED';
                console.log(`[SecureDoc] Adding agreement for ${verification.fullName} (Signed: ${isSigned})`);
                
                documents.push({
                    name: isSigned ? 'Sponsorship & Responsibility Agreement' : 'Sponsorship & Responsibility Agreement (Action Required)',
                    url: `/en/verify/agreement/${verification.slug}`,
                    type: 'application/pdf',
                    isInternal: true,
                    status: verification.agreementStatus // Add status for UI logic
                });
            }

            // 3. Search for Application & Its Documents
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

            // 3.5 Parse JSON documents from VisaApplication
            if (application?.documents) {
                try {
                    let docsObj: any = application.documents;
                    if (typeof docsObj === 'string') {
                        docsObj = JSON.parse(docsObj);
                    }
                    if (docsObj && typeof docsObj === 'object' && !Array.isArray(docsObj)) {
                        for (const [key, val] of Object.entries(docsObj)) {
                            if (typeof val === 'string' && val.startsWith('http')) {
                                // Prevent ANY duplication of the recent photo since it's already shown at the top
                                if (key === 'recentPhoto' || key === 'photo' || val === verification.photoUrl) continue;
                                
                                // Format key (e.g. passportCover -> Passport Cover)
                                const formattedName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                
                                // Prevent duplicates by checking if URL is already in array
                                if (!documents.find(d => d.url.includes(val.split('?')[0]))) {
                                    documents.push({
                                        name: formattedName,
                                        url: await getSignedUrl(val),
                                        type: val.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image'
                                    });
                                }
                            }
                        }
                    } else if (Array.isArray(docsObj)) {
                        for (let i = 0; i < docsObj.length; i++) {
                            const item = docsObj[i];
                            if (typeof item === 'string' && item.startsWith('http')) {
                                if (!documents.find(d => d.url.includes(item.split('?')[0]))) {
                                    documents.push({
                                        name: `Uploaded Document ${i+1}`,
                                        url: await getSignedUrl(item),
                                        type: item.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image'
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error("[SecureDoc] Error parsing application documents JSON", e);
                }
            }
            
            // 3.6 Check if Passport Number is actually a URL
            if (verification.passportNumber && verification.passportNumber.startsWith('http')) {
                 if (!documents.find(d => d.name === 'Passport Cover' || d.url.includes(verification.passportNumber.split('?')[0]))) {
                     documents.push({
                         name: 'Passport Document',
                         url: await getSignedUrl(verification.passportNumber),
                         type: verification.passportNumber.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image'
                     });
                 }
            }

            // 4. Search for User General Documents (Back-up)
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
