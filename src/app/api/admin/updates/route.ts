import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase'; // If needed for auth? Or use middleware

export async function GET() {
    try {
        // SUSTAINABLE HARDENING: Auto-publish drafts older than 10 minutes
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        
        try {
            await prisma.immigrationUpdate.updateMany({
                where: {
                    published: false,
                    createdAt: { lt: tenMinutesAgo }
                },
                data: {
                    published: true
                }
            });
        } catch (autoError) {
            console.error("Auto-publish background task failed:", autoError);
        }

        const updates = await prisma.immigrationUpdate.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(updates);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        // Generate slug if not provided
        const slug = data.slug || data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        const update = await prisma.immigrationUpdate.create({
            data: {
                title: data.title,
                content: data.content,
                category: data.category || 'Immigration',
                summary: data.summary,
                image: data.image,
                slug: slug,
                published: data.published || false,
            }
        });
        return NextResponse.json(update);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { id, ...updateData } = data;
        
        const update = await prisma.immigrationUpdate.update({
            where: { id },
            data: updateData
        });
        return NextResponse.json(update);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        
        await prisma.immigrationUpdate.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
