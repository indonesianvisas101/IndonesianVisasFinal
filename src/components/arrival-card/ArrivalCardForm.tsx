"use client";

import React, { useState, useEffect, useRef } from 'react';
import { countries } from '@/data/countries';
import Link from 'next/link';

// Types
interface ArrivalFormState {
    // Step 1: Personal
    nationality: string;
    fullName: string;
    dob: string;
    gender: string;
    passportNumber: string;
    passportExpiry: string;
    phoneCode: string; // e.g., +62
    phoneNumber: string;
    email: string;
    additionalTravelers: any[]; // Placeholder for complex traveler logic if needed

    // Step 2: Travel
    arrivalDate: string;
    departureDate: string;
    hasVisa: boolean;
    kitasNumber?: string;

    // Step 3: Transport & Address
    transportType: 'Air' | 'Sea';
    arrivalPort: string; // Airport code or Name
    flightType: 'Commercial' | 'Private'; // Commercial / Govt / Charter
    airlineName: string;
    flightNumber: string;
    purpose: string;
    accommodationType: 'House' | 'Hotel' | 'Other';
    province?: string;
    city?: string;
    address?: string;
    hotelName?: string;
    nearestImmigration?: string;

    // Step 4: Declaration
    symptoms: {
        fever: boolean;
        cough: boolean;
        rash: boolean;
        runnyNose: boolean;
        soreThroat: boolean;
        breathShortness: boolean;
    };
    travelHistory: string[]; // Countries
    quarantine: {
        active: boolean;
        type?: 'Animal' | 'Fish' | 'Plant';
        description?: string;
        qty?: string;
        cert?: boolean;
        origin?: string;
    };
    customs: {
        baggageCount: number;
        declareGoods: boolean;
        declaredItems: { desc: string; qty: number; currency: string; value: number }[];
        imei: boolean;
    };
    agreed: boolean;
}

const INITIAL_STATE: ArrivalFormState = {
    nationality: '', fullName: '', dob: '', gender: '', passportNumber: '', passportExpiry: '',
    phoneCode: '+62', phoneNumber: '', email: '', additionalTravelers: [],
    arrivalDate: '', departureDate: '', hasVisa: false,
    transportType: 'Air', arrivalPort: '', flightType: 'Commercial', airlineName: '', flightNumber: '', purpose: 'Tourism',
    accommodationType: 'Hotel',
    symptoms: { fever: false, cough: false, rash: false, runnyNose: false, soreThroat: false, breathShortness: false },
    travelHistory: [],
    quarantine: { active: false },
    customs: { baggageCount: 0, declareGoods: false, declaredItems: [], imei: false },
    agreed: false
};

const STEPS = [
    { title: "Personal Information", id: 1 },
    { title: "Travel Details", id: 2 },
    { title: "Mode of Transport & Address", id: 3 },
    { title: "Declaration", id: 4 }
];

