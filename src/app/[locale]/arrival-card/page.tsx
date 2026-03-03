
import React from 'react';
import { Metadata } from 'next';
import ArrivalCardForm from '@/components/arrival-card/ArrivalCardForm';

export const metadata: Metadata = {
    title: "Electronic Arrival Card (e-CD) | Indonesian Visas",
    description: "Submit your Official Indonesian Electronic Arrival Card (e-CD) online before landing.",
};

export default function ArrivalCardPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-3 mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                        Indonesian Electronic Arrival Card (e-CD)
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Please complete your Arrival Card before entering Indonesia.
                        This form is required for Immigration and Customs clearance.
                    </p>
                </div>

                {/* Form Container */}
                <ArrivalCardForm />

                {/* Footer Note */}
                <div className="text-center text-xs text-slate-400 mt-8">
                    <p>&copy; 2026 Directorate General of Immigration & Customs. All rights reserved.</p>
                </div>
            </div>
        </main>
    );
}
