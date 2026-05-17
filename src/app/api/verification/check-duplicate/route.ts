import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { passportNumber, dob } = body;

        if (!passportNumber) {
            return NextResponse.json({ error: "Passport number is required" }, { status: 400 });
        }

        const sanitizedPassport = passportNumber.trim().toUpperCase();

        const matches = await prisma.verification.findMany({
            where: {
                passportNumber: {
                    equals: sanitizedPassport,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                slug: true,
                fullName: true,
                address: true
            }
        });

        if (matches.length === 0) {
            return NextResponse.json({ duplicate: false });
        }

        const extractDigits = (str: string) => {
            if (!str) return "";
            const matched = str.match(/\d{2}-\d{2}-\d{4}|\d{4}-\d{2}-\d{2}/);
            if (matched) return matched[0].replace(/\D/g, '');
            return str.replace(/\D/g, '');
        };

        const targetDobClean = dob ? dob.replace(/\D/g, '') : "";

        for (const m of matches) {
            let recordDob = "";
            
            if (m.address && m.address.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(m.address);
                    recordDob = parsed.birthPlaceDate || parsed.BIRTHPLACEDATE || parsed.dob || parsed.DOB || recordDob;
                } catch {}
            }

            const recordDobClean = extractDigits(recordDob);
            
            if (
                (targetDobClean && recordDobClean && (recordDobClean.includes(targetDobClean) || targetDobClean.includes(recordDobClean))) ||
                !targetDobClean || !recordDobClean
            ) {
                return NextResponse.json({
                    duplicate: true,
                    slug: m.slug,
                    fullName: m.fullName,
                    message: "A visa profile with this passport number already exists."
                });
            }
        }

        return NextResponse.json({ duplicate: false });
    } catch (error: any) {
        console.error("Duplicate check error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
