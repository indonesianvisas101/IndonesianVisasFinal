import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const verification = await prisma.verification.findUnique({
            where: { slug }
        });

        if (!verification) {
            return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: verification.id,
            fullName: verification.fullName,
            passportNumber: verification.passportNumber,
            visaType: verification.visaType,
            issuedDate: verification.issuedDate,
            status: verification.status,
            issuer: "Indonesian Visas"
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch verification' }, { status: 500 });
    }
}
