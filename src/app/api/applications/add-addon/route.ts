import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateOrderFees } from '@/utils/feeCalculator';

export async function POST(req: Request) {
    try {
        const { invoiceId, addonSku } = await req.json();

        if (!invoiceId || !addonSku) {
            return NextResponse.json({ error: "Missing invoiceId or addonSku" }, { status: 400 });
        }

        // 1. Fetch Invoice & Application
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: { visaApplication: true }
        });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        if (invoice.status !== 'UNPAID') {
            return NextResponse.json({ error: "Cannot add addons to a paid invoice" }, { status: 400 });
        }

        const application = invoice.visaApplication;
        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // 2. Check if already added
        const attribution = (application.attribution as any) || {};
        const upsells = attribution.upsells || {};
        
        const skuKey = addonSku.toLowerCase() === 'idiv' ? 'idiv' : 
                       addonSku.toLowerCase() === 'arrival_card' ? 'arrival_card' : addonSku.toLowerCase();

        if (upsells[skuKey]) {
            return NextResponse.json({ error: "Addon already added to this order" }, { status: 400 });
        }

        // 3. Fetch Addon Price
        const addon = await prisma.addon.findUnique({
            where: { sku: addonSku.toUpperCase() }
        });

        if (!addon) {
            return NextResponse.json({ error: "Addon service not found" }, { status: 404 });
        }

        const addonPrice = Number(addon.price);

        // 4. Recalculate Totals
        // Existing base processing
        const visaAmount = Number((invoice as any).visaAmount || 0);
        const currentAddonsAmount = Number((invoice as any).addonsAmount || 0);
        const newAddonsAmount = currentAddonsAmount + addonPrice;

        // Use the centralized calculator
        // We calculate for the WHOLE order again to ensure tax/fees are correct
        const { serviceFee, gatewayFee, pph23Amount, totalAmount } = calculateOrderFees(
            visaAmount + newAddonsAmount,
            invoice.paymentMethod || 'Manual',
            0 // No discount for now
        );

        // 5. Update Database
        const result = await prisma.$transaction(async (tx) => {
            // Update Application Attribution
            const updatedUpsells = { ...upsells, [skuKey]: true };
            const updatedAttribution = { ...attribution, upsells: updatedUpsells };

            await tx.visaApplication.update({
                where: { id: application.id },
                data: { attribution: updatedAttribution }
            });

            // Update Invoice
            const updatedInvoice = await (tx.invoice as any).update({
                where: { id: invoice.id },
                data: {
                    amount: totalAmount,
                    addonsAmount: newAddonsAmount,
                    serviceFee: serviceFee,
                    gatewayFee: gatewayFee,
                    pph23Amount: pph23Amount,
                    adminNotes: (invoice.adminNotes || '') + `\n+ Added ${addon.name} (IDR ${addonPrice.toLocaleString()})`
                }
            });

            return updatedInvoice;
        });

        return NextResponse.json({ 
            success: true, 
            message: `${addon.name} added to your order.`,
            invoice: result 
        });

    } catch (error: any) {
        console.error("Add Addon Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
