import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { invoiceId, addonSku } = await req.json();

        if (!invoiceId || !addonSku) {
            return NextResponse.json({ error: "Missing invoiceId or addonSku" }, { status: 400 });
        }

        // 1. Fetch the invoice - try direct ID first, then fallback to VisaApplication ID
        let invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: { visaApplication: true }
        });

        if (!invoice) {
            // Fallback: Check if the ID provided is actually a VisaApplication ID
            const visaApp = await prisma.visaApplication.findUnique({
                where: { id: invoiceId },
                include: { invoices: true }
            });
            
            if (visaApp?.invoices && visaApp.invoices.length > 0) {
                invoice = { ...visaApp.invoices[0], visaApplication: visaApp } as any;
            }
        }

        if (!invoice) {
            return NextResponse.json({ error: "Invoice/Application record not found" }, { status: 404 });
        }

        // 2. Define Add-on Prices (Master Transactional Prices v8.24)
        const PRICES: Record<string, number> = {
            'ARRIVAL_CARD': 500000, 
            'IDIV': 325000,         
        };

        const addonPrice = PRICES[addonSku] || 0;

        if (addonPrice === 0) {
            return NextResponse.json({ error: "Invalid Addon SKU" }, { status: 400 });
        }

        // 3. Update Invoice Amounts
        const invoiceAny = invoice as any;
        const currentAddons = Number(invoiceAny.addonsAmount || 0);
        const newAddonsAmount = currentAddons + addonPrice;
        const newTotalAmount = Number(invoiceAny.amount) + addonPrice;

        // 4. Update Attribution to mark the upsell
        const currentAttribution = (invoiceAny.visaApplication?.attribution as any) || {};
        const currentUpsells = currentAttribution.upsells || {};
        
        const updatedAttribution = {
            ...currentAttribution,
            upsells: {
                ...(currentUpsells || {}),
                [addonSku === 'ARRIVAL_CARD' ? 'ac_ordered' : 'idiv_ordered']: true
            }
        };

        // 5. Execute Transaction
        await prisma.$transaction([
            prisma.invoice.update({
                where: { id: invoiceAny.id },
                data: {
                    addonsAmount: newAddonsAmount as any,
                    amount: newTotalAmount,
                    status: 'UNPAID' // Reset to unpaid so user pays the difference
                }
            }),
            prisma.visaApplication.update({
                where: { id: invoiceAny.applicationId! },
                data: {
                    attribution: updatedAttribution
                }
            })
        ]);

        return NextResponse.json({ 
            message: `${addonSku} successfully added to invoice.`,
            newTotal: newTotalAmount 
        });

    } catch (error: any) {
        console.error("ADD_ADDON_ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
