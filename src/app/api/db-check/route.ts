import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        console.log("Running DB CHECK tool...");

        // 1. Get initial state
        const initial = await prisma.$queryRaw`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'visa_applications' AND column_name = 'visaId';
        `;

        // 2. Attempt Fix (Force Text)
        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "visa_applications" ALTER COLUMN "visaId" DROP DEFAULT;`);
        } catch (e) { }

        await prisma.$executeRawUnsafe(`ALTER TABLE "visa_applications" ALTER COLUMN "visaId" TYPE text USING "visaId"::text;`);

        // 3. Get final state
        const finalState = await prisma.$queryRaw`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'visa_applications' AND column_name = 'visaId';
        `;

        return NextResponse.json({
            status: "Complete",
            before: initial,
            after: finalState,
            message: "If 'after' shows data_type: 'text', the DB is fixed. Please RESTART 'npm run dev' to clear app cache."
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed', details: String(error) }, { status: 500 });
    }
}
