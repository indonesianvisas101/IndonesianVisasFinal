import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { IDivSystemFlow, DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Smartphone, Zap, Shield, Database } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How IDIV Works | System Architecture',
    description: 'An architectural deep dive into the IDIV verification and identity lifecycle.',
};

export default function SystemArchitecturePage() {
    return (
        <IDivDocLayout 
            title="How the Identity System Works"
            subtitle="Understanding the underlying architecture and verify flow of the IDIV platform."
        >
            <section>
                <p>
                    The IDIV system is built on a **Real-Time Verification Architecture**. Unlike static visa stamps, 
                    the IDIV protocol ensures that any query made against a traveler's identity returns the **absolute current state** of their legal stay.
                </p>
            </section>

            <section>
                <h2>The Verification Workflow</h2>
                <p>From initial issuance to field verification, the system maintains a secure chain of custody for traveler data.</p>
                <IDivSystemFlow />
            </section>

            <section>
                <h2>Technical Infrastructure</h2>
                <DocFeatures items={[
                    { 
                        icon: <Database size={24} />, 
                        title: "IDIV Core Engine", 
                        desc: "The central database mapping passport numbers, stay permits, and sponsor records." 
                    },
                    { 
                        icon: <Zap size={24} />, 
                        title: "Dynamic QR Logic", 
                        desc: "QR codes are cryptographically signed to prevent spoofing and redirect to secure HTTPS endpoints." 
                    },
                    { 
                        icon: <Smartphone size={24} />, 
                        title: "Mobile Optimization", 
                        desc: "The verification UI is designed for field use by officers using standard mobile browsers." 
                    },
                    { 
                        icon: <Shield size={24} />, 
                        title: "Immutable Logging", 
                        desc: "Every verification attempt is logged to ensure the security and privacy of the traveler." 
                    }
                ]} />
            </section>

            <section>
                <h2>Step-By-Step Logic</h2>
                <ol>
                    <li><strong>Data Synchronization:</strong> The system syncs with the Ministry of Law and Human Rights visa data.</li>
                    <li><strong>Identity Linkage:</strong> The visa is linked to the Agency's internal Sponsor Master Record.</li>
                    <li><strong>Edge Rendering:</strong> The Digital Twin is rendered at the edge for fast global access.</li>
                    <li><strong>Field Scan:</strong> An officer or partner scans the QR, initiating a secure handshake.</li>
                    <li><strong>Validation:</strong> The system returns a 'VALID', 'EXPIRED', or 'PENDING' status along with verified traveler photos.</li>
                </ol>
            </section>

            <section>
                <h2>Trust Framework</h2>
                <p>
                    The architecture prevents fraud by ensuring that the <strong>source of truth</strong> is always our secure server, 
                    never the physical card alone. If a traveler's visa is canceled, the QR code on their physical card will 
                    instantly return a <strong>NON-VALID</strong> status.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Does scanning require a special app?</strong> No. Any standard mobile camera or QR scanner can initiate the verification.</li>
                    <li><strong>How fast is verification?</strong> Typically less than 2 seconds depending on local network conditions.</li>
                    <li><strong>Can I use my IDIV at the airport?</strong> IDIV facilitates local entry, but you must always first present your original Passport and E-Visa to immigration officers.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
