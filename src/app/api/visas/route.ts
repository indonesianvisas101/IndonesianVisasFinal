// Force recompile
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import type { Visa } from '@prisma/client';
import { logAdminAction } from '@/lib/auditLogger';
import { getAdminAuth } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

import { VISA_DETAILS } from '@/constants/visaDetails';

// ---------- helpers ----------
const safeParse = (value: unknown) => {
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

const safeStringify = (value: unknown) => {
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
};

// ---------- GET ----------
export async function GET() {
    try {
        let visas = await prisma.visa.findMany({
            orderBy: { createdAt: 'desc' },
        });

        if (visas.length === 0) {
            const { VISA_DATABASE } = await import('@/constants/visas');

            for (const visa of VISA_DATABASE) {
                await prisma.visa.create({
                    data: {
                        id: visa.id,
                        category: visa.category,
                        name: visa.name,
                        description: visa.description,
                        price: safeStringify(visa.price),
                        fee: safeStringify(visa.fee),
                        validity: visa.validity,
                        extendable: visa.extendable ?? false,
                        requirements: JSON.stringify(visa.requirements || []),
                        details: JSON.stringify(VISA_DETAILS[visa.id] || {}),
                    },
                });
            }

            visas = await prisma.visa.findMany({
                orderBy: { createdAt: 'desc' },
            });
        }

        const parsedVisas = (visas as Visa[]).map((visa: Visa) => ({
            ...visa,
            requirements: JSON.parse(visa.requirements),
            price: safeParse(visa.price),
            fee: safeParse(visa.fee),
            details: JSON.parse(visa.details || '{}'),
        }));

        return NextResponse.json(parsedVisas);
    } catch (error) {
        console.error('Fetch error - Falling back to Static Data:', error);
        // Fallback: Return static data so the site works even if DB is down
        const { VISA_DATABASE } = await import('@/constants/visas');
        const { VISA_DETAILS } = await import('@/constants/visaDetails');

        // Mimic the parsed structure
        const fallbackVisas = VISA_DATABASE.map(v => ({
            ...v,
            price: v.price, // Already correct format in static
            fee: v.fee,
            requirements: v.requirements,
            details: VISA_DETAILS[v.id] || {},
            // Add other missing DB fields as defaults
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Ensure types match
            category: v.category,
            name: v.name,
            description: v.description,
            validity: v.validity,
            extendable: v.extendable || false
        }));

        return NextResponse.json(fallbackVisas);
    }
}

// ---------- POST ----------
export async function POST(request: Request) {
    try {
        const { authorized, error, status, dbUser } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const body = await request.json();

        const newVisa = await prisma.visa.create({
            data: {
                category: body.category,
                name: body.name,
                description: body.description,
                price: safeStringify(body.price),
                fee: safeStringify(body.fee),
                validity: body.validity,
                extendable: body.extendable,
                requirements: JSON.stringify(body.requirements || []),
                details: JSON.stringify(body.details || {}),
            },
        });

        return NextResponse.json({
            ...newVisa,
            requirements: JSON.parse(newVisa.requirements),
            price: safeParse(newVisa.price),
            fee: safeParse(newVisa.fee),
            details: JSON.parse(newVisa.details || '{}'),
        });
    } catch (error) {
        console.error('Create error:', error);
        return NextResponse.json(
            { error: 'Failed to create visa' },
            { status: 500 }
        );
    }
}

// ---------- PUT ----------
export async function PUT(request: Request) {
    try {
        const { authorized, error, status, dbUser } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const body = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        const existingVisa = await prisma.visa.findUnique({ where: { id: body.id } });

        // Use UPSERT to handle both existing and new (restored) visas
        const safePrice = safeStringify(body.price);
        const safeFee = safeStringify(body.fee);
        const safeRequirements = JSON.stringify(body.requirements || []);
        const safeDetails = JSON.stringify(body.details || {});

        // SECTION 4 - PRICE OVERRIDE LOGIC
        if (existingVisa && existingVisa.price !== safePrice) {
            // Log the override strictly using AuditLog
            if (dbUser) {
                await logAdminAction(
                    dbUser.id,
                    'PRICE_OVERRIDE_BY_BOSS',
                    'Visa',
                    body.id,
                    { oldPrice: existingVisa.price, newPrice: safePrice }
                );
            }
        }

        const updatedVisa = await prisma.visa.upsert({
            where: { id: body.id },
            update: {
                category: body.category,
                name: body.name,
                description: body.description,
                price: safePrice,
                fee: safeFee,
                validity: body.validity,
                extendable: body.extendable,
                requirements: safeRequirements,
                details: safeDetails,
            },
            create: {
                id: body.id, // Preserve ID
                category: body.category,
                name: body.name,
                description: body.description,
                price: safePrice,
                fee: safeFee,
                validity: body.validity,
                extendable: body.extendable ?? false,
                requirements: safeRequirements,
                details: safeDetails,
            }
        });

        return NextResponse.json({
            ...updatedVisa,
            requirements: JSON.parse(updatedVisa.requirements),
            price: safeParse(updatedVisa.price),
            fee: safeParse(updatedVisa.fee),
            details: JSON.parse(updatedVisa.details || '{}'),
        });
    } catch (error: any) {
        console.error('Update error:', error);
        return NextResponse.json(
            { error: `Failed to update visa: ${error.message}` },
            { status: 500 }
        );
    }
}

// ---------- DELETE ----------
export async function DELETE(request: Request) {
    try {
        const { authorized, error, status, dbUser } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        await prisma.visa.delete({ where: { id } });

        if (dbUser) {
            await logAdminAction(dbUser.id, "DELETE_VISA", "Visa", id, {});
        }

        // Revalidate public pages
        revalidatePath('/[locale]/services/[id]', 'page');
        revalidatePath('/[locale]/visas', 'page');
        revalidatePath('/[locale]/apply', 'page');

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: 'Failed to delete visa' },
            { status: 500 }
        );
    }
}
