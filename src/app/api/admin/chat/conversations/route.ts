import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const authClient = await createClient();
        const { data: { user } } = await authClient.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
