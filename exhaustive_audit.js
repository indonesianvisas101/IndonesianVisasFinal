const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function exhaustiveAudit() {
    try {
        console.log('--- EXHAUSTIVE TABLE AUDIT ---');
        
        const possibleTables = [
            'visa_applications', 'VisaApplication', '"VisaApplication"',
            'invoices', 'Invoice', '"Invoice"',
            'Verification', 'verification', '"Verification"',
            'users', 'User', '"User"',
            'ArrivalCard', 'arrival_cards', '"arrival_cards"'
        ];

        for (const table of possibleTables) {
            try {
                const res = await prisma.$queryRawUnsafe(`SELECT COUNT(*) FROM ${table}`);
                console.log(`[${table}] SUCCESS: ${res[0].count}`);
            } catch (err) {
                // Silently ignore failures
            }
        }

        // List all tables in all schemas again but more comprehensively
        const allTables = await prisma.$queryRawUnsafe(`
            SELECT table_schema, table_name 
            FROM information_schema.tables 
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
            ORDER BY table_schema, table_name
        `);
        console.log('All Tables Found:', JSON.stringify(allTables, null, 2));

        console.log('--- AUDIT END ---');
    } catch (err) {
        console.error('Audit failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

exhaustiveAudit();
