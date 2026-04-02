import { PrismaClient } from '@prisma/client';
import { VISA_DATABASE } from '../src/constants/visas';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Direct Visa Seeding...');
  
  try {
    // 1. Clear existing visas
    const deleteCount = await prisma.visa.deleteMany({});
    console.log(`🗑️ Deleted ${deleteCount.count} existing visas.`);

    // 2. Insert new visas
    let successCount = 0;
    
    for (const visa of VISA_DATABASE) {
      const priceVal = typeof visa.price === 'string' ? visa.price : JSON.stringify(visa.price);
      const feeVal = typeof visa.fee === 'string' ? visa.fee : JSON.stringify(visa.fee);

      await prisma.visa.create({
        data: {
          id: visa.id,
          category: visa.category,
          name: visa.name,
          description: visa.description,
          price: priceVal,
          fee: feeVal,
          validity: visa.validity,
          extendable: visa.extendable ?? false,
          requirements: JSON.stringify(visa.requirements || []),
          details: JSON.stringify(visa.details || {}),
        }
      });
      successCount++;
    }

    console.log(`✅ Successfully seeded ${successCount} visas into Supabase.`);
    
    // 3. Quick Verification of B1
    const b1 = await prisma.visa.findUnique({ where: { id: 'B1' } });
    console.log('🔍 Verification of B1 Price:', b1?.price);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
