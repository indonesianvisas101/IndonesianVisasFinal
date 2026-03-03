const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "payments" (
            "id" TEXT NOT NULL,
            "orderId" TEXT NOT NULL,
            "transactionId" TEXT,
            "invoiceId" TEXT,
            "application_id" TEXT,
            "userId" UUID,
            "grossAmount" DECIMAL(10,2) NOT NULL,
            "currency" TEXT NOT NULL DEFAULT 'IDR',
            "paymentType" TEXT,
            "status" TEXT NOT NULL DEFAULT 'PENDING',
            "snapToken" TEXT,
            "snapRedirectUrl" TEXT,
            "metadata" JSONB,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
        )
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "payments_orderId_key" ON "payments"("orderId")`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "payments_transactionId_key" ON "payments"("transactionId")`);
    console.log("Created payments table successfully.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
