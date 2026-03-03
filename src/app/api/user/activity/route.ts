import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { trackUserActivity } from '@/lib/activity';

export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await trackUserActivity(user.id);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
