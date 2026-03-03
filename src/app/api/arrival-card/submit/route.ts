import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

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

        // 1. Handle File Upload (Optional: If the user attached a passport or ticket)
        const file = formData.get('document') as File | null;
        let documentUrl = null;

        if (file) {
            const fileBuffer = await file.arrayBuffer();
            const fileName = `arrival_cards/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('documents') // Assuming a 'documents' bucket exists
                .upload(fileName, fileBuffer, {
                    contentType: file.type,
                    upsert: false
                });

            if (uploadError) {
                console.error("Supabase Storage Upload Error:", uploadError);
                return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
            }

            // Get public URL
            const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(fileName);
            documentUrl = publicUrlData.publicUrl;
        }

        // 2. Save to Database via Prisma
        // Fallback to "Pending" userId if anonymous, otherwise attach to session if passed
        const userId = data.userId || null;

        const arrivalCard = await prisma.arrivalCard.create({
            data: {
                userId: userId,
                passportNumber: data.passportNumber || "UNKNOWN",
                fullName: data.fullName || "UNKNOWN",
                arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : new Date(),
                flightNumber: data.flightNumber || null,
                status: "PENDING",
                formData: data, // Save the entire raw JSON payload
                documentUrl: documentUrl
            }
        });

        // 3. Create Admin Dashboard Notification
        await prisma.notification.create({
            data: {
                userId: null, // Targeting Admins
                title: "New Arrival Card Submitted",
                message: `${data.fullName} (${data.passportNumber}) has submitted an e-CD Arrival Card for flight ${data.flightNumber || 'N/A'}.`,
                type: "info",
                actionLink: "/admin?tab=verification",
                actionText: "Review Card"
            }
        });

        // 4. Dispatch Email to damnbayu@gmail.com (Using Resend API if configured, otherwise console log for now)
        try {
            const resendApiKey = process.env.RESEND_API_KEY;
            if (resendApiKey) {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Indonesian Visas <onboarding@resend.dev>', // Update with verified domain
                        to: ['damnbayu@gmail.com'],
                        subject: `New Arrival Card: ${data.fullName}`,
                        html: `
                            <h2>New Arrival Card Submitted</h2>
                            <p><strong>Name:</strong> ${data.fullName}</p>
                            <p><strong>Passport:</strong> ${data.passportNumber}</p>
                            <p><strong>Arrival Date:</strong> ${data.arrivalDate}</p>
                            <p><strong>Flight:</strong> ${data.flightNumber}</p>
                            <p><a href="https://indonesianvisas.com/admin?tab=verification">View in Admin Dashboard</a></p>
                            ${documentUrl ? `<p><a href="${documentUrl}">View Attached Document</a></p>` : ''}
                        `
                    })
                });
            } else {
                console.warn("RESEND_API_KEY not found. Skipping email notification to damnbayu@gmail.com");
            }
        } catch (emailError) {
            console.error("Email dispatch failed:", emailError);
            // Don't fail the whole request if email fails, DB is more important
        }

        return NextResponse.json({ success: true, arrivalCardId: arrivalCard.id });

    } catch (error: any) {
        console.error("Arrival Card Submission Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
