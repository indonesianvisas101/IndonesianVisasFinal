
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const page = await prisma.knowledgePage.findUnique({
    where: { slug: 'gci-detailed-guide' }
  })
  console.log(JSON.stringify(page, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
