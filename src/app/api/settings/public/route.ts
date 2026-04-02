import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const settings = await prisma.globalSetting.findMany({
            where: {
                key: {
                    in: ['popular_visas']
                }
            }
        });
        
        const result: Record<string, any> = {};
        for (const setting of settings) {
            try {
                result[setting.key] = setting.value ? JSON.parse(setting.value) : null;
            } catch (e) {
                result[setting.key] = setting.value;
            }
        }
        
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
