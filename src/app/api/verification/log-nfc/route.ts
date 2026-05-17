import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logAdminAction } from '@/lib/auditLogger';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { slug } = await request.json();

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Find the verification record
        const verification = await prisma.verification.findUnique({
            where: { slug }
        });

        if (!verification) {
            return NextResponse.json({ error: 'Verification record not found' }, { status: 404 });
        }

        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        const userAgent = request.headers.get('user-agent') || 'Unknown Device';

        console.log(`[NFC Tap Log] Hardware scan detected for verification slug: ${slug} from IP: ${ip}`);

        // Log the action in AuditLog
        // For public taps, we use "SYSTEM-NFC" as the adminId
        await logAdminAction(
            "SYSTEM-NFC",
            "NFC_HARDWARE_TAP",
            "Verification",
            verification.id,
            {
                slug,
                ip,
                userAgent,
                timestamp: new Date().toISOString(),
                isSecureScan: true
            }
        );

        return NextResponse.json({
            success: true,
            message: 'NFC hardware tap event registered successfully.'
        });

    } catch (error: any) {
        console.error('[NFC Tap Log] Failed to log NFC event:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
