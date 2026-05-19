import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, paymentProofUrl, status } = body;

        if (!id || !paymentProofUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createAdminClient();
        
        // Fetch existing application
        const { data: app, error: fetchError } = await supabase
            .from('applications')
            .select('attribution')
            .eq('id', id)
            .single();
            
        if (fetchError || !app) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        const updatedAttribution = {
            ...app.attribution,
            paymentProofUrl
        };

        const { error: updateError } = await supabase
            .from('applications')
            .update({ 
                attribution: updatedAttribution,
                status: status || 'PENDING VERIFICATION',
                paymentMethod: 'Manual'
            })
            .eq('id', id);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({ message: "Payment proof submitted successfully" });
    } catch (error: any) {
        console.error("Submit proof error:", error);
        return NextResponse.json({ error: "Failed to submit payment proof" }, { status: 500 });
    }
}
