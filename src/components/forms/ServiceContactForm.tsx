"use client";

import React from "react";

const ServiceContactForm = () => {
    return (
        <div className="glass-card p-10 md:p-16 max-w-5xl mx-auto rounded-[3rem] relative overflow-hidden border border-white/20 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>

            <div className="text-center mb-12">
                <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Personal Assistance</span>
                <h2 className="text-4xl font-extrabold mb-6 dark:text-white">Request Custom Service</h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    Tell us what you need, and our legal team will handle the rest. We prefer direct communication to ensure nothing is lost in translation.
                </p>
            </div>

            <form action="https://formspree.io/f/xbdlnjka" method="POST" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-gray-700 dark:text-gray-300 ml-1">Your Name</label>
                    <input
                        name="name"
                        className="p-5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                        placeholder="e.g. Michael Smith"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm text-gray-700 dark:text-gray-300 ml-1">Contact (WhatsApp/Email)</label>
                    <input
                        name="contact"
                        className="p-5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium"
                        placeholder="e.g. +61 423..."
                        required
                    />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-bold text-sm text-gray-700 dark:text-gray-300 ml-1">Service Needed</label>
                    <div className="relative">
                        <select name="service" className="w-full p-5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer appearance-none font-medium text-gray-700 dark:text-gray-200">
                            <option>General Inquiry</option>
                            <option>Company Registration (PMA)</option>
                            <option>KITAS Assistance</option>
                            <option>Legal Consultation</option>
                            <option>Other</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-bold text-sm text-gray-700 dark:text-gray-300 ml-1">Message</label>
                    <textarea
                        name="message"
                        rows={5}
                        className="p-5 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
                        placeholder="Tell us a bit about your situation..."
                    ></textarea>
                </div>
                <div className="md:col-span-2 mt-6">
                    <button type="submit" className="btn btn-primary w-full py-5 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex justify-center items-center gap-2 group">
                        <span>Submit Request</span>
                        <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                    <p className="text-center mt-6 text-sm text-gray-400">
                        We typically reply within 2 hours during business hours.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ServiceContactForm;
