import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Fingerprint, UserCheck, Shield, FileText } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sponsor ID System | IDIV Documentation',
    description: 'Explaining the role of the Sponsor ID in the Indonesian visa ecosystem.',
};

export default function SponsorIdSystemPage() {
    return (
        <IDivDocLayout 
            title="Sponsor ID System"
            subtitle="The Sponsor ID is a unique multi-dimensional identifier that links a traveler to their legal guarantor in Indonesia."
        >
            <section>
                <p>
                    In the Indonesian immigration framework, a traveler's legal status is often inextricably linked to their **Sponsor**. 
                    For those utilizing our agency, the **Sponsor ID** acts as the primary digital anchor for this relationship. 
                    It is more than just a serial number; it is a live token of legal responsibility.
                </p>
            </section>

            <section>
                <h2>Purpose of the Sponsor ID</h2>
                <DocFeatures items={[
                    { 
                        icon: <Fingerprint size={24} />, 
                        title: "Unique Identification", 
                        desc: "Each traveler is assigned a unique 10-digit ID that never changes, even if they switch to a new visa type." 
                    },
                    { 
                        icon: <UserCheck size={24} />, 
                        title: "Guarantee Association", 
                        desc: "It serves as instant proof that PT Indonesian Visas Agency is the active guarantor for the traveler." 
                    },
                    { 
                        icon: <Shield size={24} />, 
                        title: "Regulatory Compliance", 
                        desc: "Ensures all local activities (rentals, banking, etc.) are mapped to a legitimate company sponsorship." 
                    },
                    { 
                        icon: <FileText size={24} />, 
                        title: "Audit Trail", 
                        desc: "Maintains an immutable log of sponsorship history, stay extensions, and arrival/departure data." 
                    }
                ]} />
            </section>

            <section>
                <h2>Why It Exists</h2>
                <p>
                    Previously, travelers had to carry bulky paper sponsorship letters to prove their status to local authorities. 
                    The Sponsor ID system digitizes this entire process. By presenting a single ID, the traveler allows the 
                    recipient to pull the current sponsorship status directly from our secure servers.
                </p>
                <p>
                    This prevents "Ghost Sponsorship" (where a company sponsors a visa but no longer tracks the traveler) 
                    and ensures that the traveler is always operating within the legal framework provided by their guarantor.
                </p>
            </section>

            <section>
                <h2>Anatomy of a Sponsor ID</h2>
                <p>A typical ID (e.g., <strong>IV-1024-8891</strong>) consists of three parts:</p>
                <ul>
                    <li><strong>Agency Prefix (IV):</strong> Identifies the sponsoring body (Indonesian Visas).</li>
                    <li><strong>Year/Batch Code:</strong> Indicates when the identity was first minted.</li>
                    <li><strong>Unique Sequence:</strong> The traveler's individual cryptographically generated number.</li>
                </ul>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Does my Sponsor ID change if I get a new passport?</strong> No. The Sponsor ID is linked to you personally and will be mapped to any new passport added to your record.</li>
                    <li><strong>Can I use my Sponsor ID for banking?</strong> Many local banks in Bali recognize the IDIV Sponsor ID as proof of valid sponsorship during account opening.</li>
                    <li><strong>What if someone else knows my ID?</strong> Knowledge of the ID alone is not enough to access private data; secondary verification (biometrics or passport number) is required for full records.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
