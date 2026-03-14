
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, phone, visaType, attributionData } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Upsert lead: if email exists, update the name/phone/type, otherwise create.
        const lead = await prisma.marketingLead.upsert({
            where: { email },
            update: {
                name: name || undefined,
                phone: phone || undefined,
                visaType: visaType || undefined,
                attributionData: attributionData || undefined,
                status: 'LEAD', // Ensure it stays as a lead if they return
                updatedAt: new Date()
            },
            create: {
                email,
                name,
                phone,
                visaType,
                attributionData,
                status: 'LEAD'
            }
        });

        return NextResponse.json({ success: true, leadId: lead.id });
    } catch (error: any) {
        console.error('Lead Capture Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
