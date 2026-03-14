const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCounts() {
    try {
        console.log('--- DATA COUNT AUDIT ---');
        
        const visaCount = await prisma.visa ? await prisma.visa.count() : 'Table not found';
        const userCount = await prisma.user ? await prisma.user.count() : 'Table not found';
        const applicationCount = await prisma.visaApplication ? await prisma.visaApplication.count() : 'Table not found';
        const invoiceCount = await prisma.invoice ? await prisma.invoice.count() : 'Table not found';
        const messageCount = await prisma.supportMessage ? await prisma.supportMessage.count() : 'Table not found';
        
        console.log(`Visas: ${visaCount}`);
        console.log(`Users (Public): ${userCount}`);
        console.log(`Applications: ${applicationCount}`);
        console.log(`Invoices: ${invoiceCount}`);
        console.log(`Support Messages: ${messageCount}`);
        
        if (userCount > 0) {
            const sampleUser = await prisma.user.findFirst();
            console.log(`Sample User Email: ${sampleUser.email}`);
        }

        console.log('--- AUDIT END ---');
    } catch (err) {
        console.error('Audit failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

checkCounts();
