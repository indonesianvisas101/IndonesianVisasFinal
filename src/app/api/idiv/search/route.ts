import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('id');

        if (!query) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // Search in Invoices, Applications, and Verifications
        // For security, we only return non-sensitive verified status data
        
        const [invoice, application, verification] = await Promise.all([
            prisma.invoice.findUnique({
                where: { id: query }
            }),
            prisma.visaApplication.findUnique({
                where: { id: query }
            }),
            prisma.verification.findUnique({
                where: { id: query }
            })
        ]);

        if (!invoice && !application && !verification) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        // Normalize the response
        const result = {
            id: query,
            name: verification?.fullName || application?.guestName || "Verified Guest",
            visa_type: verification?.visaType || application?.visaName || "Tourist Visa",
            status: verification?.status || application?.status || (invoice?.status === 'PAID' ? 'Review by Agent' : 'Payment Pending'),
            expiry_date: verification?.expiresAt ? new Date(verification.expiresAt).toLocaleDateString() : 'TBA',
            issue_date: verification?.issuedDate ? new Date(verification.issuedDate).toLocaleDateString() : (application?.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'),
            sponsor: "INDONESIAN VISAS AGENCY",
            verified: !!verification
        };

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("[IDIV_SEARCH_API]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
