import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Calendar, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Validity & Expiry Logic | IDIV Platform',
    description: 'How IDIV handles issued and expiry dates for visa sponsorship.',
};

export default function IssuedExpiryValidationPage() {
    return (
        <IDivDocLayout 
            title="Issued and Expiry Validation"
            subtitle="The temporal logic that ensures IDIV records are always aligned with the traveler's legal stay permit."
        >
            <section>
                <p>
                    An identity document in a visa context is only as good as its **validity logic**. The IDIV platform 
                    implements a dynamic temporal system where every record is bound by two critical timestamps: 
                    the **Issued Date** and the **Expiry Date**.
                </p>
            </section>

            <section>
                <h2>Validity Parameters</h2>
                <DocFeatures items={[
                    { 
                        icon: <Calendar size={24} />, 
                        title: "Issued Date", 
                        desc: "The exact moment the sponsorship was verified and the identity record was minted in our system." 
                    },
                    { 
                        icon: <Clock size={24} />, 
                        title: "Current Stay Permit", 
                        desc: "The system tracks the specific end-date of your current visa (VOA, KITAS, etc.)." 
                    },
                    { 
                        icon: <AlertTriangle size={24} />, 
                        title: "Sponsorship Expiry", 
                        desc: "The date our agency concludes its legal guarantee. This is usually 24 hours after visa expiry." 
                    },
                    { 
                        icon: <ShieldCheck size={24} />, 
                        title: "Active/Inactive Status", 
                        desc: "A binary state determined by comparing the current server time against the permit boundaries." 
                    }
                ]} />
            </section>

            <section>
                <h2>Dynamic Renewal Logic</h2>
                <p>
                    One of the most powerful features of IDIV is its ability to **extend validity without re-issuing physical hardware**. 
                    When a traveler extends their visa (e.g., a 30-day VOA extension), our system updates the Digital Twin's 
                    expiry date.
                </p>
                <p>
                    Any authority scanning the QR code *after* the extension will see the new, updated expiry date, even 
                    though the physical card remains the same. This ensures zero "validity gap" during extension cycles.
                </p>
            </section>

            <section>
                <h2>Status Indicators</h2>
                <p>When verified, the system returns one of four logical states:</p>
                <ul>
                    <li><strong>ACTIVE (Green):</strong> Traveler is within the issued/expiry window and sponsorship is live.</li>
                    <li><strong>GRACE PERIOD (Orange):</strong> Stay permit has expired but the traveler is within a 24-hour departure window.</li>
                    <li><strong>EXPIRED (Red):</strong> Stay permit and sponsorship have concluded. Return to agency for renewal.</li>
                    <li><strong>REVOKED (Black):</strong> Identity disabled due to legal non-compliance or reported lost card.</li>
                </ul>
            </section>

            <section>
                <h2>Technical Accuracy</h2>
                <p>
                    The platform synchronizes with Indonesian server time (WITA/WIB) to ensure that midnight expiry is handled 
                    precisely. This prevents travelers from being incorrectly flagged as 'Expired' when they still have hours 
                    remaining on their legal stay.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Does my IDIV expire before my visa?</strong> No. Your IDIV is designed to expire concurrently with your sponsorship, which is aligned with your legal visa.</li>
                    <li><strong>What if my extension is still in process?</strong> The system can show a 'PERMIT PENDING' status to indicate that the traveler has successfully submitted their renewal.</li>
                    <li><strong>Can I manually change my expiry date?</strong> No. Expiry dates are system-generated based on absolute immigration records.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
