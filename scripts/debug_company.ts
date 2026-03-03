
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- DEBUGGING CompanyService TABLE ---");
    try {
        // 1. Check Count / basic select
        const results: any = await prisma.$queryRawUnsafe('SELECT * FROM "CompanyService"');
        console.log(`Total Records Found: ${results.length}`);

        if (results.length > 0) {
            console.log("First 3 records:");
            results.slice(0, 3).forEach((r: any, i: number) => {
                console.log(`[${i}] ID: ${r.id}`);
                console.log(`    Name: ${r.name}`);
                console.log(`    IsActive (Raw):`, r.isActive, `Type: ${typeof r.isActive}`);
                console.log(`    Features (Raw):`, r.features, `Type: ${typeof r.features}`);
            });
        } else {
            console.log("Table is empty.");
        }

    } catch (e) {
        console.error("Query Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
