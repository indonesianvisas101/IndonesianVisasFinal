import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Calendar, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Identity Validity Rules | IDIV Documentation',
    description: 'Specific rules and constraints governing the validity of IDIV identity records.',
};

export default function IdentityValidityRulesPage() {
    return (
        <IDivDocLayout 
            title="Visa Identity Validity Rules"
            subtitle="The strict logical constraints and regulatory rules that determine if a traveler’s IDIV status is 'Valid'."
        >
            <section>
                <p>
                    To maintain the integrity of the IDIV ecosystem, the platform operates under a strict set of 
                    **Validity Rules**. These rules ensure that IDIV is never used for travelers who are non-compliant 
                    with Indonesian immigration laws or our agency's sponsorship standards.
                </p>
            </section>

            <section>
                <h2>The 1:1 Validity Mapping</h2>
                <p>An IDIV identity is considered VALID only if **all** of the following conditions are met:</p>
                <ul>
                    <li><strong>Active Stay Permit:</strong> The traveler must have a current, unexpired visa (VOA, KITAS, etc.).</li>
                    <li><strong>Active Sponsorship:</strong> PT Indonesian Visas Agency must be the current legal guarantor.</li>
                    <li><strong>Physical Custody:</strong> The traveler must be in possession of their verified passport.</li>
                    <li><strong>Identity Consistency:</strong> The data in the IDIV system must match the traveler’s biometric reality.</li>
                </ul>
            </section>

            <section>
                <h2>System Constraints</h2>
                <DocFeatures items={[
                    { 
                        icon: <Calendar size={24} />, 
                        title: "24-Hour Expiry Window", 
                        desc: "To avoid overstay issues, the IDIV status typically expires at 23:59 on the day of visa expiry." 
                    },
                    { 
                        icon: <ShieldAlert size={24} />, 
                        title: "Auto-Revocation", 
                        desc: "Specific triggers (such as a reported lost passport) will cause the system to instantly revoke all linked IDIVs." 
                    },
                    { 
                        icon: <CheckCircle2 size={24} />, 
                        title: "Extension Overlap", 
                        desc: "Travelers waiting for an extension are given a 'PENDING' status, extending their sponsorship facilitates until the new permit is issued." 
                    },
                    { 
                        icon: <XCircle size={24} />, 
                        title: "Non-Transferability", 
                        desc: "An IDIV identity cannot be 'sold' or 'transferred' to another traveler under any circumstances." 
                    }
                ]} />
            </section>

            <section>
                <h2>Validity in the Event of Departure</h2>
                <p>
                    When a traveler departs Indonesia, their sponsorship naturally concludes. The IDIV platform 
                    synchronizes with arrival/departure records. Once departure is confirmed, the IDIV status 
                    moves to <strong>'INACTIVE (DEPARTED)'</strong>. This ensures that travelers cannot use their 
                    identity card to conduct business in Indonesia while they are physically outside the country.
                </p>
            </section>

            <section>
                <h2>The 'Good Standing' Clause</h2>
                <p>
                    Validity is also contingent on the traveler remaining in "Good Standing" with the Agency. 
                    Violations of Indonesian law, failure to report address changes, or activities outside 
                    the scope of the visa class may lead to administrative revocation of the IDIV identity.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>If my visa expires, can I still use my IDIV?</strong> No. Once the visa expires, the IDIV status will reflect 'NOT VALID', even if the physical card is still in your possession.</li>
                    <li><strong>What if I switch sponsors?</strong> If you switch to another sponsoring agency, your IDIV record with us will be terminated and you must seek a new identity document from your new sponsor.</li>
                    <li><strong>How do I check my current rules?</strong> Log in to your personal traveler dashboard to see if any specific regional constraints have been applied to your identity record.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
