
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking public.users table columns...");

        // Add columns if they don't exist to prevent Trigger failures if the trigger tries to write to them
        const columns = ['whatsapp', 'role', 'status', 'avatar', 'bio'];

        for (const col of columns) {
            try {
                await prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "${col}" TEXT`);
                console.log(`Ensured column: ${col}`);
            } catch (e) {
                console.log(`Column ${col} check failed (might exist with diff type)`);
            }
        }

        // Also check for "Trigger" Error causes.
        // If the trigger inserts into public.users but the ID already exists?
        // Or if constraints failing?

        console.log("Users schema update attempt finished.");

    } catch (e) {
        console.error("Fix Check Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
