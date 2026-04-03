import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // KBLI is now handled manually by the user, skipping seeded data.

  // Seeding Company Formation Products
  console.log('Seeding Company Formation Products...');
  const formationProducts = [
    {
      id: "prod_pma_basic",
      name: "Basic Planning",
      description: "Basic Planning: Core business activity selection (KBLI) and basic shareholding...",
      price: 25000000, 
      category: "COMPANY_FORMATION",
      active: true,
      features: [
        "Deed of Establishment",
        "Approval Letter from the Ministry of Law and Human Rights",
        "Business Identification Number",
        "Risk-Based Business License",
        "OSS Registration and AHU Registration",
        "Taxpayer Identification Number",
        "Taxable Entrepreneur Certificate",
        "Standard Articles of Association"
      ]
    },
    {
      id: "prod_pma_strategic",
      name: "Strategic Planning",
      description: "Strategic Planning: In-depth business structure consultation and KBLI (Business...",
      price: 45000000, 
      category: "COMPANY_FORMATION",
      active: true,
      features: [
        "Deed of Establishment",
        "Approval Letter from the Ministry of Law and Human Rights",
        "Business Identification Number",
        "Risk-Based Business License",
        "OSS Registration and AHU Registration",
        "Taxpayer Identification Number",
        "Taxable Entrepreneur Certificate",
        "Standard Articles of Association",
        "Prime Virtual Office 6 Months",
        "Bank Account Opening",
        "Legal Consultation 6 Months",
        "Tax Assistance 6 Months"
      ]
    },
    {
      id: "prod_pma_end_to_end",
      name: "End-to-End Company Formation",
      description: "Our End-to-End Company Formation framework ensures a seamless journey...",
      price: 84800000, 
      category: "COMPANY_FORMATION",
      active: true,
      features: [
        "Full Complete Document",
        "Company Full Setup:Email,Logo&Web",
        "Prime Virtual Office 1 Year",
        "Bank Account Opening",
        "Legal Consultation 3 Years",
        "Tax Assistance 3 Years",
        "Preparation to Start",
        "1x KITAS Investor",
        "Foreign ID / KTP",
        "C - Drive Licence"
      ]
    }
  ];

  for (const product of formationProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product
    });
  }
  console.log('Company Formation Products seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
