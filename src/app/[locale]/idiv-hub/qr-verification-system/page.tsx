import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures, IDivQrExample } from '@/components/idiv-hub/SharedComponents';
import { QrCode, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'QR Verification System | IDIV Documentation',
    description: 'Technical explanation of the IDIV QR verification protocol.',
};

export default function QrVerificationSystemPage() {
    return (
        <IDivDocLayout 
            title="QR Verification System"
            subtitle="The primary optical verification layer connecting physical identity assets to the IDIV cloud."
        >
            <section>
                <p>
                    The **IDIV QR Verification System** is the most widely used component of the platform. By encoding a 
                    cryptographically signed URL into a high-density QR pattern, we allow for instant, data-rich verification 
                    using standard mobile hardware.
                </p>
            </section>

            <section>
                <h2>System Simulation</h2>
                <p>The following shows the typical interface encountered by an officer after scanning an IDIV card.</p>
                <IDivQrExample />
            </section>

            <section>
                <h2>Technical Specifications</h2>
                <DocFeatures items={[
                    { 
                        icon: <QrCode size={24} />, 
                        title: "High-Contrast Pattern", 
                        desc: "Utilizes Version 6 QR encoding with 25% error correction, ensuring scannability even on worn or scratched cards." 
                    },
                    { 
                        icon: <Cpu size={24} />, 
                        title: "Edge Redirection", 
                        desc: "Scans are routed through our global edge network to ensure verification results load in under 500ms." 
                    },
                    { 
                        icon: <ShieldCheck size={24} />, 
                        title: "Secure Tokens", 
                        desc: "Each QR URL contains a unique session token that prevents 'URL guessing' and brute-force attacks." 
                    },
                    { 
                        icon: <Zap size={24} />, 
                        title: "Real-time Delta", 
                        desc: "The system provides a 'live' check against our sponsorship database, accounting for changes made seconds prior." 
                    }
                ]} />
            </section>

            <section>
                <h2>Anti-Counterfeit Logic</h2>
                <p>
                    Traditional paper documents can be photocopied. An IDIV QR code, however, point to a **dynamic, authenticated record**. 
                    If a traveler tries to use a photocopy of a card, the verifier will see the verification screen, but the 
                    screen will include a high-resolution, time-stamped photo of the traveler that was taken during the 
                    visa application—not from the card itself. This creates a powerful visual check.
                </p>
            </section>

            <section>
                <h2>Verification Accuracy</h2>
                <p>
                    The system is designed to operate in low-bandwidth environments typical of remote Indonesian regions. 
                    The verification payload is optimized for minimal data weight, ensuring that even a basic 3G connection 
                    is sufficient for a secure check.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Does my phone keep a record of scans?</strong> Most mobile browsers keep a history of visited URLs, but the IDIV verification page does not store any persistent data on the scanning device unless authorized.</li>
                    <li><strong>What if the QR is damaged?</strong> If the QR code is more than 30% destroyed, the verifier can use the manual 10-digit Sponsor ID lookup at `idiv-search`.</li>
                    <li><strong>Is the QR code linked to my personal GPS?</strong> No. While the system logs that a verification occurred, it does not track the traveler’s continuous GPS location.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
