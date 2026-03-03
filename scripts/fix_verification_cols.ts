
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking Verification table columns...");

        // Add columns if they don't exist
        await prisma.$executeRawUnsafe(`ALTER TABLE "Verification" ADD COLUMN IF NOT EXISTS "issuedDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP`);
        console.log("Added issuedDate");

        await prisma.$executeRawUnsafe(`ALTER TABLE "Verification" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3)`);
        console.log("Added expiresAt");

        console.log("Migration successful");
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
