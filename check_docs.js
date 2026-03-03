
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDocs() {
    const userId = '2016653d-f068-4601-8d47-2ad7f768c2f8'; // User from logs
    console.log(`Testing Docs for user: ${userId}`);

    // 1. Create a dummy document
    console.log("Creating dummy doc...");
    const baseDate = new Date();
    // Use a slightly different time to avoid collision if run multiple times quickly
    baseDate.setMinutes(baseDate.getMinutes() + Math.random() * 10);

    try {
        const newDoc = await prisma.document.create({
            data: {
                userId,
                name: "Test Doc Script " + Math.floor(Math.random() * 1000),
                url: "https://example.com/test.pdf",
                type: "application/pdf",
                size: "100 KB",
                createdAt: baseDate
            }
        });
        console.log("Created Doc:", newDoc);
    } catch (e) {
        console.error("Failed to create doc:", e);
    }

    // 2. Fetch all docs for user (Simulate API logic)
    const docs = await prisma.document.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
    console.log("Fetched Docs (Count):", docs.length);
    console.log("Fetched Docs (IDs):", docs.map(d => d.id));

    // 3. Fetch Invoices (Simulate API logic)
    const apps = await prisma.visaApplication.findMany({
        where: { userId },
        orderBy: { appliedAt: 'desc' }
    });
    console.log("Fetched Apps (Count):", apps.length);

    // 4. Cleanup dummy doc
    // await prisma.document.delete({ where: { id: newDoc.id } });
}

testDocs()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
