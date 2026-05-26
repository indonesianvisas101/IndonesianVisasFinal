const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function auditDatabaseSetup() {
    try {
        console.log('=== DATABASE SETUP AUDIT ===\n');

        // Check if there are users
        const userCount = await prisma.user.count();
        console.log(`Total users in public.users: ${userCount}`);

        const admins = await prisma.user.findMany({
            where: { role: 'admin' },
            select: { id: true, email: true, name: true }
        });
        console.log(`Admins in public.users:`, JSON.stringify(admins, null, 2));

        // Check if tables are registered in the supabase_realtime publication
        console.log('\nChecking publication status...');
        const pubInfo = await prisma.$queryRawUnsafe(`
            SELECT schemaname, tablename 
            FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime';
        `);
        console.log(JSON.stringify(pubInfo, null, 2));

    } catch (e) {
        console.error('Audit failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

auditDatabaseSetup();
