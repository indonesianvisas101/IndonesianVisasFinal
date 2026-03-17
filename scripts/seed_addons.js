
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const addons = [
    {
      name: 'Express Processing',
      sku: 'EXPRESS',
      description: 'Accelerated processing for urgent visa applications.',
      shortDesc: 'Get your visa faster',
      price: 800000,
      category: 'Processing'
    },
    {
      name: 'Travel Insurance',
      sku: 'INSURANCE',
      description: 'Comprehensive travel insurance for your stay in Indonesia.',
      shortDesc: 'Safety first',
      price: 500000,
      category: 'Protection'
    },
    {
      name: 'VIP Service',
      sku: 'VIP',
      description: 'Exclusive airport assistance and fast-track immigration.',
      shortDesc: 'Premium experience',
      price: 1500000,
      category: 'Service'
    },
    {
      name: 'IDIV Processing',
      sku: 'IDIV',
      description: 'Mandatory IDIV digital verification processing.',
      shortDesc: 'Digital verification',
      price: 325000, // Approx $20
      category: 'Processing'
    }
  ];

  console.log('Seeding Addons...');

  for (const addon of addons) {
    await prisma.addon.upsert({
      where: { sku: addon.sku },
      update: addon,
      create: addon,
    });
  }

  console.log('Addons seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
