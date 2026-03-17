import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Building, Users, Shield, Zap } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'IDIV for Business & Meetings | Professional Context',
    description: 'Using your digital identity to facilitate professional and business interactions in Indonesia.',
};

export default function BusinessMeetingsGuidePage() {
    return (
        <IDivDocLayout 
            title="Using Sponsor ID for Business Meetings"
            subtitle="Facilitate professional trust and streamline entry to corporate offices and coworking spaces."
        >
            <section>
                <p>
                    In a professional context, first impressions and **verification of intent** are paramount. 
                    For business travelers operating on B211A, C2, or KITAS visas, the IDIV card serves as a 
                    formal credential that establishes your professional standing and legal sponsorship status 
                    before a meeting even begins.
                </p>
            </section>

            <section>
                <h2>Benefits for Business Travelers</h2>
                <DocFeatures items={[
                    { 
                        icon: <Building size={24} />, 
                        title: "Corporate Entry", 
                        desc: "Streamline security registration at high-rise offices and secure industrial sites." 
                    },
                    { 
                        icon: <Users size={24} />, 
                        title: "Partner Confidence", 
                        desc: "Show your Indonesian partners that you are professionally sponsored by a reputable national agency." 
                    },
                    { 
                        icon: <Shield size={24} />, 
                        title: "Legal Transparency", 
                        desc: "Instantly prove you are on a specific 'Business' visa category, appropriate for the meeting type." 
                    },
                    { 
                        icon: <Zap size={24} />, 
                        title: "ID Efficiency", 
                        desc: "Avoid handing over your passport to security guards at corporate building lobbies." 
                    }
                ]} />
            </section>

            <section>
                <h2>Use in Coworking Spaces</h2>
                <p>
                    Co-working management in Bali and Jakarta often requires proof of a valid visa to comply with 
                    local zoning and immigration laws. Instead of providing complex government PDFs, 
                    presenting your IDIV card allows the management to verify your status in seconds, 
                    ensuring that you are working legally within the terms of your sponsorship.
                </p>
            </section>

            <section>
                <h2>Corporate Registration Workflow</h2>
                <ol>
                    <li><strong>Building Security:</strong> Present your IDIV card at the lobby security desk.</li>
                    <li><strong>Verification:</strong> The security staff can scan the back of the card to log your entry and verify your visa class.</li>
                    <li><strong>Professional Introduction:</strong> Share your IDIV Digital Reference with your business partners as part of your KYC (Know Your Customer) introduction.</li>
                    <li><strong>Meeting Compliance:</strong> Ensure your sponsorship record is live for the duration of any long-term project or investment cycle.</li>
                </ol>
            </section>

            <section>
                <h2>Trust for Local Notaries & Legal Counsel</h2>
                <p>
                    When meeting with local notaries for company formation (PT PMA), having a verified IDIV identity 
                    helps establish your clear legal footprint. It provides the notary with a verified bio-link to your 
                    current sponsorship data, ensuring that all legal documents are matched to your correct 
                    and active visa status.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Does IDIV replace a business card?</strong> No, but it is a perfect 'Legal Sidekick' to your business card, providing the trust layer that a standard business card lacks.</li>
                    <li><strong>Should I show my IDIV to government officials in meetings?</strong> Yes. If a government official asks for your identity, the IDIV card is the most professional way to present your sponsorship and current stay permit.</li>
                    <li><strong>Can my company get IDIV for all employees?</strong> Yes. We provide corporate-managed identity batches for companies sponsoring multiple foreign experts.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
