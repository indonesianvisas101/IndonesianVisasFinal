import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 1. Fetch all conversations
        const { data: allConvs, error: fetchError } = await supabase
            .from('conversations')
            .select('id, user_id, updated_at')
            .order('updated_at', { ascending: false });

        if (fetchError) throw fetchError;

        if (!allConvs || allConvs.length === 0) {
            return NextResponse.json({ message: 'No conversations found', deleted_count: 0 });
        }

        // 2. Identify Latest per User
        const latestIds = new Set();
        const seenUsers = new Set();
        const toDeleteIds: string[] = [];

        for (const conv of allConvs) {
            if (!seenUsers.has(conv.user_id)) {
                // This is the first (latest because of sort) for this user
                seenUsers.add(conv.user_id);
                latestIds.add(conv.id);
            } else {
                // Duplicate/Older
                toDeleteIds.push(conv.id);
            }
        }

        // 3. Delete duplicates
        if (toDeleteIds.length > 0) {
            // Delete messages first (if cascade not set, but let's try direct conv delete, usually cascade or we ignore messages for now)
            // Ideally we delete messages linked to these too.
            await supabase.from('messages').delete().in('conversation_id', toDeleteIds);

            const { error: deleteError } = await supabase
                .from('conversations')
                .delete()
                .in('id', toDeleteIds);

            if (deleteError) throw deleteError;
        }

        return NextResponse.json({
            success: true,
            deleted_count: toDeleteIds.length,
            kept_count: latestIds.size
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
