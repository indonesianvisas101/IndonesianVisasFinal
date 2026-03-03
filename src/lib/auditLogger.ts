import prisma from '@/lib/prisma';

export async function logAdminAction(
    adminId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: any
) {
    try {
        await prisma.auditLog.create({
            data: {
                adminId,
                action,
                entityType,
                entityId,
                metadata: metadata ? metadata : {},
            }
        });
    } catch (error) {
        console.error("Failed to log admin action:", error);
        // Fail silently to not block the main action
    }
}
