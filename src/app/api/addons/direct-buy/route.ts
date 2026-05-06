import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { calculateOrderFees } from '@/utils/feeCalculator';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { addonId, guestName, guestEmail, quantity = 1 } = body;

        if (!addonId || !guestEmail) {
            return NextResponse.json({ error: "Addon ID and Email are required" }, { status: 400 });
        }

        // 1. Fetch Addon Data
        const addon = await prisma.addon.findUnique({
            where: { id: addonId }
        });

        if (!addon) {
            return NextResponse.json({ error: "Addon not found" }, { status: 404 });
        }

        // 2. Prepare Application & Invoice
        const applicationId = crypto.randomUUID();
        const basePrice = Number(addon.price) * quantity;
        
        // Generate Slug
        const namePart = (guestName || "Client").split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomPart = crypto.randomBytes(2).toString('hex');
        const slug = `${namePart}-${randomPart}-${addon.sku.toLowerCase()}`;

        // Calculate Fees (Default to Manual for direct leads, user can change later)
        const { serviceFee, gatewayFee, pph23Amount, totalAmount } = calculateOrderFees(basePrice, 'Manual', 0);

        // 3. Create Records
        const result = await prisma.$transaction(async (tx) => {
            const application = await tx.visaApplication.create({
                data: {
                    id: applicationId,
                    visaId: addon.sku,
                    visaName: addon.name.toUpperCase(),
                    status: 'Apply to Agent',
                    guestName: guestName || "Guest",
                    guestEmail: guestEmail,
                    slug: slug,
                    quantity: quantity,
                    attribution: {
                        internalNotes: `Individual Purchase of ${addon.name} (Direct Buy Flow)`,
                        isIndividualAddon: true,
                        addonId: addon.id
                    }
                }
            });

            const invoice = await (tx.invoice as any).create({
                data: {
                    id: slug,
                    applicationId: applicationId,
                    amount: totalAmount,
                    serviceFee: serviceFee,
                    visaAmount: basePrice,
                    addonsAmount: 0,
                    gatewayFee: gatewayFee,
                    pph23Amount: pph23Amount,
                    currency: "IDR",
                    status: 'UNPAID',
                    paymentMethod: 'Manual',
                    adminNotes: `Premium Service: ${addon.name}`,
                    quantity: quantity
                }
            });

            return { application, invoice };
        });

        // 4. Create Notification for Admin
        await prisma.notification.create({
            data: {
                userId: null,
                title: "Individual Addon Purchase",
                message: `${guestName || 'A client'} has requested individual purchase of ${addon.name}.`,
                type: "info",
                actionLink: `/admin?tab=invoicing`,
                actionText: "Manage Invoice"
            }
        });

        return NextResponse.json({ 
            success: true, 
            slug: slug,
            invoiceId: result.invoice.id 
        });

    } catch (error: any) {
        console.error("Direct Buy Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
