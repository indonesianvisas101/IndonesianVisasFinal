import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const formation = await prisma.companyFormation.findUnique({
                where: { id },
                include: { invoices: true }
            });
            return NextResponse.json(formation);
        }

        // List all requests for the dashboard
        const formations = await prisma.companyFormation.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                companyName: true,
                applicantName: true,
                applicantEmail: true,
                equityCapital: true,
                paymentStatus: true,
                formationStatus: true,
                createdAt: true
            }
        });

        return NextResponse.json(formations);

    } catch (error) {
        console.error("[ADMIN_COMPANY_FORMATION_GET]", error);
        return NextResponse.json({ error: "Failed to fetch formation data" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, formationStatus, paymentStatus, notes } = body;

        const updated = await prisma.companyFormation.update({
            where: { id },
            data: {
                formationStatus,
                paymentStatus,
                logs: {
                    push: {
                        action: "ADMIN_UPDATE",
                        status: formationStatus,
                        timestamp: new Date().toISOString(),
                        note: notes || "Status updated by admin."
                    }
                }
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[ADMIN_COMPANY_FORMATION_PUT]", error);
        return NextResponse.json({ error: "Failed to update formation" }, { status: 500 });
    }
}
