import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function HEAD() {
    try {
        await prisma.notification.count();
        return new NextResponse(null, { status: 200 });
    } catch (e) {
        return new NextResponse(null, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        if (userId) {
            const notifs = await prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json(notifs);
        } else {
            // Admin: All Notifications + Count
            const count = await prisma.notification.count();
            const all = await prisma.notification.findMany({
                orderBy: { createdAt: 'desc' },
                take: 50
            });
            // Return array for admin dashboard usage primarily, or object with count?
            // Admin Dashboard expects ARRAY for "Information Center"
            // But Health Check expects just 200 OK via simpleFetch.
            // Let's return array if no params, but include a header or just rely on array length.
            return NextResponse.json(all);
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, title, message, type, actionLink, actionText } = body;

        const newNotif = await prisma.notification.create({
            data: {
                userId, // Can be null for global/admin
                title,
                message,
                type: type || 'info',
                actionLink,
                actionText
            }
        });

        return NextResponse.json(newNotif);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    try {
        if (id) {
            await prisma.notification.delete({
                where: { id }
            });
            return new NextResponse(null, { status: 200 });
        } else if (userId) {
            // Clear All for User
            await prisma.notification.deleteMany({
                where: { userId }
            });
            return new NextResponse(null, { status: 200 });
        }
        return NextResponse.json({ error: "Missing id or userId" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
    }
}
