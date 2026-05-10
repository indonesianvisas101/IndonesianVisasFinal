import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendAgreementConfirmationEmail } from '@/lib/email';
import { uploadFile } from '@/lib/storage';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { slug, signature, checks, ip, pdfBase64 } = body;

        if (!slug || !signature) {
            return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
        }

        // 1. Find the verification record including user for email
        const verification = await (prisma.verification as any).findUnique({
            where: { slug },
            include: { user: true }
        });

        if (!verification) {
            return NextResponse.json({ error: 'Verification record not found' }, { status: 404 });
        }

        // 1.5 Generate Secure Audit Hash
        const { createHash } = await import('node:crypto');
        const hashContent = `${slug}-${signature}-${new Date().toISOString()}-${ip}`;
        const agreementHash = createHash('sha256').update(hashContent).digest('hex');
        const agreementVersion = 'v1.1-2024';

        // 2. Archive to Cloud (S3/Supabase) FIRST so we can store the URL
        let archiveUrl = null;
        if (pdfBase64) {
            try {
                const fileName = `agreement_${slug}_${Date.now()}.pdf`;
                archiveUrl = await uploadFile('agreements', fileName, pdfBase64);
                console.log(`[Archive] Agreement archived successfully: ${archiveUrl}`);
            } catch (err) {
                console.error("[Archive] Failed to archive agreement PDF:", err);
            }
        }

        // 2.5 Prepare packed address with archiveUrl
        let packedAddress = verification.address;
        try {
            let jsonObj: any = {};
            if (verification.address && verification.address.trim().startsWith('{')) {
                jsonObj = JSON.parse(verification.address);
            } else {
                jsonObj = { street: verification.address };
            }
            if (archiveUrl) jsonObj.agreementUrl = archiveUrl;
            jsonObj.agreementHash = agreementHash;
            jsonObj.agreementSignedAt = new Date().toISOString();
            packedAddress = JSON.stringify(jsonObj);
        } catch (e) {
            console.error("Failed to pack address with agreement data", e);
        }

        // 3. Update the record
        const userIp = ip || request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';

        const updated = await (prisma.verification as any).update({
            where: { id: verification.id },
            data: {
                agreementStatus: 'SIGNED',
                signatureData: signature,
                agreementSignedAt: new Date(),
                ipAddress: userIp,
                agreementHash,
                agreementVersion,
                address: packedAddress,
                status: 'VALID' 
            }
        });
        
        // 4. Create an Audit Log
        await (prisma.auditLog as any).create({
            data: {
                adminId: 'CLIENT_SIGNATURE',
                action: 'AGREEMENT_SIGNED',
                entityId: verification.id,
                entityType: 'Verification',
                metadata: {
                    slug,
                    hash: agreementHash,
                    version: agreementVersion,
                    ip: userIp,
                    userAgent: request.headers.get('user-agent'),
                    archiveUrl: archiveUrl
                }
            }
        });
        
        // 4. Send Confirmation Email
        // Priority: Verification record (if added later) > Linked User email
        const recipientEmail = (verification as any).email || verification.user?.email;
        
        if (recipientEmail) {
            await sendAgreementConfirmationEmail(recipientEmail, {
                applicantName: verification.fullName,
                agreementHash: agreementHash,
                signedAt: updated.agreementSignedAt.toISOString(),
                verificationSlug: slug
            }).catch(err => console.error("Email Automation Error:", err));
        }
        
        return NextResponse.json({
            success: true,
            message: 'Agreement signed successfully',
            signedAt: updated.agreementSignedAt,
            hash: agreementHash
        });

    } catch (error) {
        console.error('Agreement submission error:', error);
        return NextResponse.json({ error: 'Failed to process agreement' }, { status: 500 });
    }
}
