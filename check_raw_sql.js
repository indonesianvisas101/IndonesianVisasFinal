const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function rawAudit() {
    try {
        console.log('--- RAW SQL AUDIT ---');
        
        const tables = [
            'visa_applications',
            'invoices',
            'payments',
            'Verification',
            'users'
        ];

        for (const table of tables) {
            try {
                const result = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "${table}"`);
                console.log(`[${table}] Count: ${result[0].count}`);
            } catch (err) {
                console.log(`[${table}] Error: ${err.message}`);
            }
        }
        
        console.log('--- AUDIT END ---');
    } catch (err) {
        console.error('Audit failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

rawAudit();
