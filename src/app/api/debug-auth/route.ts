
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json({ error: "Not logged in" }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: authUser.id }
        });

        // Also check if there's any other user with this email
        const sameEmailUsers = await prisma.user.findMany({
            where: { email: authUser.email }
        });

        return NextResponse.json({
            authUserId: authUser.id,
            authEmail: authUser.email,
            dbUser,
            sameEmailUsers,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
