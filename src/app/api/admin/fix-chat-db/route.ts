import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

export async function POST() {
    try {
        // 1. Authenticate Admin
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        // 2. Fetch all conversations from Prisma (bypassing RLS safely)
        const allConvs = await prisma.conversation.findMany({
            orderBy: { updatedAt: 'desc' },
            select: { id: true, userId: true }
        });

        if (!allConvs || allConvs.length === 0) {
            return NextResponse.json({ message: 'No conversations found', deleted_count: 0 });
        }

        // 3. Identify duplicates per user (keeping only the latest active one)
        const latestIds = new Set<string>();
        const seenUsers = new Set<string>();
        const toDeleteIds: string[] = [];

        for (const conv of allConvs) {
            if (!seenUsers.has(conv.userId)) {
                seenUsers.add(conv.userId);
                latestIds.add(conv.id);
            } else {
                toDeleteIds.push(conv.id);
            }
        }

        // 4. Perform Cascade Delete
        if (toDeleteIds.length > 0) {
            // Delete messages first to prevent foreign key errors
            await prisma.message.deleteMany({
                where: { conversationId: { in: toDeleteIds } }
            });

            // Delete duplicates
            const deleteRes = await prisma.conversation.deleteMany({
                where: { id: { in: toDeleteIds } }
            });
            
            console.log(`[fix-chat-db] Cleaned up ${deleteRes.count} duplicate conversations.`);
        }

        return NextResponse.json({
            success: true,
            deleted_count: toDeleteIds.length,
            kept_count: latestIds.size
        });

    } catch (e: any) {
        console.error("Fix Chat DB API Error:", e);
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
