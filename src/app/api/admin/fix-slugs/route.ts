import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugify } from '@/utils/slugify';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const results = {
            knowledgePagesFixed: 0,
            immigrationUpdatesFixed: 0,
            errors: [] as string[]
        };

        // 1. Fix Knowledge Pages
        const knowledgePages = await prisma.knowledgePage.findMany();
        for (const page of knowledgePages) {
            const cleanSlug = slugify(page.slug);
            if (cleanSlug !== page.slug) {
                try {
                    await prisma.knowledgePage.update({
                        where: { id: page.id },
                        data: { slug: cleanSlug }
                    });
                    results.knowledgePagesFixed++;
                } catch (e: any) {
                    results.errors.push(`KnowledgePage ${page.id}: ${e.message}`);
                }
            }
        }

        // 2. Fix Immigration Updates
        const updates = await prisma.immigrationUpdate.findMany();
        for (const update of updates) {
            const cleanSlug = slugify(update.slug);
            if (cleanSlug !== update.slug) {
                try {
                    await prisma.immigrationUpdate.update({
                        where: { id: update.id },
                        data: { slug: cleanSlug }
                    });
                    results.immigrationUpdatesFixed++;
                } catch (e: any) {
                    results.errors.push(`ImmigrationUpdate ${update.id}: ${e.message}`);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Slug repair process completed.",
            results
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
