import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
    const supabase = await createClient();

    // 1. Check Auth (Any authenticated user)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, type } = await req.json();

        // 2. Client Selection (Service Role vs Standard)
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        let dbClient = supabase; // Default to standard authenticated client

        if (serviceRoleKey) {
            const { createClient: createAdmin } = require('@supabase/supabase-js');
            dbClient = createAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey);
        } else {
            console.warn("SUPABASE_SERVICE_ROLE_KEY missing. Attempting delete with standard authenticated client (RLS must allow this).");
        }

        // 3. Perform Delete
        if (type === 'conversation') {
            // Fetch conversation to check owner (or existence)
            const { data: conv } = await dbClient.from('conversations').select('user_id').eq('id', id).single();
            if (!conv) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });

            // Manual Cascade: Delete messages first to avoid Foreign Key Constraint errors
            // (If ON DELETE CASCADE is missing in DB, this solves it)
            const { error: msgError } = await dbClient.from('messages').delete().eq('conversation_id', id);
            if (msgError) {
                console.error("Cascade Delete Messages Error:", msgError);
                // We communicate this error, but depending on policy, this might fail if user can't delete others' messages.
                // However, try to proceed to delete conversation? No, FK will block.
                return NextResponse.json({ error: `Failed to delete messages: ${msgError.message}` }, { status: 500 });
            }

            // Now delete conversation
            const { error } = await dbClient.from('conversations').delete().eq('id', id);
            if (error) {
                console.error("Delete Conversation Error:", error);
                return NextResponse.json({ error: `Failed to delete conversation: ${error.message}` }, { status: 500 });
            }

        } else if (type === 'message') {
            const { error } = await dbClient.from('messages').delete().eq('id', id);
            if (error) {
                console.error("Delete Message Error:", error);
                return NextResponse.json({ error: `Failed to delete message: ${error.message}` }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error("Delete API Critical Error:", e);
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
