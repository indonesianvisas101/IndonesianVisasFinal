import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures, IDivStepGraphic } from '@/components/idiv-hub/SharedComponents';
import { HardDrive, Server, Lock, Cpu } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Digital Visa Identity Platform | Technical Manual',
    description: 'Deep dive into the architecture, security, and governance of the IDIV platform.',
};

export default function PlatformExplanationPage() {
    return (
        <IDivDocLayout 
            title="Digital Visa Identity Platform"
            subtitle="A comprehensive guide to the technology stack and governance model powering the Indonesian Visas identity ecosystem."
        >
            <section>
                <p>
                    The Digital Visa Identity Platform (IDIV) is an enterprise-grade identity management system designed specifically 
                    for the Indonesian immigration landscape. It utilizes a <strong>Hybrid Identity Model</strong>—combining 
                    secure physical attributes with cloud-native verification logic.
                </p>
            </section>

            <section>
                <h2>System Capabilities</h2>
                <DocFeatures items={[
                    { 
                        icon: <HardDrive size={24} />, 
                        title: "Persistent Identity Storage", 
                        desc: "Your identity record persists across multiple visa cycles, mapping your entire history of legal stay." 
                    },
                    { 
                        icon: <Server size={24} />, 
                        title: "Cross-Departmental API", 
                        desc: "Provides restricted data access to law enforcement and immigration via secure encrypted endpoints." 
                    },
                    { 
                        icon: <Lock size={24} />, 
                        title: "Privacy-First Architecture", 
                        desc: "Handles sensitive metadata using zero-knowledge principles where possible to protect traveler PII." 
                    },
                    { 
                        icon: <Cpu size={24} />, 
                        title: "Automated Validity Logic", 
                        desc: "The system automatically flags expiring stay permits and sponsorship gaps in real-time." 
                    }
                ]} />
            </section>

            <section>
                <h2>Platform Governance</h2>
                <p>
                    Governance of the IDIV platform is strictly limited to <strong>PT Indonesian Visas Agency</strong> and its 
                    authorized legal partners. The platform follows a three-layer trust model:
                </p>
                <ul>
                    <li><strong>The Sovereign Layer:</strong> The Indonesian Government (Immigration/MOLHR) issues the underlying visa.</li>
                    <li><strong>The Sponsorship Layer:</strong> PT Indonesian Visas Agency provides the legal guarantee and data infrastructure.</li>
                    <li><strong>The User Layer:</strong> The traveler carries and presents the identity for local facilitation.</li>
                </ul>
            </section>

            <section>
                <h2>How the Protocol Functions</h2>
                <IDivStepGraphic steps={[
                    { title: "Registration", desc: "Biometric and passport data is ingested during the visa application phase." },
                    { title: "Verification", desc: "Our legal team verifies the authenticity of all submitted credentials." },
                    { title: "Issuance", desc: "The IDIV Digital Twin is minted and the unique Sponsor ID is assigned." },
                    { title: "Maintenance", desc: "The platform monitors visa expiry and automatically updates the IDIV status." }
                ]} />
            </section>

            <section>
                <h2>Standardization</h2>
                <p>
                    IDIV aims to standardize how foreigners are identified in Bali and across Indonesia. By providing a 
                    uniform format for sponsorship data, we reduce the burden on local authorities and service 
                    providers who otherwise must interpret varying government documents.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Is the system secure?</strong> Yes. We use 256-bit encryption for all data transmissions and bank-grade physical security for card production.</li>
                    <li><strong>Can a partner revoke my IDIV?</strong> No. Only the sponsoring agency can modify or revoke a traveler's IDIV status based on legal stay compliance.</li>
                    <li><strong>What happens if the system is offline?</strong> The physical card contains high-resolution micro-printing and visual markers for manual verification.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
