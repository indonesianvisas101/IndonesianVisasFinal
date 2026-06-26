import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getWorkerOrAdminAuth } from '@/lib/auth-helpers';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const auth = await getWorkerOrAdminAuth();
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
        if (!validStatuses.includes(body.status)) {
            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }

        const updatedCard = await prisma.arrivalCard.update({
            where: { id },
            data: { status: body.status }
        });

        return NextResponse.json(updatedCard);
    } catch (error: any) {
        console.error("Failed to update arrival card:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
