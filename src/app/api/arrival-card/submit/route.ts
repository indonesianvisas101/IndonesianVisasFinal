import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { calculateOrderFees } from '@/utils/feeCalculator';

export async function POST(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        // Initialize Supabase admin client for backend operations
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const formData = await req.formData();
        const jsonString = formData.get('data') as string;

        if (!jsonString) {
            return NextResponse.json({ error: "Missing form data payload" }, { status: 400 });
        }

        const data = JSON.parse(jsonString);

        // 1. Handle File Upload (Optional)
        const file = formData.get('document') as File | null;
        let documentUrl = null;

        if (file) {
            const fileBuffer = await file.arrayBuffer();
            const fileName = `arrival_cards/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, fileBuffer, {
                    contentType: file.type,
                    upsert: false
                });

            if (uploadError) {
                console.error("Supabase Storage Upload Error:", uploadError);
                return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
            }

            const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(fileName);
            documentUrl = publicUrlData.publicUrl;
        }

        // 2. Fetch Pricing for Arrival Card Addon
        const addon = await prisma.addon.findFirst({
            where: { 
                OR: [
                    { sku: 'ARRIVAL_CARD' },
                    { name: { contains: 'Arrival Card', mode: 'insensitive' } }
                ],
                isActive: true
            }
        });

        const basePrice = addon ? Number(addon.price) : 50000; // Fallback to 50k if not found

        // 3. Create Application & Invoice (Sync with Dashboard)
        const userId = data.userId || null;
        const applicationId = crypto.randomUUID();
        const namePart = (data.fullName || "Guest").split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomPart = crypto.randomBytes(2).toString('hex');
        const slug = `${namePart}-${randomPart}-ecd`;

        // Calculate Fees
        const { serviceFee, gatewayFee, pph23Amount, totalAmount } = calculateOrderFees(basePrice, 'Manual', 0);

        // Transaction for all records
        const result = await prisma.$transaction(async (tx) => {
            // A. Create Arrival Card Record
            const arrivalCard = await tx.arrivalCard.create({
                data: {
                    userId: userId,
                    passportNumber: data.passportNumber || "UNKNOWN",
                    fullName: data.fullName || "UNKNOWN",
                    arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : new Date(),
                    flightNumber: data.flightNumber || null,
                    status: "PENDING",
                    formData: data,
                    documentUrl: documentUrl
                }
            });

            // B. Create Visa Application Record (Visible in Dashboard)
            const application = await tx.visaApplication.create({
                data: {
                    id: applicationId,
                    userId: userId,
                    visaId: 'ecd',
                    visaName: 'ARRIVAL CARD',
                    status: 'Apply to Agent',
                    guestName: data.fullName,
                    guestEmail: data.email,
                    slug: slug,
                    attribution: {
                        country: data.nationality,
                        arrivalDate: data.arrivalDate,
                        phone: `${data.phoneCode}${data.phoneNumber}`,
                        passport: data.passportNumber,
                        internalNotes: `Direct Purchase from Hero CTA. Arrival Card ID: ${arrivalCard.id}`
                    }
                }
            });

            // C. Create Invoice
            const invoice = await tx.invoice.create({
                data: {
                    id: slug,
                    userId: userId,
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
                    adminNotes: `Indonesian e-CD Arrival Card Processing for ${data.fullName}`,
                }
            });

            return { arrivalCard, application, invoice };
        });

        // 4. Create Notification
        await prisma.notification.create({
            data: {
                userId: null,
                title: "New Arrival Card Order",
                message: `${data.fullName} has ordered an Arrival Card. Direct payment pending.`,
                type: "info",
                actionLink: `/admin?tab=invoicing`,
                actionText: "Manage Invoice"
            }
        });

        // 5. Dispatch Email (Optional)
        // ... (existing email logic can be kept)

        return NextResponse.json({ 
            success: true, 
            arrivalCardId: result.arrivalCard.id,
            invoiceId: result.invoice.id,
            slug: slug
        });

    } catch (error: any) {
        console.error("Arrival Card Submission Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
