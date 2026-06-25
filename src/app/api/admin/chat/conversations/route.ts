import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const auth = await getAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }
        
        // Use Prisma to securely bypass RLS for Admin Dashboard without needing Service Role Key
        const conversations = await prisma.conversation.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                // Include last message for sidebar preview
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        message: true,
                        senderType: true,
                        createdAt: true
                    }
                }
            }
        });

        // Map to flat format compatible with the frontend
        const mappedData = conversations.map((c: any) => ({
            ...c,
            updated_at: c.updatedAt,
            created_at: c.createdAt,
            user_id: c.userId,
            is_read: c.isRead,
            // Expose last message for sidebar preview
            lastMessage: c.messages && c.messages.length > 0 ? {
                message: c.messages[0].message,
                senderType: c.messages[0].senderType,
                created_at: c.messages[0].createdAt
            } : null,
            // Flag if last message is from user (unread indicator)
            hasUnreadFromUser: c.messages && c.messages.length > 0 && c.messages[0].senderType === 'user'
        }));

        return NextResponse.json(mappedData);
    } catch (e: any) {
        console.error("Admin Chat Convs API Error:", e);
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
