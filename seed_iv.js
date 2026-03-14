const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedData() {
    try {
        console.log('--- Seeding Dummy Data for Verification and Invoices ---');
        
        // Ensure a user exists to link to
        let user1 = await prisma.user.findFirst();
        if (!user1) {
             user1 = await prisma.user.create({
                 data: {
                     id: '00000000-0000-0000-0000-000000000001',
                     name: 'Sample User 1',
                     email: 'sample1@example.com',
                 }
             });
             console.log('Created sample user 1');
        }

        let user2 = await prisma.user.findUnique({ where: { email: 'sample2@example.com' } });
        if (!user2) {
             user2 = await prisma.user.create({
                 data: {
                     id: '00000000-0000-0000-0000-000000000002',
                     name: 'Sample User 2',
                     email: 'sample2@example.com',
                 }
             });
             console.log('Created sample user 2');
        }

        // 1. Seed Verification
        const verifCount = await prisma.verification.count();
        if (verifCount === 0) {
            console.log('Seeding Verification Data...');
            await prisma.verification.createMany({
                data: [
                    {
                        userId: user1.id,
                        fullName: 'John Doe',
                        passportNumber: 'BC1001',
                        visaType: 'B211A Tourist Visa',
                        issuedDate: new Date(),
                        status: 'VALID',
                        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
                        slug: 'v-bc1001-john-doe',
                    },
                    {
                        userId: user2.id, // Must be unique
                        fullName: 'Jane Smith',
                        passportNumber: 'BC1002',
                        visaType: 'C314 Investor Visa',
                        issuedDate: new Date(),
                        status: 'PENDING',
                        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
                        slug: 'v-bc1002-jane-smith',
                    }
                ]
            });
            console.log('Verification data seeded.');
        } else {
             console.log('Verification data already exists.');
        }

        // 2. Seed Invoice (User ID is not unique here)
        const invCount = await prisma.invoice.count();
        if (invCount === 0) {
            console.log('Seeding Invoice Data...');
            await prisma.invoice.createMany({
                data: [
                    {
                        userId: user1.id,
                        amount: 5000000.00,
                        status: 'PAID',
                        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        currency: 'IDR',
                        paidAt: new Date(),
                    },
                    {
                        userId: user1.id,
                        amount: 1500000.00,
                        status: 'PENDING',
                        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        currency: 'IDR',
                    }
                ]
            });
            console.log('Invoice data seeded.');
        } else {
            console.log('Invoice data already exists.');
        }
        
        console.log('--- Seeding Complete ---');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

seedData();
