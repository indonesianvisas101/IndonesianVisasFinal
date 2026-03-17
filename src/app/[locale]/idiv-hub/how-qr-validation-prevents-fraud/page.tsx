import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures, IDivQrExample } from '@/components/idiv-hub/SharedComponents';
import { AlertCircle, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fraud Prevention via QR | IDIV Documentation',
    description: 'How the IDIV QR verification protocol prevents identity and visa fraud.',
};

export default function QrFraudPreventionPage() {
    return (
        <IDivDocLayout 
            title="How QR Validation Prevents Fraud"
            subtitle="Eliminating the risk of social engineering and document forgery through dynamic verification tokens."
        >
            <section>
                <p>
                    In an era where high-quality document forgeries are increasingly common, static identity cards are 
                    no longer sufficient for high-trust environments. The **IDIV QR protocol** prevents fraud by 
                    removing the "Source of Truth" from the physical object and placing it in a secure, live cloud environment.
                </p>
            </section>

            <section>
                <h2>Fraud Prevention Mechanisms</h2>
                <DocFeatures items={[
                    { 
                        icon: <RefreshCw size={24} />, 
                        title: "Dynamic Status", 
                        desc: "A forged card's QR code will point to a record that we can instantly expire or revoke at any time." 
                    },
                    { 
                        icon: <ShieldCheck size={24} />, 
                        title: "Verified Bio-Photo", 
                        desc: "The verification screen display a photo pulled from our secure application records, not the card itself." 
                    },
                    { 
                        icon: <Zap size={24} />, 
                        title: "One-Time-Token Use", 
                        desc: "Premium IDIV implementations utilize time-sensitive tokens that expire shortly after the scan is initiated." 
                    },
                    { 
                        icon: <AlertCircle size={24} />, 
                        title: "Anomaly Detection", 
                        desc: "Our system flags if a single card is scanned in two different cities simultaneously, indicating a cloned QR." 
                    }
                ]} />
            </section>

            <section>
                <h2>Visual Verification Check</h2>
                <p>This is what an officer sees upon scanning a legitimate IDIV identity card:</p>
                <IDivQrExample />
            </section>

            <section>
                <h2>Eliminating 'Ghost Sponsorship'</h2>
                <p>
                    Fraud often occurs when a company sponsors a traveler but the relationship is terminated without 
                    immigration being informed. With IDIV, if a sponsorship relationship ends, the Agency 
                    internally terminates the IDIV record. From that second forward, any scan will return a 
                    <strong>'Status: NOT VALID'</strong>, preventing the traveler from using the former sponsor's 
                    guarantee for rental or business activities.
                </p>
            </section>

            <section>
                <h2>Verification Awareness</h2>
                <p>
                    We educate our partners (Villas, Rentals) to look for the **live website indicators**—such as 
                    scrolling text or live date-timers—on the verification screen. This prevents fraudsters 
                    from showing a static "screenshot" of a valid verification.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>What if someone copies my QR code?</strong> They may be able to see your public verification screen, but they cannot use it to gain identity (as the photo won't match) and any malicious activity will be logged against that ID.</li>
                    <li><strong>Can I change my QR code?</strong> Yes. If you suspect your IDIV card has been compromised, our agency can "rotate" the keys and issue you a new, secure card.</li>
                    <li><strong>Is the system prone to Phishing?</strong> We always advise verifiers to check the domain `indonesianvisas.com`. We never conduct verification through third-party URL shorteners.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
