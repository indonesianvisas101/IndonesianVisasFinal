"use client";

import React from "react";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Send } from "lucide-react";

const ContactSection = ({ dict }: { dict?: any }) => {
    const t = dict?.contact_section || {};

    return (
        <section className="py-12 md:py-24 relative overflow-hidden" id="contact">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 mode-aware-text">
                        {t.title || "Get In Touch"}
                    </h2>
                    <p className="mode-aware-subtext leading-relaxed text-sm md:text-base font-medium">
                        {t.description || "Have questions? We're here to help! Our team is available 24/7 to assist you with your visa needs."}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
                    {/* Contact Info Card */}
                    <div className={`glass-card p-6 md:p-8 rounded-3xl lg:col-span-2 w-full mx-auto`}>
                        <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 mode-aware-text text-center md:text-left">
                            {t.info_title || "Contact Information"}
                        </h3>

                        <div className="flex flex-col gap-6 md:gap-8">
                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-100 dark:bg-white/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                                    <Mail size={20} className="md:w-6 md:h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm mode-aware-subtext mb-1 font-bold">{t.email_label || "Email"}</p>
                                    <div className="flex flex-col gap-1 overflow-hidden">
                                        <a href="mailto:contact@indonesianvisas.agency" className="text-sm md:text-base font-bold mode-aware-text hover:text-primary transition-colors truncate">contact@indonesianvisas.agency</a>
                                        <a href="mailto:info@indonesianvisas.agency" className="text-sm md:text-base font-bold mode-aware-text hover:text-primary transition-colors truncate">info@indonesianvisas.agency</a>
                                        <a href="mailto:support@visas.agency" className="text-sm md:text-base font-bold mode-aware-text hover:text-primary transition-colors truncate">support@visas.agency</a>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-100 dark:bg-white/10 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                                    <Phone size={20} className="md:w-6 md:h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm mode-aware-subtext mb-1 font-bold">{t.whatsapp_label || "WhatsApp"}</p>
                                    <a href="https://wa.me/+6285727041992" className="text-sm md:text-base font-bold mode-aware-text hover:text-primary transition-colors block">
                                        +62 857 27041992
                                    </a>
                                </div>
                            </div>

                            {/* Office */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 dark:bg-white/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                    <MapPin size={20} className="md:w-6 md:h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm mode-aware-subtext mb-1 font-bold">{t.office_label || "Office"}</p>
                                    <span className="text-sm md:text-base font-bold mode-aware-text block">
                                        {t.office_address || "Jl. Tibung Sari 11C, Bali, Indonesia"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="mt-12">
                            <h4 className="mode-aware-text font-bold text-lg border-t border-gray-200 dark:border-white/10 pt-6 mb-6 text-center md:text-left">
                                {t.follow_us || "Follow Us"}
                            </h4>
                            <div className="flex justify-center md:justify-start gap-3 flex-wrap">
                                <a href="https://instagram.com/balihelp.id" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 transition-all" aria-label="Instagram">
                                    <Instagram size={20} className="text-pink-500" />
                                </a>
                                <a href="https://t.me/IndonesianVisas" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 transition-all" aria-label="Telegram">
                                    <Send size={20} className="text-blue-400" />
                                </a>
                                <a href="https://twitter.com/IndonesianVisas" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 transition-all" aria-label="Twitter">
                                    <Twitter size={20} className="text-sky-500" />
                                </a>
                                <a href="https://www.linkedin.com/in/bayu-damopolii-887ab883/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 transition-all" aria-label="LinkedIn">
                                    <Linkedin size={20} className="text-blue-700" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Card */}
                    <div className={`glass-card p-6 md:p-8 rounded-3xl lg:col-span-3 w-full mx-auto`}>
                        <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 mode-aware-text text-center md:text-left">
                            {t.form_title || "Send Message"}
                        </h3>
                        <form
                            className="flex flex-col gap-4 md:gap-6"
                            action="https://formspree.io/f/xbdlnjka"
                            method="POST"
                        >
                            <div className="flex flex-col gap-2">
                                <label htmlFor="contact-name" className="text-sm font-bold !text-slate-700 dark:!text-slate-300 ml-1">{t.form_name || "Your Name"}</label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    name="name"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base !text-slate-900 dark:!text-white placeholder-slate-500 transition-all font-medium"
                                    placeholder={t.form_placeholder_name || "John Doe"}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="contact-email" className="text-sm font-bold !text-slate-700 dark:!text-slate-300 ml-1">{t.form_email || "Email"}</label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    name="email"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base !text-slate-900 dark:!text-white placeholder-slate-500 transition-all font-medium"
                                    placeholder={t.form_placeholder_email || "john@example.com"}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="contact-message" className="text-sm font-bold !text-slate-700 dark:!text-slate-300 ml-1">{t.form_message || "Message"}</label>
                                <textarea
                                    id="contact-message"
                                    rows={4}
                                    name="message"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base !text-slate-900 dark:!text-white placeholder-slate-500 transition-all resize-none font-medium"
                                    placeholder={t.form_placeholder_message || "How can we help you?"}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-base flex items-center justify-center gap-2"
                            >
                                {t.form_submit || "Send Message"} <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
