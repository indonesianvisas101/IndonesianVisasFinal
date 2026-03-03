
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'damnbayu@gmail.com'; // Replace with the user's email if different

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        // Update role to admin
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { role: 'admin' },
        });
        console.log(`User ${email} updated to admin:`, updatedUser);
    } else {
        // Determine what to do if user doesn't exist
        // For now, we'll try to create it, assuming the ID matches Supabase's ID logic or we just create a placeholder
        // Ideally we need the real Supabase ID. 
        // Since we don't have it easily without Supabase Admin, we will just log a warning.
        console.log(`User ${email} not found in public.User table. ensuring table exists first...`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
