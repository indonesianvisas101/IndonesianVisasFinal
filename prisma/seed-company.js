const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const services = [
    {
        category: "PT PMA (Foreign Owned)",
        name: "PT PMA Establishment - Standard",
        price: "25000000",
        description: "Complete foreign company registration including Deed of Establishment, AHU Approval, and NIB.",
        features: ["Virtual Office (1 Year)", "NIB & OSS Registration", "Tax ID (NPWP)", "Standard Articles of Association"],
        isActive: true,
        sortOrder: 1
    },
    {
        category: "PT PMA (Foreign Owned)",
        name: "PT PMA Establishment - Full Package",
        price: "45000000",
        description: "Premium setup for international businesses with comprehensive legal support and banking assistance.",
        features: ["Prime Virtual Office", "Investor KITAS Assistance", "Bank Account Opening", "Legal Consultation (5 Hours)"],
        isActive: true,
        sortOrder: 2
    },
    {
        category: "Local PT (Indonesian Owned)",
        name: "Local PT - Express",
        price: "8000000",
        description: "Fast-track registration for domestic Indonesian companies with local shareholders.",
        features: ["Deed of Establishment", "AHU Approval", "NIB OSS", "NPWP Company"],
        isActive: true,
        sortOrder: 3
    },
    {
        category: "Other Services",
        name: "Virtual Office Bali",
        price: "5000000",
        description: "Prestigious business address in Bali for company registration and mail handling.",
        features: ["Business Address", "Mail Handling", "Meeting Room Access (4h/mo)", "Shared Phone Number"],
        isActive: true,
        sortOrder: 4
    }
];

async function main() {
    console.log('Seeding Company Services...');
    for (const s of services) {
        await prisma.companyService.upsert({
            where: { id: `seed_${s.name.replace(/\s+/g, '_').toLowerCase()}` },
            update: s,
            create: {
                id: `seed_${s.name.replace(/\s+/g, '_').toLowerCase()}`,
                ...s
            }
        });
    }
    console.log('Company Services seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
