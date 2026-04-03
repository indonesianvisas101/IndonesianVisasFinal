import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendConfirmationEmail, sendAdminOrderNotification } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            companyName,
            kbliCodes,
            address,
            equityCapital,
            depositedCapital,
            stakeholders,
            applicantName,
            applicantEmail,
            applicantPhone,
            taxDetails,
            documents
        } = body;

        // 1. Create Company Formation Record
        const formation = await prisma.companyFormation.create({
            data: {
                companyName,
                kbliCodes,
                address,
                equityCapital: parseFloat(equityCapital),
                depositedCapital: parseFloat(depositedCapital),
                stakeholders,
                applicantName,
                applicantEmail,
                applicantPhone,
                taxDetails,
                documents,
                logs: JSON.stringify([{
                    action: "SUBMITTED",
                    timestamp: new Date().toISOString(),
                    note: "Initial formation request submitted by user."
                }])
            }
        });

        // 2. Generate Invoice (Default Fee)
        const defaultFee = 15000000; // 15 million IDR
        const invoiceId = `INV-${Date.now()}`;
        
        // Update formation with invoiceId
        await prisma.companyFormation.update({
            where: { id: formation.id },
            data: { invoiceId: invoiceId }
        });

        // 3. Send Auto-Email to Applicant
        await sendConfirmationEmail(applicantEmail, {
            applicantName,
            visaType: `PT PMA Formation (${companyName})`,
            invoiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoiceId}`,
            orderId: formation.id,
        });

        // 4. Send Notification to Admin
        await sendAdminOrderNotification({
            orderType: "COMPANY_FORMATION",
            applicantName,
            applicantEmail,
            visaType: `PT PMA Formation - ${companyName}`,
            amount: `Rp ${defaultFee.toLocaleString('id-ID')}`,
            invoiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin/company-formation?id=${formation.id}`,
            details: `KBLI: ${Array.isArray(kbliCodes) ? kbliCodes.map((k: any) => k.code === "CUSTOM" ? k.name : k.code).join(', ') : 'None'}\nCapital: Rp ${parseFloat(equityCapital).toLocaleString('id-ID')}`
        });

        return NextResponse.json({
            success: true,
            id: formation.id,
            invoiceId: invoiceId
        });

    } catch (error) {
        console.error("[COMPANY_FORMATION_POST]", error);
        return NextResponse.json({
            success: false,
            message: "Failed to process formation request"
        }, { status: 500 });
    }
}
