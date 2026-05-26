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
                }
            }
        });

        // Prisma relationships are camelCase, map to match the previous response format if needed
        // Or the frontend can use it directly if they expect camelCase, but since they
        // previously used supabase we might need to map snake_case dates.
        const mappedData = conversations.map((c: any) => ({
            ...c,
            updated_at: c.updatedAt,
            created_at: c.createdAt,
            user_id: c.userId,
            is_read: c.isRead
        }));

        return NextResponse.json(mappedData);
    } catch (e: any) {
        console.error("Admin Chat Convs API Error:", e);
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
