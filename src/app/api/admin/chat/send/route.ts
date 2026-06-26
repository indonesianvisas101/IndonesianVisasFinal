import { NextResponse } from 'next/server';
import { getWorkerOrAdminAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    // 1. Check Auth
    const auth = await getWorkerOrAdminAuth();
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        // 2. Parse Body
        const { conversation_id, message } = await req.json();

        if (!conversation_id || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 3. Insert Message via Prisma (Bypasses RLS write, broadcasts to Supabase Realtime via DB replication)
        const newMsg = await prisma.message.create({
            data: {
                conversationId: conversation_id,
                senderType: auth.user!.id,
                message: message,
                isRead: false
            }
        });

        // 4. Update Conversation Timestamp
        await prisma.conversation.update({
            where: { id: conversation_id },
            data: { updatedAt: new Date() }
        });

        // 5. Create Notification for User
        try {
            const conv = await prisma.conversation.findUnique({
                where: { id: conversation_id },
                select: { userId: true }
            });
            if (conv && conv.userId) {
                await prisma.notification.create({
                    data: {
                        userId: conv.userId,
                        title: 'New Message from Support',
                        message: message.substring(0, 100),
                        type: 'info',
                        actionLink: `/?openChat=true`,
                        actionText: 'View Chat',
                    }
                });
            }
        } catch (notifError) {
            console.error("Notification Creation Failed (Non-fatal):", notifError);
        }

        return NextResponse.json({ success: true, messageId: newMsg.id });

    } catch (e: any) {
        console.error("Admin Chat Send API Error:", e);
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
