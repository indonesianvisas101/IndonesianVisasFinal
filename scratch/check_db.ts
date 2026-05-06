
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkDB() {
    try {
        const leads = await prisma.marketingLead.findMany({
            where: {
                OR: [
                    { passportUrl: { not: null } },
                    { photoUrl: { not: null } }
                ]
            },
            take: 5,
            select: {
                name: true,
                passportUrl: true,
                photoUrl: true
            }
        });
        console.log("--- Marketing Leads Samples ---");
        console.log(JSON.stringify(leads, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkDB();
