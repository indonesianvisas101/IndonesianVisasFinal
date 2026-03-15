import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL && user.email !== 'bayu@indonesianvisas.com' && user.email !== 'damnbayu@gmail.com')) {
            // Very strict check for Admin role too
            const { data: profile } = await supabase.from('users').select('role').eq('id', user?.id).single();
            if (profile?.role !== 'admin') {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        const logs = await (prisma as any).emailLog?.findMany({
            orderBy: { sentAt: 'desc' },
            take: 100 // Limit for performance
        }) || [];

        return NextResponse.json(logs);
    } catch (error: any) {
        console.error("Email Logs API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
