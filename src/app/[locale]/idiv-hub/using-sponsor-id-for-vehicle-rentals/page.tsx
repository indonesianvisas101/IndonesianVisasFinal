import React from 'react';
import IDivDocLayout from '@/components/idiv-hub/IDivDocLayout';
import { DocFeatures } from '@/components/idiv-hub/SharedComponents';
import { Zap, Shield, Search, UserCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'IDIV for Vehicle Rentals | Partner Guide',
    description: 'Protecting your rental assets by verifying guest sponsorship and identity with IDIV.',
};

export default function VehicleRentalGuidePage() {
    return (
        <IDivDocLayout 
            title="Using Sponsor ID for Vehicle Rentals"
            subtitle="Secure your motorbike or car rental business by ensuring your clients are verified and legally sponsored."
        >
            <section>
                <p>
                    For vehicle rental companies in Bali and beyond, **asset security** is the primary concern. 
                    Renting a vehicle to a traveler who has no legal sponsor or whose visa has expired is a significant business risk. 
                    The IDIV platform provides an instant layer of protection.
                </p>
            </section>

            <section>
                <h2>Why Rental Companies Use IDIV</h2>
                <DocFeatures items={[
                    { 
                        icon: <Zap size={24} />, 
                        title: "Know Your Customer (KYC)", 
                        desc: "Confirm the client's identity against their sponsorship record before handing over vehicle keys." 
                    },
                    { 
                        icon: <Shield size={24} />, 
                        title: "Asset Protection", 
                        desc: "Verify that the guest has a valid legal sponsor who can be contacted in case of an emergency or incident." 
                    },
                    { 
                        icon: <Search size={24} />, 
                        title: "Sponsorship Visibility", 
                        desc: "Know exactly which agency is responsible for the traveler's stay in the country." 
                    },
                    { 
                        icon: <UserCheck size={24} />, 
                        title: "Fraud Prevention", 
                        desc: "Identify 'ID Swapping' or stolen identities before the rental agreement is signed." 
                    }
                ]} />
            </section>

            <section>
                <h2>Operational Best Practices</h2>
                <ul>
                    <li><strong>Visual Identification:</strong> Never rent a vehicle without first scanning the IDIV card and matching the photo to the client.</li>
                    <li><strong>Record the ID:</strong> Note the 10-digit Sponsor ID on your rental contract. This is your primary reference in case of a police report.</li>
                    <li><strong>Check Permit Expiry:</strong> Do not rent a vehicle for a period longer than the traveler’s 'Visa Expiry' shown on the IDIV portal.</li>
                </ul>
            </section>

            <section>
                <h2>Trust in the Ecosystem</h2>
                <p>
                    By requiring an IDIV card, your rental business joins an elite ecosystem of **Trusted Partners**. 
                    Travelers who hold an IDIV card have already been vetted and sponsored by a leading agency, 
                    making them statistically lower-risk clients for your business.
                </p>
                <p>
                    In the event of an accident, local authorities will often look for the traveler's sponsorship data. 
                    Having this data on file via the IDIV platform shows that your business follows best practices and 
                    is cooperating with legal stay regulations.
                </p>
            </section>

            <section>
                <h2>Case Study: Motorbike Recovery</h2>
                <p>
                    A rental shop in Uluwatu was unable to contact a guest who had failed to return a motorbike. 
                    By using the Sponsor ID recorded at check-in, the shop was able to contact the internal 
                    'Sponsor Support Line' at Indonesian Visas Agency. Our team assisted in coordinating with 
                    local authorities to locate the traveler and resolve the situation peacefully.
                </p>
            </section>

            <section>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li><strong>Is an IDIV card the same as a driving license?</strong> No. It verifies identity and sponsorship, NOT the ability to drive. Always check for a valid International Driving Permit (IDP).</li>
                    <li><strong>What if the client only has a digital ID?</strong> You can still verify it by entering their 10-digit ID at `idiv-search` on your own phone.</li>
                    <li><strong>Can I keep the client's IDIV card as a deposit?</strong> No. Never keep a client's identity card. Use the verification portal to record the information you need.</li>
                </ul>
            </section>
        </IDivDocLayout>
    );
}
