const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function directAudit() {
    const client = new Client({
        connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL
    });
    
    try {
        console.log('--- DIRECT PG AUDIT ---');
        await client.connect();
        
        const tables = [
            'visa_applications',
            'invoices',
            'payments',
            'Verification',
            'users',
            'visas'
        ];

        for (const table of tables) {
            try {
                // Determine if we need quotes
                const tableName = (table === 'Verification' || table === 'Visa') ? `"${table}"` : `"${table}"`;
                const res = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
                console.log(`[${table}] Count: ${res.rows[0].count}`);
            } catch (err) {
                console.log(`[${table}] Error: ${err.message}`);
            }
        }
        
        console.log('--- AUDIT END ---');
    } catch (err) {
        console.error('Audit failed:', err);
    } finally {
        await client.end();
    }
}

directAudit();
