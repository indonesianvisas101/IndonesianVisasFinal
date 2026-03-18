import { z } from 'zod';

export const ApplicationSchema = z.object({
    visaId: z.string().min(1, "Visa Product is required"),
    visaName: z.string().optional(),
    userId: z.string().optional(),
    guestName: z.string().optional(),
    guestEmail: z.string().email().optional().or(z.literal("")),
    guestAddress: z.string().optional(),
    paymentMethod: z.string().optional(),
    customAmount: z.string().optional().nullable(),
    status: z.string().optional(),
    verificationId: z.string().optional(),
    appliedAt: z.string().optional(),
    paymentReference: z.string().optional(),
    adminNotes: z.string().optional(),
    documents: z.record(z.string(), z.string()).optional(),
    attribution: z.record(z.string(), z.any()).optional(),
    quantity: z.number().optional().default(1),
    visaAmount: z.string().optional(),
    addonsAmount: z.string().optional(),
});

export const MultiApplicationSchema = z.object({
    applications: z.array(ApplicationSchema),
});
