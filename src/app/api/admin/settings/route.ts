
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const settings = await prisma.globalSetting.findMany();
        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { key, value, isEnabled } = await request.json();
        const setting = await prisma.globalSetting.upsert({
            where: { key },
            update: { value, isEnabled },
            create: { key, value, isEnabled }
        });

        return NextResponse.json(setting);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