export default function ArrivalCardForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<ArrivalFormState>(INITIAL_STATE);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Persist form state logic could go here (localStorage) based on reqs "Form state persists"
    // For simplicity in this run, React state persists while navigating steps.

    const handleChange = (field: keyof ArrivalFormState, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (section: keyof ArrivalFormState, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section] as any, [field]: value }
        }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitForm = async () => {
        setIsSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('data', JSON.stringify(formData));

            if (fileInputRef.current?.files?.[0]) {
                fd.append('document', fileInputRef.current.files[0]);
            }

            const response = await fetch('/api/arrival-card/submit', {
                method: 'POST',
                body: fd,
            });

            const result = await response.json();

            if (response.ok) {
                alert("Arrival Card Submitted Successfully! You will receive an email shortly.");
                window.location.href = '/en/thanks'; // Redirect to a generic a thanks page
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert("An error occurred during submission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800 mt-8 md:mt-16">
            {/* Header / Stepper */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-gray-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-8">
                    {STEPS.map((s) => (
                        <div key={s.id} className="flex flex-col items-center relative z-10 w-1/4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-200 text-gray-400 dark:bg-slate-700'
                                }`}>
                                {s.id}
                            </div>
                            <span className={`text-xs mt-2 text-center font-medium ${step >= s.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                    {/* Progress Bar Line */}
                    <div className="absolute top-11 left-0 w-full h-[2px] bg-gray-200 dark:bg-slate-700 -z-0 px-12">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="p-8">
                {step === 1 && <StepPersonal data={formData} update={handleChange} next={nextStep} fileInputRef={fileInputRef} />}
                {step === 2 && <StepTravel data={formData} update={handleChange} next={nextStep} back={prevStep} />}
                {step === 3 && <StepTransport data={formData} update={handleChange} next={nextStep} back={prevStep} />}
                {step === 4 && (
                    <StepDeclaration
                        data={formData}
                        update={handleChange}
                        nestedUpdate={handleNestedChange}
                        back={prevStep}
                        submit={submitForm}
                        isAccordionOpen={isAccordionOpen}
                        toggleAccordion={() => setIsAccordionOpen(!isAccordionOpen)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

const StepPersonal = ({ data, update, next, fileInputRef }: any) => {
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">PERSONAL INFORMATION</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Ensure the data on this page matches your passport, then complete the remaining information.
                </p>
                <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-200 text-sm mt-4 flex items-start gap-2">
                    <span>⚠️</span>
                    IMPORTANT! Please use the same passport as used in other Indonesian immigration applications.
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nationality</label>
                    <select
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={data.nationality}
                        onChange={(e) => update('nationality', e.target.value)}
                    >
                        <option value="">Select Nationality</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <input
                        type="text"
                        placeholder="As shown in passport"
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.fullName}
                        onChange={(e) => update('fullName', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
                    <input
                        type="date"
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.dob}
                        onChange={(e) => update('dob', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 p-3 border rounded-xl w-full cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={data.gender === 'Male'}
                                onChange={(e) => update('gender', e.target.value)}
                            /> Male
                        </label>
                        <label className="flex items-center gap-2 p-3 border rounded-xl w-full cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={data.gender === 'Female'}
                                onChange={(e) => update('gender', e.target.value)}
                            /> Female
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Passport Number</label>
                    <input
                        type="text"
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                        value={data.passportNumber}
                        onChange={(e) => update('passportNumber', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Passport Expiry Date</label>
                    <input
                        type="date"
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.passportExpiry}
                        onChange={(e) => update('passportExpiry', e.target.value)}
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                    <div className="flex gap-2">
                        <select className="w-24 p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <option value="+62">+62</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+61">+61</option>
                        </select>
                        <input
                            type="tel"
                            className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="812345678"
                            value={data.phoneNumber}
                            onChange={(e) => update('phoneNumber', e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input
                        type="email"
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.email}
                        onChange={(e) => update('email', e.target.value)}
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Passport Document (Optional)</label>
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        ref={fileInputRef}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-300"
                    />
                    <p className="text-xs text-slate-500 mt-2">Upload a clear photo or scan of your passport data page for faster processing.</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                <Link href="/" className="px-6 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 transition-colors">
                    Cancel
                </Link>
                <button
                    onClick={next}
                    className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1"
                >
                    Next Step
                </button>
            </div>
        </div>
    );
};

const StepTravel = ({ data, update, next, back }: any) => {
    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">TRAVEL DETAILS</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date of Arrival in Indonesia</label>
                    <input
                        type="date"
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.arrivalDate}
                        onChange={(e) => update('arrivalDate', e.target.value)}
                    />
                    <p className="text-xs text-slate-400 mt-1">Can be submitted up to 3 days before arrival.</p>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date of Departure from Indonesia</label>
                    <input
                        type="date"
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.departureDate}
                        onChange={(e) => update('departureDate', e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Do you already have a Visa or KITAS / KITAP?</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 p-3 border rounded-xl w-full cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <input
                            type="radio"
                            name="hasVisa"
                            value="Yes"
                            checked={data.hasVisa === true}
                            onChange={(e) => update('hasVisa', true)}
                        /> Yes
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded-xl w-full cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <input
                            type="radio"
                            name="hasVisa"
                            value="No"
                            checked={data.hasVisa === false}
                            onChange={(e) => update('hasVisa', false)}
                        /> No
                    </label>
                </div>
            </div>

            {data.hasVisa && (
                <div className="mt-4 animate-slideDown">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">KITAS / KITAP Number</label>
                    <input
                        type="text"
                        placeholder="Required for KITAS holders"
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.kitasNumber || ''}
                        onChange={(e) => update('kitasNumber', e.target.value)}
                    />
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                <button onClick={back} className="px-6 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 transition-colors">
                    Back
                </button>
                <button
                    onClick={next}
                    className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1"
                >
                    Next Step
                </button>
            </div>
        </div>
    )
}

const StepTransport = ({ data, update, next, back }: any) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">MODE OF TRANSPORT & ADDRESS</h2>

            <div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 border-b pb-2">3.1 Mode of Transport</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Transport Type</label>
                        <select
                            className="w-full p-3 rounded-xl border bg-white dark:bg-slate-800"
                            value={data.transportType}
                            onChange={(e) => update('transportType', e.target.value)}
                        >
                            <option value="Air">Air</option>
                            <option value="Sea">Sea</option>
                        </select>
                    </div>
                </div>

                {/* Air Fields */}
                {data.transportType === 'Air' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-medium mb-2">Arrival Airport</label>
                            <select className="w-full p-3 rounded-xl border bg-white dark:bg-slate-800" value={data.arrivalPort} onChange={(e) => update('arrivalPort', e.target.value)}>
                                <option value="">Select Airport</option>
                                <option value="DPS">DPS - I Gusti Ngurah Rai (Bali)</option>
                                <option value="CGK">CGK - Soekarno Hatta (Jakarta)</option>
                                <option value="SUB">SUB - Juanda (Surabaya)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Flight Number</label>
                            <input type="text" className="w-full p-3 rounded-xl border bg-white dark:bg-slate-800" placeholder="e.g. GA881" value={data.flightNumber} onChange={(e) => update('flightNumber', e.target.value)} />
                        </div>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 border-b pb-2">3.2 Address in Indonesia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Accommodation Type</label>
                        <select
                            className="w-full p-3 rounded-xl border bg-white dark:bg-slate-800"
                            value={data.accommodationType}
                            onChange={(e) => update('accommodationType', e.target.value)}
                        >
                            <option value="Hotel">Hotel</option>
                            <option value="House">House / Residence</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {data.accommodationType === 'Hotel' && (
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Hotel Name</label>
                            <input type="text" className="w-full p-3 rounded-xl border bg-white dark:bg-slate-800" placeholder="Enter hotel name" value={data.hotelName || ''} onChange={(e) => update('hotelName', e.target.value)} />
                        </div>
                    )}

                    {data.accommodationType === 'House' && (
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Full Address</label>
                            <textarea className="w-full p-3 rounded-xl border bg-white dark:bg-slate-800" rows={3} placeholder="Street, Number, etc." value={data.address || ''} onChange={(e) => update('address', e.target.value)} />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                <button onClick={back} className="px-6 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 transition-colors">
                    Back
                </button>
                <button onClick={next} className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                    Next Step
                </button>
            </div>
        </div>
    );
}

const StepDeclaration = ({ data, update, nestedUpdate, back, submit, isAccordionOpen, toggleAccordion, isSubmitting }: any) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">DECLARATION</h2>

            {/* 4.1 Health */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">4.1 Health Declaration</h3>
                <p className="mb-4 text-sm">Do you currently have any of the following symptoms?</p>
                <div className="grid grid-cols-2 gap-4">
                    {['Fever', 'Cough', 'Skin Lesions / Rash', 'Runny Nose', 'Sore Throat', 'Shortness of Breath'].map((sym) => (
                        <label key={sym} className="flex items-center gap-2">
                            <input type="checkbox" className="w-5 h-5 rounded text-blue-600" />
                            <span className="text-sm">{sym}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 4.4 Customs */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border-l-4 border-blue-600">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300">Customs Declaration (BC 2.2)</h3>
                <p className="text-sm text-slate-600 mb-4">Notification of Goods Carried by Passengers and Transport Crew</p>

                {/* Accordion */}
                <div className="mb-6">
                    <button
                        onClick={toggleAccordion}
                        className="w-full p-4 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                    >
                        <span className="font-semibold text-blue-600 text-sm">Click this button to open the information page before answering the questions below</span>
                        <span className={`transform transition-transform ${isAccordionOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {isAccordionOpen && (
                        <div className="bg-white dark:bg-slate-700 p-6 rounded-b-xl border-t border-gray-100 dark:border-slate-600 text-sm space-y-4 animate-slideDown">
                            <p>Thank you for your cooperation in following Indonesian customs inspection procedures. You may declare family goods in one (1) Customs Declaration document.</p>
                            <p><strong>A.</strong> To ensure smooth customs services, please declare all goods accurately and completely in this Customs Declaration and present it to Customs Officers.</p>
                            <p><strong>B.</strong> Carrying narcotics, illegal drugs, terrorism-related goods, money laundering goods, and/or other prohibited items constitutes a violation and is subject to sanctions.</p>
                            <p><strong>C.</strong> If you carry cash (including banknotes) and/or other payment instruments (giro, checks, traveler’s checks, promissory notes, certificates of deposit), in Rupiah or foreign currency, valued at IDR 100,000,000 or more, you must declare it. Foreign banknotes totaling IDR 1,000,000,000 or more require Bank Indonesia approval.</p>

                            <h4 className="font-bold mt-2">D. Import Duty Exemption</h4>
                            <div className="overflow-x-auto mb-4">
                                <table className="w-full text-left border-collapse border border-gray-200 text-xs">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-slate-600">
                                            <th className="p-2 border">Subject/Object</th>
                                            <th className="p-2 border">Exemption Limit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="p-2 border">General Passenger</td><td className="p-2 border">Up to FOB USD 500.00</td></tr>
                                        <tr><td className="p-2 border">Hajj Passenger (Regular)</td><td className="p-2 border">All personal goods</td></tr>
                                        <tr><td className="p-2 border">Hajj Passenger (Special)</td><td className="p-2 border">Up to FOB USD 2,500.00</td></tr>
                                        <tr><td className="p-2 border">Award/Competition Gifts</td><td className="p-2 border">All gifts (subject to regulation)</td></tr>
                                        <tr><td className="p-2 border">Transport Crew</td><td className="p-2 border">Up to FOB USD 50.00</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <h4 className="font-bold mt-2">E. Excise Goods (BKC) Exemption</h4>
                            <div className="overflow-x-auto mb-4">
                                <table className="w-full text-left border-collapse border border-gray-200 text-xs">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-slate-600">
                                            <th className="p-2 border">Type</th>
                                            <th className="p-2 border">Per Passenger</th>
                                            <th className="p-2 border">Per Crew</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="p-2 border">Alcoholic Beverages</td><td className="p-2 border">1 Liter</td><td className="p-2 border">350 ml</td></tr>
                                        <tr><td className="p-2 border">Cigarettes</td><td className="p-2 border">200 sticks</td><td className="p-2 border">40 sticks</td></tr>
                                        <tr><td className="p-2 border">Cigars</td><td className="p-2 border">25 sticks</td><td className="p-2 border">10 sticks</td></tr>
                                        <tr><td className="p-2 border">Shredded Tobacco</td><td className="p-2 border">100 gr</td><td className="p-2 border">40 gr</td></tr>
                                        <tr><td className="p-2 border">Other Tobacco Products</td><td className="p-2 border">100 gr / equivalent</td><td className="p-2 border">40 gr / equivalent</td></tr>
                                        <tr><td className="p-2 border">Solid E-Cigarette</td><td className="p-2 border">140 sticks / 40 capsules</td><td className="p-2 border">20 sticks / 5 capsules</td></tr>
                                        <tr><td className="p-2 border">Open System E-Liquid</td><td className="p-2 border">30 ml</td><td className="p-2 border">15 ml</td></tr>
                                        <tr><td className="p-2 border">Closed System E-Liquid</td><td className="p-2 border">12 ml</td><td className="p-2 border">6 ml</td></tr>
                                    </tbody>
                                </table>
                                <ul className="list-disc ml-5 text-xs mt-2 text-slate-500">
                                    <li>More than one type of tobacco product is exempt proportionally.</li>
                                    <li>Excess excise goods will be destroyed by Customs Officers.</li>
                                </ul>
                            </div>

                            <p><strong>F.</strong> Commercial import goods are subject to duties and taxes.</p>
                            <p><strong>G.</strong> Re-imported and temporary import goods follow applicable regulations.</p>
                            <p><strong>H.</strong> Mobile phones/tablets purchased abroad and used in Indonesia must be reported.</p>
                            <p><strong>I.</strong> Delayed baggage must be reported to Customs.</p>
                            <p><strong>J.</strong> Any false declaration is subject to legal sanctions.</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Number of Baggage Arriving With You (Pkg)</label>
                        <input type="number" min="0" className="w-24 p-2 rounded border" defaultValue={0} />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Are you carrying goods that must be declared to Customs?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2"><input type="radio" name="declare" /> Yes</label>
                            <label className="flex items-center gap-2"><input type="radio" name="declare" defaultChecked /> No</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5 text-blue-600 rounded" checked={data.agreed} onChange={(e) => update('agreed', e.target.checked)} />
                    <span className="text-sm font-bold text-slate-800">
                        I, the applicant, hereby declare that I understand and agree to all information and declarations in this application.
                    </span>
                </label>
            </div>

            <div className="flex justify-between pt-6">
                <button onClick={back} disabled={isSubmitting} className="px-6 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 transition-colors">
                    Back
                </button>
                <button
                    onClick={submit}
                    disabled={!data.agreed || isSubmitting}
                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${data.agreed && !isSubmitting ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30 hover:-translate-y-1' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isSubmitting ? "Submitting..." : "Submit Declaration"}
                </button>
            </div>
        </div>
    )
}
