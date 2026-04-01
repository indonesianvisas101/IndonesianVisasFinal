const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding GCI Data...');

  // 1. Add GCI Visa Product
  const gciVisa = await prisma.visa.upsert({
    where: { id: 'GCI-UNLIMITED' },
    update: {},
    create: {
      id: 'GCI-UNLIMITED',
      name: 'Global Citizen of Indonesia (GCI)',
      category: 'DIASPORA_SERVICES',
      description: 'The premier status for Indonesian Diaspora. Enjoy lifelong residency, work rights, and property ownership without the need for periodic extensions.',
      price: '50000000',
      fee: '0',
      validity: 'Unlimited / Lifetime',
      extendable: false,
      requirements: '1. Evidence of blood ties to Indonesia (Birth Certificate/Family Card)\n2. Proof of ex-WNI status (if applicable)\n3. Valid foreign passport\n4. Statement of commitment to Indonesia',
      details: JSON.stringify({
          tier: 'Elite',
          infinityIcon: true,
          reentry: 'Unlimited',
          processing: 'Fast Track (14 Days)'
      })
    },
  });

  console.log('✅ GCI Visa Created:', gciVisa.name);

  // 2. Add GCI Knowledge Page
  const gciKnowledge = await prisma.knowledgePage.upsert({
    where: { slug: 'gci-detailed-guide' },
    update: {},
    create: {
      slug: 'gci-detailed-guide',
      title: 'Global Citizen of Indonesia (GCI): The Ultimate Guide 2026',
      content: {
          sections: [
              {
                  title: "Introduction",
                  body: "The Global Citizen of Indonesia (GCI) program is a revolutionary immigration status designed specifically for the Indonesian diaspora, including former citizens and their descendants."
              },
              {
                  title: "Key Benefits",
                  body: "Unlike standard ITAS or ITAP, the GCI status offers 'Unlimited' validity. This means you no longer need to worry about the expiration of your stay permit, provided you maintain your eligibility and update your passport as required."
              },
              {
                  title: "Eligibility Hierarchy",
                  body: "Current regulations divide eligibility into several categories (4C, 4D, 4H). Our specialized team handles the complex verification of bloodlines and historical legal documents to ensure a 100% approval rate."
              }
          ]
      },
      pageType: 'knowledge_article',
      category: 'diaspora',
      published: true,
      metadata: {
          description: "Learn everything about the GCI program for Indonesian Diaspora. Unlimited stay, work rights, and property ownership.",
          keywords: "GCI Indonesia, Diaspora Visa, Unlimited ITAP, Indonesian Citizen, 4C 4D 4H Visa"
      }
    },
  });

  console.log('✅ GCI Knowledge Page Created:', gciKnowledge.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
