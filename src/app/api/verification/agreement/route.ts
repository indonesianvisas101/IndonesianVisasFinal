import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { slug, signature, checks, ip } = body;

        if (!slug || !signature) {
            return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
        }

        // 1. Find the verification record
        const verification = await (prisma.verification as any).findUnique({
            where: { slug }
        });

        if (!verification) {
            return NextResponse.json({ error: 'Verification record not found' }, { status: 404 });
        }

        // 2. Update the record with signature and signed status
        const updated = await (prisma.verification as any).update({
            where: { id: verification.id },
            data: {
                agreementStatus: 'SIGNED',
                signatureData: signature,
                agreementSignedAt: new Date(),
                ipAddress: ip || request.headers.get('x-forwarded-for') || 'unknown',
                // Keep the record valid
                status: 'VALID' 
            }
        });

        // 3. Optional: Create an Audit Log or Email Notification
        // Since we don't have an adminId here (it's a public user action), 
        // we can skip the standard AuditLog or use a system ID.
        
        return NextResponse.json({
            success: true,
            message: 'Agreement signed successfully',
            signedAt: updated.agreementSignedAt
        });

    } catch (error) {
        console.error('Agreement submission error:', error);
        return NextResponse.json({ error: 'Failed to process agreement' }, { status: 500 });
    }
}
