import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Search, Globe, Shield, UserCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Online Verification Portal | IDIV Documentation',
    description: 'How the IDIV public verification portal operates for third-party partners.',
};

export default function OnlineVerificationPage() {
    return (
        <IDivDocLayout 
            title="Online Verification Page"
            subtitle="The web-based portal providing authenticated access to IDIV identity records."
        >
            <section>
                <p>
                    For partners who do not have access to a physical card, the **Online Verification Page** serves as the 
                    authoritative source for sponsorship status. It is accessible via the short, easy-to-remember 
                    URL found on all promotional and legal materials: <strong>idiv-search</strong>.
                </p>
            </section>

            <section>
                <h2>Portal Features</h2>
                <DocFeatures items={[
                    { 
                        icon: <Search size={24} />, 
                        title: "Manual ID Entry", 
                        desc: "Allows verification via the 10-digit Sponsor ID or the traveler's Passport number for authorized parties." 
                    },
                    { 
                        icon: <Globe size={24} />, 
                        title: "Public / Private Views", 
                        desc: "Detects the verifier's credentials to show either a basic 'Public Record' or a detailed 'Sponsor File'." 
                    },
                    { 
                        icon: <Shield size={24} />, 
                        title: "SSL Encryption", 
                        desc: "All queries are conducted over a secure, encrypted tunnel to prevent data interception." 
                    },
                    { 
                        icon: <UserCheck size={24} />, 
                        title: "Live Photo Comparison", 
                        desc: "Displays the traveler's verified bio-photo to prevent identity theft or card swapping." 
                    }
                ]} />
            </section>

            <section>
                <h2>URL Structure & Security</h2>
                <p>
                    Every verification result is served on a unique, non-indexed URL (e.g., `indonesianvisas.com/verify/a1b2-c3d4`). 
                    These URLs are protected from search engine indexing to ensure that traveler records remains private and 
                    cannot be found via Google or other public search tools.
                </p>
            </section>

            <section>
                <h2>System Availability</h2>
                <p>
                    The portal maintains a **99.9% Up-time SLA** as a critical infrastructure component for our agency. 
                    Redundant server clusters in multiple regions ensure that no matter where an officer is scanning from, 
                    the result will be available.
                </p>
            </section>

            <section>
                <h2>Reporting Discrepancies</h2>
                <p>
                    If the online portal shows data that contradicts the physical card presented, the **online status 
                    is always considered the absolute source of truth**. Partners are encouraged to use the 
                    "Report Discrepancy" button on the verification page if they suspect a fraudulent card is in use.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Can I use the portal to find a traveler's address?</strong> No. Residential addresses are never part of the public verification output for safety reasons.</li>
                    <li><strong>How long is a verification record stored?</strong> We keep logs of verification attempts for 12 months to satisfy local security requirements.</li>
                    <li><strong>Is there a limit on how many times I can search?</strong> Public searches are rate-limited to prevent automated scraping of our identity platform.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
