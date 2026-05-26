import { createClient } from '@/utils/supabase/server';
import { getAdminAuth } from '@/lib/auth-helpers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: Request) {
    const supabase = await createClient();

    // 1. Check Auth (Any authenticated user)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, type } = await req.json();
        if (!id || !type) {
            return NextResponse.json({ error: 'Missing id or type' }, { status: 400 });
        }

        // 2. Check Admin Authorization
        const adminAuth = await getAdminAuth();
        const isAdmin = adminAuth.authorized;

        // 3. Perform Delete Safely
        if (type === 'conversation') {
            // ONLY Admins are allowed to delete whole conversations
            if (!isAdmin) {
                return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
            }

            // Delete messages first to avoid Foreign Key Constraint errors
            await prisma.message.deleteMany({
                where: { conversationId: id }
            });

            // Now delete conversation
            await prisma.conversation.delete({
                where: { id: id }
            });

        } else if (type === 'message') {
            // If standard user, verify ownership
            if (!isAdmin) {
                const dbMsg = await prisma.message.findUnique({
                    where: { id: id },
                    include: {
                        conversation: {
                            select: { userId: true }
                        }
                    }
                });

                if (!dbMsg) {
                    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
                }

                if (dbMsg.conversation.userId !== user.id) {
                    return NextResponse.json({ error: 'Forbidden: You do not own this conversation' }, { status: 403 });
                }
            }

            // Perform message delete
            await prisma.message.delete({
                where: { id: id }
            });

        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error("Delete API Critical Error:", e);
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
