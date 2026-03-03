import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { VISA_DATABASE } from '@/constants/visas';

export async function GET() {
    try {
        // 1. Clear existing data to avoid duplicates (optional, but good for idempotency during dev)
        await prisma.visa.deleteMany({});

        // 2. Map and Insert
        // We need to ensure 'requirements' is processed correctly if it's Json type
        // Also ensure price and fee are stringified if they are objects/numbers
        const operations = VISA_DATABASE.map(visa => {
            const priceVal = typeof visa.price === 'string' ? visa.price : JSON.stringify(visa.price);
            const feeVal = typeof visa.fee === 'string' ? visa.fee : JSON.stringify(visa.fee);

            return prisma.visa.create({
                data: {
                    id: visa.id,
                    category: visa.category,
                    name: visa.name,
                    description: visa.description,
                    price: priceVal,
                    fee: feeVal,
                    validity: visa.validity,
                    extendable: visa.extendable ?? false,
                    requirements: JSON.stringify(visa.requirements), // Manual stringification
                }
            });
        });

        await prisma.$transaction(operations);

        return NextResponse.json({
            success: true,
            message: `Database seeded successfully with ${VISA_DATABASE.length} records.`
        });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to seed database",
            details: String(error)
        }, { status: 500 });
    }
}
