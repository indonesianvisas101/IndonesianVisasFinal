
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    const userId = '2016653d-f068-4601-8d47-2ad7f768c2f8'; // User from logs
    console.log(`Checking data for user: ${userId}`);

    // 1. Check User
    const user = await prisma.user.findUnique({ where: { id: userId } });
    console.log("User:", user ? "Found" : "Not Found");

    // 2. Check Verification
    const verification = await prisma.verification.findUnique({ where: { userId: userId } });
    console.log("Verification (by userId):", verification);

    if (!verification) {
        const allVerifications = await prisma.verification.findMany();
        console.log("All Verifications Count:", allVerifications.length);
        console.log("Are there any unlinked verifications matching name?", allVerifications.filter(v => v.fullName === user?.name));
    }

    // 3. Check Documents
    const docs = await prisma.document.findMany({ where: { userId: userId } });
    console.log("Documents:", docs);

    // 4. Check Applications (Invoice Source)
    const apps = await prisma.visaApplication.findMany({ where: { userId: userId } });
    console.log("Applications:", apps);
}

checkData()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
