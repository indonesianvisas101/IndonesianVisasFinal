import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { getSignedUrl } from './lib/storage';

// Load env from .env.local explicitly for debugging
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log("Checking Dean Anthony Miles...");
  const user = await (prisma.verification as any).findFirst({
    where: {
      fullName: {
        contains: 'DEAN ANTHONY MILES',
        mode: 'insensitive'
      }
    }
  });

  if (!user) {
    console.log("❌ User not found!");
    return;
  }

  console.log("User Data Found:");
  console.log("- Full Name:", user.fullName);
  console.log("- Passport:", user.passportNumber);
  console.log("- Photo URL:", user.photoUrl);
  console.log("- Address (Packed):", user.address);

  if (user.photoUrl) {
    console.log("\nAttempting to sign Photo URL...");
    const signed = await getSignedUrl(user.photoUrl);
    console.log("- Signed URL Result:", signed);
    
    if (signed === user.photoUrl) {
      console.log("⚠️  Signing failed or returned original URL (check logs above).");
    } else {
      console.log("✅ Successfully generated signed URL.");
    }
  } else {
    console.log("⚠️  No Photo URL stored for this user.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
