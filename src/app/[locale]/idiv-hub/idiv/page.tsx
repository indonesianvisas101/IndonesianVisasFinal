import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { IDivSystemFlow, IDivStepGraphic, DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Shield, Zap, Globe, Users } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'IDIV Platform Overview | Digital Visa Identity',
    description: 'An overview of the Identity Indonesian Visas (IDIV) platform, the digital identity layer for travelers in Indonesia.',
};

export default function IdivOverviewPage() {
    return (
        <IDivDocLayout 
            title="IDIV Platform Overview"
            subtitle="The Digital Visa Identity Platform (IDIV) is the primary identity and sponsorship verification layer for the Indonesian Visas ecosystem."
        >
            <section>
                <p>
                    IDIV was developed to bridge the gap between physical travel documents and the digital requirements of modern Indonesia. 
                    It serves as a <strong>Digital Twin</strong> of a traveler's sponsorship and visa status, providing a secure, 
                    immutable reference for authorities, villa owners, and service providers.
                </p>
                <p>
                    Unlike a standard visa, which is a government-issued entry permit, IDIV is a <strong>facilitation and identity layer</strong> 
                    managed by the sponsoring agency to ensure compliance, safety, and instant verification throughout the duration of a traveler's stay.
                </p>
            </section>

            <section>
                <h2>System Lifecycle</h2>
                <p>The IDIV lifecycle begins the moment a traveler applies for sponsorship and continues until their departure from the archipelago.</p>
                <IDivSystemFlow />
            </section>

            <section>
                <h2>Core Functional Pillars</h2>
                <DocFeatures items={[
                    { 
                        icon: <Shield size={24} />, 
                        title: "Sponsorship Guarantee", 
                        desc: "Every IDIV record is linked to a verified PT Indonesian Visas Agency sponsorship record, ensuring legal accountability." 
                    },
                    { 
                        icon: <Zap size={24} />, 
                        title: "Instant Verification", 
                        desc: "Authorities can scan the IDIV QR code to receive real-time validity data, reducing wait times and friction." 
                    },
                    { 
                        icon: <Globe size={24} />, 
                        title: "Ecosystem Integration", 
                        desc: "Integrated with local partners (villas, rentals, coworking) to allow travelers to prove identity without revealing sensitive passport data." 
                    },
                    { 
                        icon: <Users size={24} />, 
                        title: "Multi-Stakeholder Access", 
                        desc: "Specific data views tailored for immigration, law enforcement, and private business partners." 
                    }
                ]} />
            </section>

            <section>
                <h2>The IDIV Digital Twin</h2>
                <p>
                    Every physical IDIV card issued corresponds to a live Digital Twin in our secure cloud infrastructure. 
                    When a physical card is presented, the QR code points to this live record, ensuring that even if a traveler's 
                    visa status changes (e.g., an extension is granted), the IDIV record reflects this change immediately without 
                    requiring a new physical card.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Is IDIV a replacement for my passport?</strong> No. IDIV is a supplementary identity document specific to your sponsorship and local activities.</li>
                    <li><strong>Who manages my IDIV data?</strong> Your data is managed by PT Indonesian Visas Agency under strict privacy protocols.</li>
                    <li><strong>Is IDIV mandatory?</strong> While not a government requirement, it is the standard for travelers sponsored by our agency to facilitate smooth local interactions.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
