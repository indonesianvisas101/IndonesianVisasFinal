import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures, IDivSystemFlow } from '@/components/idiv-hub/SharedComponents';
import { Building2, ShieldCheck, Users, Globe } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How Visa Sponsorship Works | IDIV Documentation',
    description: 'Understanding the legal and administrative framework of the IDIV sponsorship system.',
};

export default function VisaSponsorSystemPage() {
    return (
        <IDivDocLayout 
            title="Visa Sponsor System Explained"
            subtitle="An in-depth look at the legal guarantee and administrative structure of the IDIV sponsorship framework."
        >
            <section>
                <p>
                    In Indonesia, sponsorship is the bedrock of the visa system. Every foreign traveler (with very few exceptions) 
                    must have a legal sponsor who acts as their guarantor for the duration of their stay. The **IDIV Platform** 
                    is the digital manifestation of this sponsorship, providing a transparent link between the traveler 
                    and the guarantor.
                </p>
            </section>

            <section>
                <h2>The Role of the Sponsor</h2>
                <DocFeatures items={[
                    { 
                        icon: <Building2 size={24} />, 
                        title: "Legal Guarantee", 
                        desc: "The sponsor accepts full legal responsibility for the traveler's behavior and financial obligations in the country." 
                    },
                    { 
                        icon: <ShieldCheck size={24} />, 
                        title: "Regulatory Compliance", 
                        desc: "The sponsor must ensure the traveler stays within the boundaries of their visa type and reports any address changes." 
                    },
                    { 
                        icon: <Users size={24} />, 
                        title: "Service Facilitation", 
                        desc: "Provides a professional point of contact for authorities and local businesses interacting with the traveler." 
                    },
                    { 
                        icon: <Globe size={24} />, 
                        title: "Ecosystem Trust", 
                        desc: "Bridges the gap between foreign visitors and Indonesian institutions through a verified identity layer." 
                    }
                ]} />
            </section>

            <section>
                <h2>Sponsorship Lifecycle</h2>
                <p>Understanding how sponsorship is initiated, maintained, and concluded:</p>
                <IDivSystemFlow />
            </section>

            <section>
                <h2>Who Can Be a Sponsor?</h2>
                <p>
                    While individuals and other companies can be sponsors, **PT Indonesian Visas Agency** is a specialized 
                    legal entity authorized by the Ministry of Law and Human Rights to provide institutional sponsorship. 
                    Institutional sponsorship through IDIV offers a higher level of trust and professional accountability 
                    than individual sponsorship.
                </p>
            </section>

            <section>
                <h2>The Accountability Chain</h2>
                <ol>
                    <li><strong>Application:</strong> The traveler provides documentation to the agency.</li>
                    <li><strong>Due Diligence:</strong> The agency verifies the traveler's background and records.</li>
                    <li><strong>Sponsorship Acceptance:</strong> The agency issues a legal guarantee to Indonesian Immigration.</li>
                    <li><strong>IDIV Issuance:</strong> The identity platform is activated, providing a digital token of this legal bond.</li>
                    <li><strong>Continuous Monitoring:</strong> The agency monitors code-of-conduct and stay permit validity via IDIV.</li>
                </ol>
            </section>

            <section>
                <h2>Governance Standards</h2>
                <p>
                    IDIV sponsorship follows a strict code of ethics. We do not provide sponsorship for activities that 
                    violate Indonesian law, compromise local culture, or threaten national security. The IDIV identity 
                    is a mark of a traveler who has committed to respecting these values.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Can I have more than one sponsor?</strong> No. In the Indonesian system, you have exactly one legal sponsor at a time who is responsible for your stay permit.</li>
                    <li><strong>How do I change my sponsor?</strong> You must first terminate your current sponsorship and apply for a 'Sponsor Change' with immigration, after which a new IDIV would be issued by your new sponsor.</li>
                    <li><strong>What happens if my sponsor goes out of business?</strong> If your sponsor loses their legal status, your visa becomes invalid. IDIV institutional sponsorship protects you from this risk.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
