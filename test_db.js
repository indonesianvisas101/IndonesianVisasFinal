const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    console.log("Fetching Visa:");
    const v = await prisma.visa.findFirst({where: {id: 'B1'}});
    console.log(v);
}
main().catch(console.error).finally(() => prisma.$disconnect());
