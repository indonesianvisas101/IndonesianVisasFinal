import prisma from '@/lib/prisma';

export async function trackUserActivity(userId: string) {
    if (!userId) return;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { last_activity_at: new Date() }
        });
    } catch (error) {
        console.error(`[Activity] Failed to track for ${userId}:`, error);
        // Fail silently - activity tracking should not block main thread
    }
}
