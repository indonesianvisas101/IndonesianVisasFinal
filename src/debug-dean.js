const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking Dean Miles (JS)...");
  try {
    const user = await prisma.verification.findFirst({
      where: {
        fullName: {
          contains: 'DEAN ANTHONY MILES',
          mode: 'insensitive'
        }
      }
    });

    if (!user) {
      console.log("❌ User not found!");
    } else {
      console.log("User Data Found:");
      console.log("- Full Name:", user.fullName);
      console.log("- Photo URL:", user.photoUrl);
    }
  } catch (err) {
    console.error("❌ DB Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
