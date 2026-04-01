import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

const ELITE_REGIONS = ['NL', 'US', 'AU', 'CA', 'DE', 'GB', 'SG', 'FR'];

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const headerList = await headers();
        const ip = headerList.get('x-forwarded-for') || 'unknown';
        const country = headerList.get('x-vercel-ip-country') || 'unknown';
        
        // 1. High-Value Region Check
        const isEliteRegion = ELITE_REGIONS.includes(country);
        
        if (!isEliteRegion) {
            return NextResponse.json({ success: true, message: 'Prospect tracked (Normal)' });
        }

        // 2. Alert Logic for Admin AI Master Tab
        const alertLabel = `[ELITE DIASPORA PROSPECT]`;
        const notes = `High-Value visitor from ${country} (${ip}) engaged with GCI Hub for ${body.dwellTime}s. Reach out ASAP.`;

        await prisma.notification.create({
            data: {
                title: alertLabel,
                message: notes,
                type: 'warning',
                actionLink: `/admin/analytics`,
                actionText: 'View Session'
            }
        });

        // 3. Record in AI Master Memory for strategic reporting
        await (prisma as any).aIMasterMemory.upsert({
            where: { memoryKey: `elite_prospect_${ip}` },
            update: {
                memoryValue: {
                    lastVisited: new Date(),
                    dwellTime: body.dwellTime,
                    country,
                    url: body.url
                }
            },
            create: {
                memoryKey: `elite_prospect_${ip}`,
                memoryValue: {
                    firstVisited: new Date(),
                    dwellTime: body.dwellTime,
                    country,
                    url: body.url
                }
            }
        });

        return NextResponse.json({ success: true, message: 'Elite alert triggered.' });

    } catch (e) {
        console.error("[GCI Alert Error]:", e);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
