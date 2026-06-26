import { NextResponse } from 'next/server';
import { getWorkerOrAdminAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const auth = await getWorkerOrAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }
        
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get('conversationId');
        const limitParam = searchParams.get('limit');
        const senderType = searchParams.get('senderType');
        const ilike = searchParams.get('ilike');

        if (!conversationId) {
            return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
        }

        // Use Prisma to securely bypass RLS without Service Role Key
        const whereClause: any = {
            conversationId: conversationId
        };
        
        if (senderType) whereClause.senderType = senderType;
        if (ilike) {
            whereClause.message = {
                contains: ilike.replace(/%/g, ''), // Convert SQL ilike pattern to Prisma contains
                mode: 'insensitive'
            };
        }

        const messages = await prisma.message.findMany({
            where: whereClause,
            orderBy: { createdAt: limitParam ? 'desc' : 'asc' },
            ...(limitParam ? { take: parseInt(limitParam) } : {})
        });

        const mappedMessages = messages.map((m: any) => ({
            ...m,
            created_at: m.createdAt,
            conversation_id: m.conversationId,
            is_read: m.isRead
        }));

        return NextResponse.json(mappedMessages);
    } catch (e: any) {
        console.error("Admin Chat Messages API Error:", e);
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
