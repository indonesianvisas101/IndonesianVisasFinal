
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.visa.update({
        where: { id: "C12" },
        data: {
            description: "Visitor visa for foreign nationals conducting pre-investment activities in Indonesia."
        }
    });

    await prisma.visa.update({
        where: { id: "E29" },
        data: {
            description: "Work visa for foreign researchers conducting research activities in Indonesia."
        }
    });

    console.log("Updated C12 and E29 descriptions in database.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
