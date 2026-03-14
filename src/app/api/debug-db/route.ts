
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        console.log("Debug DB: Fetching Users count...");
        const count = await prisma.$queryRawUnsafe('SELECT COUNT(*) FROM "users"') as any[];
        
        console.log("Debug DB: Fetching first 5 users...");
        const users = await prisma.$queryRawUnsafe('SELECT * FROM "users" LIMIT 5');
        
        return NextResponse.json({
            success: true,
            count: count[0].count.toString(),
            users: users,
            env: {
                DATABASE_URL: process.env.DATABASE_URL ? "SET" : "MISSING",
                NODE_ENV: process.env.NODE_ENV
            }
        });
    } catch (error: any) {
        console.error("Debug DB Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
