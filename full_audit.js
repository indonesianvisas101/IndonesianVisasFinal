const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fullAudit() {
    try {
        console.log('--- FULL DATABASE AUDIT ---');
        const models = [
            'visa', 'user', 'auditLog', 'visaApplication', 'document', 
            'notification', 'verification', 'companyService', 'conversation', 
            'message', 'invoice', 'arrivalCard', 'payment', 'chatConversation', 
            'marketingLead', 'pushSubscription'
        ];

        for (const model of models) {
            try {
                if (prisma[model]) {
                    const count = await prisma[model].count();
                    console.log(`[${model}] Count: ${count}`);
                } else {
                    console.log(`[${model}] Model not found in client`);
                }
            } catch (err) {
                console.log(`[${model}] Error: ${err.message}`);
            }
        }
        
        console.log('--- AUDIT END ---');
    } catch (err) {
        console.error('Audit failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

fullAudit();
