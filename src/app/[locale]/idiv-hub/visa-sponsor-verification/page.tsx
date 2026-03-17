import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Search, UserCheck, Shield, FileText } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sponsor Verification Process | IDIV Documentation',
    description: 'How to verify the authenticity of an IDIV visa sponsor.',
};

export default function VisaSponsorVerificationPage() {
    return (
        <IDivDocLayout 
            title="Visa Sponsor Verification"
            subtitle="The procedural roadmap for validating a traveler’s sponsorship status through the IDIV platform."
        >
            <section>
                <p>
                    **Sponsor Verification** is the process by which a third party (authority or partner) confirms that a 
                    traveler is actively and legally sponsored by PT Indonesian Visas Agency. This process is designed 
                    to be transparent, rapid, and evidence-based.
                </p>
            </section>

            <section>
                <h2>Verification Methods</h2>
                <DocFeatures items={[
                    { 
                        icon: <Search size={24} />, 
                        title: "ID Search", 
                        desc: "Entering the 10-digit Sponsor ID on the public verification portal." 
                    },
                    { 
                        icon: <UserCheck size={24} />, 
                        title: "Optical Scan", 
                        desc: "Using the camera of any mobile device to scan the physical card's QR code." 
                    },
                    { 
                        icon: <Shield size={24} />, 
                        title: "Auth Gateway", 
                        desc: "Direct verification for high-level partners through our secure API interface." 
                    },
                    { 
                        icon: <FileText size={24} />, 
                        title: "Physical Match", 
                        desc: "Comparing the details on the card against the traveler's passport for visual consistency." 
                    }
                ]} />
            </section>

            <section>
                <h2>What a Verified Status Proves</h2>
                <p>A "Status: VALID" result from the IDIV system confirms three critical facts:</p>
                <ul>
                    <li><strong>Guarantor Liability:</strong> PT Indonesian Visas Agency accepts full legal responsibility for the traveler's stay.</li>
                    <li><strong>Document Authenticity:</strong> The traveler's visa and stay permit have been cross-checked with government databases.</li>
                    <li><strong>Activity Compliance:</strong> The traveler is residing and operating within the designated areas approved by the sponsor.</li>
                </ul>
            </section>

            <section>
                <h2>Step-by-Step for Authorities</h2>
                <ol>
                    <li><strong>Identify the Traveler:</strong> Request the traveler's IDIV card or Sponsor ID.</li>
                    <li><strong>Initiate Verification:</strong> Scan the QR code or visit `indonesianvisas.com/idiv-search`.</li>
                    <li><strong>Confirm Photo:</strong> Ensure the high-resolution photo on the verification screen matches the traveler.</li>
                    <li><strong>Check Permit Date:</strong> Verify the 'Permit Expires' date is in the future.</li>
                    <li><strong>Log Interaction:</strong> (Optional) Use the 'Report Issue' button if the traveler's behavior is inconsistent with sponsorship rules.</li>
                </ol>
            </section>

            <section>
                <h2>Data Governance during Verification</h2>
                <p>
                    To protect traveler privacy, the standard verification view only shows names, photos, visa type, and 
                    validity dates. Sensitive data like Passport Numbers or Home Addresses are masked unless the 
                    verifier has high-level 'Authority' access credentials.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Can someone forge a verification screenshot?</strong> While a screenshot can be forged, the only valid verification is a **live refresh** of the official verification URL.</li>
                    <li><strong>What if the system returns 'NOT FOUND'?</strong> This usually happens if the traveler’s sponsorship has ended or if the ID was entered incorrectly. Contact the agency for manual lookup.</li>
                    <li><strong>Does verification cost anything?</strong> No. Public sponsorship verification is a free service provided for Indonesian security and partner trust.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
