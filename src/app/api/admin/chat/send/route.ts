import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const supabase = await createClient();

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Parse Body
        const { conversation_id, message } = await req.json();

        if (!conversation_id || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 3. Insert Message (Admin)
        // Note: 'is_read: false' because the USER hasn't read it yet.
        // Fix: Use Admin UUID. 'admin' string fails DB trigger casting.
        const { error } = await supabase.from('messages').insert({
            conversation_id,
            senderType: user.id,
            message,
            is_read: false
        });

        if (error) {
            console.error("Message Insert Error:", error);
            // Handle Trigger Error specifically if needed
            if (error.code === 'P0001') { // Example code
                return NextResponse.json({ error: "Database Trigger Error - Check Logs" }, { status: 500 });
            }
            throw error;
        }

        // 4. Update Conversation Timestamp
        await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversation_id);

        // 5. Create Notification for User
        // Fix: Use Prisma to ensure correct table/model usage
        try {
            const { data: conv } = await supabase.from('conversations').select('user_id').eq('id', conversation_id).single();
            if (conv && conv.user_id) {
                await prisma.notification.create({
                    data: {
                        userId: conv.user_id, // Maps to userId field
                        title: 'New Message from Support',
                        message: message.substring(0, 100), // Preview
                        type: 'info',
                        actionLink: `/?openChat=true`,
                        actionText: 'View Chat',
                    }
                });
            }
        } catch (notifError) {
            console.error("Notification Creation Failed (Non-fatal):", notifError);
            // Do not throw, allowing the message to be sent successfully
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error("Admin Chat API Error:", e);
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
