import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { IDivStepGraphic } from '@/components/idiv-hub/SharedComponents';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Verification Guide for Partners | IDIV Platform',
    description: 'A step-by-step guide for partners and authorities on how to verify an IDIV sponsor.',
};

export default function HowToVerifySponsorPage() {
    return (
        <IDivDocLayout 
            title="How to Verify a Visa Sponsor"
            subtitle="An operational guide for authorities, landlords, and business partners wishing to validate a traveler’s sponsorship."
        >
            <section>
                <p>
                    Verifying a traveler's sponsorship is a critical step in local due diligence. Whether you are 
                    renting a villa, a vehicle, or conducting business, follow these steps to ensure you are 
                    dealing with a legally sponsored individual.
                </p>
            </section>

            <section>
                <h2>Step-by-Step Operator Guide</h2>
                <IDivStepGraphic steps={[
                    { title: "Physical Check", desc: "Request the IDIV card and ensure it belongs to the individual presenting it." },
                    { title: "QR Scan", desc: "Open your mobile camera and scan the code on the back of the card." },
                    { title: "Live Validation", desc: "Wait for the official indonesianvisas.com verification page to load." },
                    { title: "Status Sync", desc: "Match the 'VALID' status and photo against the person in front of you." }
                ]} />
            </section>

            <section>
                <h2>Identifying "Valid" vs "Invalid" States</h2>
                <p>Knowing how to interpret the results is key to safe operation:</p>
                <ul>
                    <li><strong className="text-green-600">VALID:</strong> Sponsorship is active. You may proceed with the transaction.</li>
                    <li><strong className="text-orange-500">PENDING EXTENSION:</strong> Visa has expired but the extension is in process. Verify the 'Submission Date'.</li>
                    <li><strong className="text-red-600">INVALID / EXPIRED:</strong> The traveler has no current sponsor. Do not proceed with high-risk transactions (e.g., expensive rentals).</li>
                </ul>
            </section>

            <section>
                <h2>Pro-Tips for Field Officers</h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                    <div className="flex gap-4 mb-3">
                        <CheckCircle2 className="text-primary" />
                        <h4 className="font-bold">Check the URL</h4>
                    </div>
                    <p className="text-sm">Always Ensure the URL starts with <strong>indonesianvisas.com</strong>. Do not trust verification screens served from unknown domains.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex gap-4 mb-3">
                        <AlertCircle className="text-red-500" />
                        <h4 className="font-bold">Photo Verification</h4>
                    </div>
                    <p className="text-sm">Always compare the bio-photo on the screen with the traveler. IDIV cards cannot be shared or transferred.</p>
                </div>
            </section>

            <section>
                <h2>What to do in Case of Failure</h2>
                <p>
                    If the system fails to return a result or returns an error:
                </p>
                <ol>
                    <li>Ask for the traveler's Passport number and try a manual search at `idiv-search`.</li>
                    <li>Check your internet connection; the system requires a live handshake.</li>
                    <li>Contact our 24/7 Agency Hotline (Found on the back of all cards) for a manual sponsorship check.</li>
                </ol>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><HelpCircle size={16} className="inline mr-1" /> <strong>How do I know the QR code isn't fake?</strong> A fake QR code will either fail to scan or take you to a fake website. Always verify you are on the official indonesianvisas.com domain.</li>
                    <li><HelpCircle size={16} className="inline mr-1" /> <strong>Can I verify multiple people at once?</strong> Currently, the system handles one verification per scan to ensure data integrity and focus.</li>
                    <li><HelpCircle size={16} className="inline mr-1" /> <strong>Do I need a username/password?</strong> Public verification is open and does not require credentials. High-level partners are provided with specific login access for deeper records.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
