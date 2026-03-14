const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function schemaDiscovery() {
    try {
        console.log('--- SCHEMA DISCOVERY ---');
        
        // List all schemas
        const schemas = await prisma.$queryRawUnsafe(`
            SELECT schema_name FROM information_schema.schemata
            WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        `);
        console.log('Available Schemas:', JSON.stringify(schemas, null, 2));

        // List tables in each schema
        for (const s of schemas) {
            const tables = await prisma.$queryRawUnsafe(`
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = $1
            `, s.schema_name);
            console.log(`Tables in [${s.schema_name}]:`, tables.map(t => t.table_name).join(', '));
        }

        console.log('--- DISCOVERY END ---');
    } catch (err) {
        console.error('Discovery failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

schemaDiscovery();
