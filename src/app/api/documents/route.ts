import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// HEAD: Check if DB is reachable
export async function HEAD() {
    try {
        await prisma.document.count();
        return new NextResponse(null, { status: 200 });
    } catch (e) {
        return new NextResponse(null, { status: 500 });
    }
}

// GET: Real Count/List
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        if (userId) {
            // 1. Fetch Uploaded Documents
            const docs = await prisma.document.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });

            // 2. Fetch Invoices (Visa Applications)
            // We treat active/paid applications as "Invoice" documents
            // Using raw SQL to avoid column mapping issues (visa_id vs visaId)
            const apps: any[] = await prisma.$queryRawUnsafe(`
                SELECT * FROM "visa_applications" 
                WHERE "user_id" = $1::uuid
                ORDER BY "appliedAt" DESC
            `, userId);

            const invoiceDocs = apps.map((app: any) => {
                const appliedAt = app.appliedAt || app.applied_at;
                const visaName = app.visaName || app.visa_name || 'Visa Application';
                return {
                    id: app.id,
                    name: `Invoice - ${visaName}`,
                    url: `/invoice/${app.id}`,
                    size: "PDF",
                    type: "application/invoice",
                    createdAt: appliedAt
                };
            });

            // 3. Combine and Sort (Graceful handling of null dates)
            const allDocs = [...invoiceDocs, ...docs].sort((a, b) => {
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                return dateB - dateA;
            });

            return NextResponse.json(allDocs);
        } else {
            // Health Check / Admin Stats
            const count = await prisma.document.count();
            return NextResponse.json({ status: 'ok', count });
        }
    } catch (error: any) {
        console.error("Fetch docs error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch documents" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, name, url, size, type } = body;

        if (!userId || !name || !url) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newDoc = await prisma.document.create({
            data: {
                userId,
                name,
                url,
                size: size || "0 KB",
                type: type || "application/pdf"
            }
        });

        return NextResponse.json(newDoc);
    } catch (error) {
        console.error("Error creating document:", error);
        return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Document ID required" }, { status: 400 });
        }

        await prisma.document.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting document:", error);
        return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    }
}
