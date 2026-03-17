import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Shield, Zap, Users, Lock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Why Travelers Need a Sponsor ID | IDIV Documentation',
    description: 'Explaining the benefits of holding a digital Sponsor ID for travelers in Indonesia.',
};

export default function WhyTravelersNeedIdPage() {
    return (
        <IDivDocLayout 
            title="Why Travelers Need a Sponsor ID"
            subtitle="The IDIV Sponsor ID is more than a document; it's a tool for seamless integration into the Indonesian ecosystem."
        >
            <section>
                <p>
                    Navigating daily life in Indonesia as a foreign traveler can often involve complex bureaucratic hurdles. 
                    From checking into a villa to leasing a motorbike, proving your legal status and identity usually requires 
                    carrying your sensitive original Passport. The **IDIV Sponsor ID** changes this dynamic.
                </p>
            </section>

            <section>
                <h2>Core Benefits for the Traveler</h2>
                <DocFeatures items={[
                    { 
                        icon: <Shield size={24} />, 
                        title: "Passport Protection", 
                        desc: "Keep your original passport in a safe or hotel vault. Use your IDIV card for 90% of local identification needs." 
                    },
                    { 
                        icon: <Zap size={24} />, 
                        title: "Procedural Speed", 
                        desc: "Check-ins and rental agreements happen faster as partners can verify your status instantly via QR scan." 
                    },
                    { 
                        icon: <Users size={24} />, 
                        title: "Community Trust", 
                        desc: "Holding an IDIV card signals to local businesses that you are a professionally sponsored and verified traveler." 
                    },
                    { 
                        icon: <Lock size={24} />, 
                        title: "Privacy Control", 
                        desc: "Share only the data needed for the specific interaction. Partners see your 'Valid' status, not your home address." 
                    }
                ]} />
            </section>

            <section>
                <h2>Real-World Utility</h2>
                <p>
                    Imagine you are stopped at a routine security check. Instead of worrying about carrying a physical passport 
                    that could be lost or damaged, you present your IDIV card. The officer scans the QR code, sees your 
                    verified photo and active visa status, and you are on your way in minutes.
                </p>
                <p>
                    Similarly, when renting a luxury villa, the management often requires a copy of your visa. 
                    By providing your Sponsor ID, you give them access to a <strong>verified digital record</strong>, 
                    eliminating the need for them to keep unsecure photocopies of your private documents.
                </p>
            </section>

            <section>
                <h2>Integration with Local Services</h2>
                <p>The Sponsor ID is increasingly recognized by:</p>
                <ul>
                    <li><strong>Medical Clinics:</strong> For patient identification and insurance billing.</li>
                    <li><strong>Banks:</strong> As supporting identity for local bank account maintenance.</li>
                    <li><strong>Coworking Spaces:</strong> For membership verification and security access.</li>
                    <li><strong>Police & Banjar:</strong> For local registration and community safety checks.</li>
                </ul>
            </section>

            <section>
                <h2>Security of the IDHolder</h2>
                <p>
                    If your IDIV card is lost, your identity is not compromised. Unlike a stolen passport, a lost 
                    IDIV card can be **remotely deactivated** by our agency. We simply revoke the verification token 
                    linked to that specific card, rendering the QR code useless to any unauthorized person.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Is the IDIV card free?</strong> The basic digital ID is included with your sponsorship; premium physical cards are available for a small production and delivery fee.</li>
                    <li><strong>Can I use it for domestic flights?</strong> You should always carry your original Passport or a high-quality copy for airline check-ins and security.</li>
                    <li><strong>Does it work outside of Bali?</strong> Yes. IDIV is a national platform recognized by authorities and partners across the entire Indonesian archipelago.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
