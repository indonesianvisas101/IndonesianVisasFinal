import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function HEAD() {
    try {
        // Check if table exists/reachable
        await prisma.$queryRaw`SELECT 1 FROM "conversations" LIMIT 1`;
        return new NextResponse(null, { status: 200 });
    } catch (e) {
        return new NextResponse(null, { status: 500 });
    }
}

export async function GET() {
    try {
        const count = await prisma.conversation.count();
        return NextResponse.json({ status: 'ok', service: 'internal-chat', active_conversations: count });
    } catch (e) {
        // Fallback if table doesn't exist yet (before SQL run)
        return NextResponse.json({ status: 'error', message: 'Chat tables missing' }, { status: 500 });
    }
}
