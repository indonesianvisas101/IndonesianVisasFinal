const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const setting = await prisma.globalSetting.findUnique({ where: { key: 'popular_visas' } });
  console.log("Current DB Settings:", setting);

  if (setting && setting.value) {
      let parsed = JSON.parse(setting.value);
      if (parsed.includes('IDIV')) {
          parsed = parsed.filter(v => v !== 'IDIV');
          await prisma.globalSetting.update({
              where: { key: 'popular_visas' },
              data: { value: JSON.stringify(parsed) }
          });
          console.log("Removed IDIV from DB");
      }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
