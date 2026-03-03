import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('isAdmin') === 'true';

        let services = await prisma.companyService.findMany({
            orderBy: [
                { sortOrder: 'asc' },
                { category: 'asc' }
            ]
        });

        if (!isAdmin) {
            services = services.filter(s => s.isActive);
        }

        const parsedServices = services.map(service => {
            let parsedFeatures: any = service.features;
            try {
                if (typeof service.features === 'string') {
                    if ((service.features as string).startsWith('{')) {
                        parsedFeatures = (service.features as string).substring(1, (service.features as string).length - 1).split(',').map(s => s.replace(/"/g, ''));
                    } else {
                        parsedFeatures = JSON.parse(service.features);
                    }
                }
            } catch (e) {
                console.warn("Failed to parse features for service", service.id, e);
            }
            return {
                ...service,
                features: Array.isArray(parsedFeatures) ? parsedFeatures : []
            };
        });

        return NextResponse.json(parsedServices);
    } catch (error: any) {
        console.error("Error fetching company services:", error);
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { category, name, price, description, features, isActive, sortOrder } = body;

        const maxOrderSvc = await prisma.companyService.findFirst({
            orderBy: { sortOrder: 'desc' }
        });
        const nextOrder = sortOrder !== undefined ? sortOrder : ((maxOrderSvc?.sortOrder || 0) + 1);

        const newService = await prisma.companyService.create({
            data: {
                category,
                name,
                price: String(price),
                description,
                features: Array.isArray(features) ? features : [],
                isActive: isActive ?? true,
                sortOrder: nextOrder
            }
        });

        return NextResponse.json({ success: true, id: newService.id });
    } catch (error: any) {
        console.error("Error creating service:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, category, name, price, description, features, isActive, sortOrder } = body;

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.companyService.update({
            where: { id },
            data: {
                category,
                name,
                price: String(price),
                description,
                features: Array.isArray(features) ? features : [],
                isActive,
                sortOrder: sortOrder !== undefined ? sortOrder : 0
            }
        });

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error("Error updating service:", error);
        return NextResponse.json({ error: "Failed to update: " + error.message, details: error.toString() }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.companyService.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
