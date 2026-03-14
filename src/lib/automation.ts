
import prisma from '@/lib/prisma';
import { sendAbandonedCartEmail } from '@/lib/email';

/**
 * Advanced Automation Runner
 * Scans for abandoned leads and triggers marketing sequences.
 */
export async function runMarketingAutomation() {
    console.log("[Automation] Starting Marketing Sequence Check...");

    // 1. Find leads who are still in 'LEAD' status and were created 1-2 hours ago
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const abandonedLeads = await prisma.marketingLead.findMany({
        where: {
            status: 'LEAD',
            createdAt: {
                lte: oneHourAgo,
                gte: twoHoursAgo
            }
        }
    });

    console.log(`[Automation] Found ${abandonedLeads.length} potentially abandoned leads.`);

    for (const lead of abandonedLeads) {
        try {
            // Send Abandoned Cart Email
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
            
            // We can't perfectly resume the EXACT state without a session token, 
            // but we can send them to the apply page with the visa pre-selected.
            const resumeUrl = `${appUrl}/apply?visa=${lead.visaType || 'B211A'}&utm_source=abandoned_cart&utm_medium=email`;

            await sendAbandonedCartEmail(lead.email, {
                applicantName: lead.name || 'Traveler',
                visaType: lead.visaType || 'Visa',
                resumeUrl: resumeUrl
            });

            // Mark as 'NOTIFIED' so we don't spam them again
            await prisma.marketingLead.update({
                where: { id: lead.id },
                data: { status: 'QUALIFIED' } // Or a specific status like 'FOLLOWED_UP'
            });

            console.log(`[Automation] Follow-up sent to ${lead.email}`);
        } catch (e) {
            console.error(`[Automation] Failed to process lead ${lead.email}`, e);
        }
    }

    return { processed: abandonedLeads.length };
}
