import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Lock, ShieldCheck, Eye, Cpu } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Visa Identity Security | IDIV Documentation',
    description: 'Deep dive into the security layers protecting the IDIV identity ecosystem.',
};

export default function IdentitySecurityPage() {
    return (
        <IDivDocLayout 
            title="Visa Identity Security"
            subtitle="The IDIV platform utilizes a multi-layered security architecture to protect traveler data and ensure verification integrity."
        >
            <section>
                <p>
                    Security is the foundation of the IDIV platform. We recognize that an identity system is only as 
                    trustworthy as the measures taken to protect its data. The IDIV protocol implements security 
                    at every level—from the physical PVC card to the backend cryptographic processing.
                </p>
            </section>

            <section>
                <h2>Security Architecture Layers</h2>
                <DocFeatures items={[
                    { 
                        icon: <Cpu size={24} />, 
                        title: "Cryptographic Signing", 
                        desc: "Every verification URL is signed with a unique token, making 'URL guessing' statistically impossible." 
                    },
                    { 
                        icon: <ShieldCheck size={24} />, 
                        title: "Biometric Data Linkage", 
                        desc: "Records are tethered to the traveler's bio-photo and passport data, preventing identity borrowing." 
                    },
                    { 
                        icon: <Eye size={24} />, 
                        title: "Visual Scrutiny Markers", 
                        desc: "Physical cards feature micro-printing and layering that are difficult to reproduce with standard printers." 
                    },
                    { 
                        icon: <Lock size={24} />, 
                        title: "Encrypted Transmission", 
                        desc: "All data exchanged between the scanning device and our portal is protected by TLS 1.3 encryption." 
                    }
                ]} />
            </section>

            <section>
                <h2>Digital Twin Protection</h2>
                <p>
                    Every IDIV record exists as a **Digital Twin** in an air-gapped secure environment. When a verification 
                    is initiated, the system generates a **temporary verification view**. This means the verifier 
                    doesn't gain direct access to our database, but rather a secure, read-only snapshot of the 
                    traveler's current status.
                </p>
            </section>

            <section>
                <h2>Anti-Tamper Logic</h2>
                <p>
                    The platform monitors for "Suspect Scans"—scans occurring at unusual frequencies, from flagged IP 
                    addresses, or using modified mobile browsers. If the system detects a potential breach or brute-force 
                    attempt, it instantly disables the specific identity record and alerts our internal security team.
                </p>
            </section>

            <section>
                <h2>Data Privacy & Masking</h2>
                <p>
                    We follow the principle of **Least Privilege**. A public verifier (like a villa owner) only sees the 
                    minimum data required to verify a traveler. Personal details such as the traveler's home address, 
                    email, or specific financial data are masked and never exposed through the public verification portal.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Where is my data stored?</strong> We utilize world-class data centers in Singapore and Jakarta, ensuring low latency and high regional security compliance.</li>
                    <li><strong>What happens if someone scans my card while I sleep?</strong> Every scan is logged. You can review your "Scan History" in your traveler dashboard and report any unauthorized activity.</li>
                    <li><strong>Can I use a VPN while scanning?</strong> Yes, but some highly anonymous VPNs may trigger our security filters, requiring a secondary verification challenge.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
