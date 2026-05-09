import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function checkVerification() {
    try {
        console.log('Searching for DEAN ANTHONY MILES...');
        const verification = await prisma.verification.findFirst({
            where: { fullName: { contains: 'DEAN ANTHONY MILES', mode: 'insensitive' } }
        });
        
        if (!verification) {
            console.log('Verification record NOT found.');
            return;
        }

        console.log('Verification Record Found:');
        console.log('ID:', verification.id);
        console.log('Slug:', verification.slug);
        console.log('Status:', verification.status);
        console.log('Agreement Status:', (verification as any).agreementStatus);
        console.log('Agreement Required:', (verification as any).isAgreementRequired);
        console.log('Photo URL:', verification.photoUrl);
        
        const application = await prisma.visaApplication.findFirst({
            where: { 
                OR: [
                    { verificationId: verification.id },
                    { userId: verification.userId || undefined }
                ]
            }
        });
        console.log('Linked Application:', application ? application.id : 'NONE');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkVerification();
