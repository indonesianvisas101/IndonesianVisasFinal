import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { CreditCard, Eye, Shield, Cpu } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Visa Identity Card | Physical Hardware',
    description: 'Detailed specifications of the physical IDIV Visa Identity Card.',
};

export default function VisaIdentityCardPage() {
    return (
        <IDivDocLayout 
            title="Visa Identity Card"
            subtitle="The physical manifest of your digital identity, designed for durability and high-security verification."
        >
            <section>
                <p>
                    The **IDIV Visa Identity Card** is a high-grade PVC card issued to all travelers sponsored by PT Indonesian Visas Agency. 
                    While the platform is digital-first, the physical card remains a critical tool for field interaction where 
                    immediate visual trust is required.
                </p>
            </section>

            <section>
                <h2>Physical & Security Attributes</h2>
                <DocFeatures items={[
                    { 
                        icon: <CreditCard size={24} />, 
                        title: "Durable Build", 
                        desc: "Constructed from 30mil PVC with a scratch-resistant protective overlay for tropical environments." 
                    },
                    { 
                        icon: <Eye size={24} />, 
                        title: "Visual Markers", 
                        desc: "Includes traveler photo, full name, and the unique 10-digit Sponsor ID for manual entry." 
                    },
                    { 
                        icon: <Shield size={24} />, 
                        title: "Anti-Counterfeit QR", 
                        desc: "The QR code is rendered with high-contrast precision and linked to a SSL-secured verification portal." 
                    },
                    { 
                        icon: <Cpu size={24} />, 
                        title: "Digital Twin Sync", 
                        desc: "A built-in reference that allows the physical card to 'update' its status via the cloud." 
                    }
                ]} />
            </section>

            <section>
                <h2>The Frontside Layout</h2>
                <p>The card is designed for maximum legibility by authorities:</p>
                <ul>
                    <li><strong>Header:</strong> Official Agency Branding and "Identity Indonesian Visas" title.</li>
                    <li><strong>Primary ID:</strong> Your unique Sponsor ID centered for easy reading.</li>
                    <li><strong>Personal Data:</strong> Photo, Full Name (per passport), and Nationality.</li>
                    <li><strong>Visa Class:</strong> The specific visa type currently held (e.g., B211A, C317).</li>
                </ul>
            </section>

            <section>
                <h2>The Backside Layout</h2>
                <p>Focused on verification and emergency contact:</p>
                <ul>
                    <li><strong>Verification QR:</strong> Large, scannable code for instant status checks.</li>
                    <li><strong>Instructions:</strong> Short guide for authorities on how to verify.</li>
                    <li><strong>Emergency Contact:</strong> 24/7 Agency support number for sponsorship confirmation.</li>
                    <li><strong>Legal Disclaimer:</strong> Standard text clarifying that the card is a sponsorship facilitating document.</li>
                </ul>
            </section>

            <section>
                <h2>Handling & Care</h2>
                <p>
                    Your IDIV card should be treated with the same care as a credit card. Avoid prolonged exposure to extreme 
                    heat or direct sunlight, which may damage the PVC over time. If your card is lost or stolen, report it 
                    immediately through your digital dashboard to deactivate the QR verification link.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Can I laminate my card?</strong> No. The card is already professionally laminated and adding additional layers may interfere with QR scannability.</li>
                    <li><strong>Is there an NFC chip inside?</strong> Selected premium versions of the IDIV card include an NFC chip for 'tap-to-verify' functionality.</li>
                    <li><strong>How long does it take to issue a new card?</strong> Re-issuance typically takes 3-5 business days plus shipping.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
