import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

/**
 * DOKU (Jokul) Checkout API Implementation
 * Flow:
 * 1. Receive invoiceId and customer details.
 * 2. Generate Signature (HMAC-SHA256).
 * 3. Call DOKU Checkout API.
 * 4. Return payment URL.
 */

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { invoiceId, amount, customerDetails } = body;

        if (!invoiceId || !amount || !customerDetails) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const clientId = process.env.NEXT_PUBLIC_DOKU_CLIENT_ID;
        const secretKey = process.env.DOKU_SECRET_KEY;
        const isProduction = process.env.NEXT_PUBLIC_DOKU_IS_PRODUCTION === 'true';

        if (!clientId || !secretKey) {
            return NextResponse.json({ error: "DOKU configuration missing" }, { status: 500 });
        }

        const baseUrl = isProduction 
            ? 'https://api.doku.com' 
            : 'https://api-sandbox.doku.com';
        
        const targetPath = '/checkout/v1/payment';
        const requestId = crypto.randomBytes(16).toString('hex');
        const timestamp = new Date().toISOString().split('.')[0] + 'Z';

        // Sanitize phone number (remove all non-digit characters)
        const rawPhone = customerDetails.phone || "";
        const sanitizedPhone = rawPhone.replace(/\D/g, '');

        // DOKU requires phone to be 5-16 digits
        // Fallback for missing/too short phone
        let finalPhone = sanitizedPhone;
        if (sanitizedPhone.length < 5) {
            console.warn(`[DOKU] Phone too short (${sanitizedPhone}), using fallback.`);
            finalPhone = "628123456789"; // Fallback placeholder
        } else if (sanitizedPhone.length > 16) {
            finalPhone = sanitizedPhone.slice(0, 16);
        }

        // Validate and Fallback Name
        const combinedName = [customerDetails.first_name, customerDetails.last_name].filter(Boolean).join(' ').trim();
        const rawName = customerDetails.name?.trim() || combinedName;
        const finalName = rawName.length > 0 ? rawName.substring(0, 50) : "Guest Applicant";

        // Validate and Fallback Email
        const rawEmail = customerDetails.email?.trim() || "";
        const finalEmail = rawEmail.includes('@') ? rawEmail.substring(0, 50) : "no-reply@indonesianvisas.com";

        // Prepare Request Body
        const requestBody = {
            order: {
                amount: Math.round(Number(amount)),
                invoice_number: invoiceId,
                currency: "IDR",
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com'}/thanks`,
                line_items: [
                    {
                        name: "Visa / Corporate Service",
                        price: Math.round(Number(amount)),
                        quantity: 1
                    }
                ]
            },
            payment: {
                payment_due_date: 60 // Required by DOKU Jokul Checkout V1 API
            },
            customer: {
                name: finalName,
                email: finalEmail,
                phone: finalPhone
            }
        };

        // Generate Digest
        const jsonBody = JSON.stringify(requestBody);
        const digest = crypto.createHash('sha256').update(jsonBody).digest('base64');

        // Signature Components: Client-Id + Request-Id + Request-Timestamp + Request-Target + Digest
        const signaturePayload = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${targetPath}\nDigest:${digest}`;
        const signature = crypto.createHmac('sha256', secretKey).update(signaturePayload).digest('base64');

        // Call DOKU API
        console.log(`DOKU Request [${requestId}]:`, { url: `${baseUrl}${targetPath}`, headers: { 'Client-Id': clientId, 'Request-Id': requestId }, body: requestBody });

        const dokuRes = await fetch(`${baseUrl}${targetPath}`, {
            method: 'POST',
            headers: {
                'Client-Id': clientId,
                'Request-Id': requestId,
                'Request-Timestamp': timestamp,
                'Signature': `HMACSHA256=${signature}`,
                'Content-Type': 'application/json'
            },
            body: jsonBody
        });

        let dokuData;
        const respText = await dokuRes.text();
        try {
            dokuData = JSON.parse(respText);
        } catch (e) {
            console.error("DOKU Returned Non-JSON:", respText);
            return NextResponse.json({ error: `DOKU Gateway Error (${dokuRes.status}): Check Sandbox/Production ENV keys.` }, { status: dokuRes.status });
        }

        console.log(`DOKU Response [${requestId}]:`, { status: dokuRes.status, data: dokuData });

        if (!dokuRes.ok) {
            console.error("DOKU API Error Details:", JSON.stringify(dokuData, null, 2));
            return NextResponse.json({ 
                error: dokuData.error?.message || dokuData.message || "DOKU API Error",
                details: dokuData 
            }, { status: dokuRes.status });
        }

        const paymentUrl = dokuData.response.payment.url;

        // NEW: Trigger Payment Reminder Email
        try {
            const { sendPaymentReminderEmail } = await import('@/lib/email');
            
            // Fetch application name/visa for the email
            const invoice = await prisma.invoice.findUnique({
                where: { id: invoiceId }
            });

            if (invoice?.applicationId) {
                const application = await prisma.visaApplication.findUnique({
                    where: { id: invoice.applicationId }
                });

                if (application) {
                    await sendPaymentReminderEmail(customerDetails.email, {
                        applicantName: customerDetails.name || `${customerDetails.first_name} ${customerDetails.last_name}`,
                        visaType: application.visaName || 'Indonesian Visa',
                        amount: `IDR ${Number(amount).toLocaleString('id-ID')}`,
                        paymentUrl: paymentUrl
                    });
                }
            }
        } catch (e) {
            console.error("[DOKU Checkout] Failed to send reminder email:", e);
        }

        return NextResponse.json({ 
            paymentUrl,
            orderId: requestId // Unique ID per payment attempt
        });

    } catch (error: any) {
        console.error("DOKU Checkout Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
