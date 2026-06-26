import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminAuth } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { authorized, error, status } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const url = new URL(request.url);
        const search = url.searchParams.get('search') || '';
        const type = url.searchParams.get('type') || ''; // 'inquiry', 'complaint', or all
        const msgStatus = url.searchParams.get('status') || ''; // 'PENDING', 'RESOLVED'

        const where: any = {};

        if (type && type !== 'all') {
            where.type = type;
        }

        if (msgStatus) {
            where.status = msgStatus;
        }

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { whatsapp: { contains: search, mode: 'insensitive' } },
                { message: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
            ];
        }

        const messages = await prisma.contactMessage.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, results: messages });
    } catch (err: any) {
        console.error("GET Contact Messages Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
