import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Home, UserCheck, Shield, FileText } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'IDIV for Villa Rentals | Partner Guide',
    description: 'How villa owners and managers can use IDIV to verify guest identity and legal status.',
};

export default function VillaRentalGuidePage() {
    return (
        <IDivDocLayout 
            title="Using Sponsor ID for Villa Rental"
            subtitle="A guide for villa owners, managers, and hospitality staff to utilize IDIV for secure guest verification."
        >
            <section>
                <p>
                    For villa managers, the **registration of guests (Pelaporan Orang Asing)** is a legal requirement 
                    under Indonesian law. Traditionally, this involves manual handling of sensitive passport data. 
                    The IDIV platform simplifies this, allowing for faster, more professional, and highly secure check-ins.
                </p>
            </section>

            <section>
                <h2>Benefits for Villa Managers</h2>
                <DocFeatures items={[
                    { 
                        icon: <Home size={24} />, 
                        title: "Legal Peace of Mind", 
                        desc: "Instantly confirm the guest is legally sponsored and has an active stay permit." 
                    },
                    { 
                        icon: <UserCheck size={24} />, 
                        title: "Identity Certainty", 
                        desc: "Visual photo verification ensures the person check-in is the person on the visa record." 
                    },
                    { 
                        icon: <Shield size={24} />, 
                        title: "Data Protection Compliance", 
                        desc: "Avoid storing unsecure passport scans. Use the IDIV digital record for your internal audit." 
                    },
                    { 
                        icon: <FileText size={24} />, 
                        title: "Simplified Reporting", 
                        desc: "Extract verified guest data directly into your 'Reporting' or 'Police Registration' workflow." 
                    }
                ]} />
            </section>

            <section>
                <h2>The Check-In Workflow</h2>
                <ol>
                    <li><strong>Guest Arrival:</strong> Request the guest's IDIV card or Sponsor ID.</li>
                    <li><strong>Scan QR:</strong> Use any mobile device to scan the QR code on the back of the card.</li>
                    <li><strong>Verify Status:</strong> Ensure the portal returns a <strong>VALID</strong> status.</li>
                    <li><strong>Record Context:</strong> Note the 'Visa Type' and 'Permit Expiry' for your guest log.</li>
                    <li><strong>Completion:</strong> Hand the card back. You have now verified the guest's legal status without the need for physical paperwork.</li>
                </ol>
            </section>

            <section>
                <h2>Handling Discrepancies</h2>
                <p>
                    If the IDIV scan returns <strong>EXPIRED</strong> or <strong>NOT FOUND</strong>, it is recommended to:
                </p>
                <ul>
                    <li>Request the guest’s physical passport for secondary check.</li>
                    <li>Advise the guest to contact their sponsor (PT Indonesian Visas Agency) immediately.</li>
                    <li>Report the discrepancy via the portal to ensure local security is aware of the change in status.</li>
                </ul>
            </section>

            <section>
                <h2>Case Study: Short-Term Luxury Rental</h2>
                <p>
                    A guest arrives at a high-end Canggu villa. Instead of the reception staff taking a photo of their 
                    passport on a personal phone (a major security risk), they scan the guest's IDIV card. The system 
                    confirms the guest is on a valid B211A Business Visa sponsored by a recognized agency. 
                    The check-in is complete in 30 seconds, and the guest feels their data is being handled professionally.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Do I still need to report to the police?</strong> Yes. IDIV facilitates the verification, but you must still follow local 'Wajib Lapor' (Report Stay) regulations as usual.</li>
                    <li><strong>Is there a fee for Villa owners to use IDIV?</strong> No. Verification is free for all hospitality partners.</li>
                    <li><strong>Can I use IDIV for security deposits?</strong> Use the IDIV record as proof of identity for the deposit agreement, but do not keep the physical card.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
