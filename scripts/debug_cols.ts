
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- DEBUGGING COLUMNS ---");
    try {
        const result: any[] = await prisma.$queryRawUnsafe(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'CompanyService'
    `);
        console.log("Columns:", result);
    } catch (e) {
        console.error("Query Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
