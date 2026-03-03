import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

// GET — returns recent AI Seller conversations for AI Master dashboard
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const profile = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { role: true }
        });
        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');

        const conversations = await (prisma as any).chatConversation.findMany({
            orderBy: { updatedAt: 'desc' },
            take: limit,
            select: {
                id: true,
                sessionId: true,
                topic: true,
                isMasterCmd: true,
                createdAt: true,
                updatedAt: true,
                messages: true,
            }
        });

        // Stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await (prisma as any).chatConversation.count({
            where: { createdAt: { gte: today } }
        });
        const masterCmdCount = await (prisma as any).chatConversation.count({
            where: { isMasterCmd: true }
        });

        return NextResponse.json({
            conversations,
            stats: {
                todayCount,
                masterCmdCount,
                totalCount: conversations.length
            }
        });

    } catch (error: any) {
        console.error('Chat conversations error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
