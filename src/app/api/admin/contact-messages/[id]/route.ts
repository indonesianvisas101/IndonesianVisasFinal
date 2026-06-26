import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminAuth } from '@/lib/auth-helpers';
import { logAdminAction } from '@/lib/auditLogger';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { authorized, error, status, dbUser } = await getAdminAuth();
        if (!authorized) return NextResponse.json({ error }, { status });

        const { id } = await params;
        const body = await request.json();
        const { status: newStatus } = body;

        if (!newStatus) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const updatedMessage = await prisma.contactMessage.update({
            where: { id },
            data: { status: newStatus }
        });

        if (dbUser) {
            await logAdminAction(
                dbUser.id,
                "UPDATE_MESSAGE_STATUS",
                "ContactMessage",
                id,
                { status: newStatus }
            );
        }

        return NextResponse.json({ success: true, message: updatedMessage });
    } catch (err: any) {
        console.error("PATCH Contact Message Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
