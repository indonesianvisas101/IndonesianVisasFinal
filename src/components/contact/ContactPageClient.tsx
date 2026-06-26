"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MessageCircle, MapPin, Send, User, Phone, FileText, CheckCircle2, Star, ExternalLink, Clock, Globe, Instagram, Twitter, AlertTriangle } from "lucide-react";
import { COMPANY_EMAILS, COMPANY_INFO } from "@/constants/contact";

interface ContactPageClientProps {
    dict?: any;
    locale?: string;
}

// Telegram icon as SVG (not in lucide)
const TelegramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
);

export default function ContactPageClient({ dict, locale = "en" }: ContactPageClientProps) {
    const [activeForm, setActiveForm] = useState<"inquiry" | "complaint">("inquiry");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: "",
        message: "",
    });
    const [complaintData, setComplaintData] = useState({
        email: "",
        whatsapp: "",
        category: "Visa Application",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const dataToSubmit = activeForm === "inquiry"
                ? { formType: "Inquiry", ...formData }
                : { formType: "Complaint", ...complaintData };

            const response = await fetch(
                `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID || "xbdlnjka"}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataToSubmit),
                }
            );

            if (response.ok) {
                setIsSuccess(true);
                if (activeForm === "inquiry") {
                    setFormData({ name: "", email: "", whatsapp: "", message: "" });
                } else {
                    setComplaintData({ email: "", whatsapp: "", category: "Visa Application", message: "" });
                }
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    interface ContactMethodItem {
        text: string;
        href: string | null;
        external?: boolean;
    }

    interface ContactMethod {
        icon: React.ReactNode;
        label: string;
        color: string;
        lightColor: string;
        items: ContactMethodItem[];
    }

    const contactMethods: ContactMethod[] = [
        {
            icon: <Mail className="w-6 h-6" />,
            label: "Email",
            color: "from-violet-500 to-purple-600",
            lightColor: "bg-violet-50",
            items: [
                { text: COMPANY_EMAILS.public.admin, href: `mailto:${COMPANY_EMAILS.public.admin}` },
                { text: COMPANY_EMAILS.public.contact, href: `mailto:${COMPANY_EMAILS.public.contact}` },
                { text: COMPANY_EMAILS.public.info, href: `mailto:${COMPANY_EMAILS.public.info}` },
                { text: COMPANY_EMAILS.public.support, href: `mailto:${COMPANY_EMAILS.public.support}` },
            ],
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            label: "WhatsApp",
            color: "from-emerald-400 to-green-600",
            lightColor: "bg-emerald-50",
            items: [
                { text: COMPANY_INFO.whatsapp, href: COMPANY_INFO.whatsappUrl },
            ],
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            label: "Office",
            color: "from-sky-400 to-blue-600",
            lightColor: "bg-sky-50",
            items: [
                { text: COMPANY_INFO.addressFull, href: COMPANY_INFO.googleMapsUrl, external: true },
            ],
        },
        {
            icon: <Clock className="w-6 h-6" />,
            label: "Office Hours",
            color: "from-amber-400 to-orange-500",
            lightColor: "bg-amber-50",
            items: [
                { text: "Mon – Sat: 09:00 – 18:00 WITA", href: null },
                { text: "Sun: By Appointment Only", href: null },
            ],
        },
        {
            icon: <AlertTriangle className="w-6 h-6" />,
            label: "Priority Resolution",
            color: "from-rose-500 to-red-600",
            lightColor: "bg-rose-50",
            items: [
                { text: "File a Formal Complaint", href: "#complaint" },
            ],
        },
    ];

    const socialLinks = [
        { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/indonesianvisas/", label: "Instagram", color: "hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200" },
        { icon: <TelegramIcon />, href: "https://t.me/indonesianvisas", label: "Telegram", color: "hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200" },
        { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/indonesianvisas", label: "Twitter / X", color: "hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300" },
        { icon: <Globe className="w-5 h-5" />, href: `https://indonesianvisas.com/${locale}`, label: "Website", color: "hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200" },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* ─── Hero Banner ─────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#4B0082] via-[#3d006b] to-[#1E005A] pt-32 pb-20 px-4">
                {/* Decorative blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm mb-6">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <span>Based in Bali, Indonesia • Global Reach</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight">
                        Get in <span className="text-yellow-400">Touch</span>
                    </h1>
                    <p className="text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
                        Our visa specialists are ready to help you navigate the Indonesian immigration process — fast, reliable, and stress-free.
                    </p>

                    {/* Quick action pills */}
                    <div className="flex flex-wrap gap-3 justify-center mt-8">
                        <a
                            href={COMPANY_INFO.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full px-6 py-3 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30"
                        >
                            <MessageCircle className="w-5 h-5" />
                            WhatsApp Us
                        </a>
                        <a
                            href={`mailto:${COMPANY_EMAILS.public.contact}`}
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full px-6 py-3 transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            <Mail className="w-5 h-5" />
                            Send Email
                        </a>
                        <a
                            href={COMPANY_INFO.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full px-6 py-3 transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            <MapPin className="w-5 h-5" />
                            Find Us
                        </a>
                    </div>
                </div>
            </section>

            {/* ─── Main Content ─────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                    {/* ── Left Column: Contact Info ── */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-900 mb-2">Contact Information</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Multiple ways to reach us. Choose the channel most convenient for you.
                            </p>
                        </div>

                        {contactMethods.map((method, idx) => (
                            <div
                                key={idx}
                                className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white shadow-sm`}>
                                        {method.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{method.label}</p>
                                        {method.items.map((item, iIdx) => {
                                            const isHash = item.href?.startsWith("#");
                                            return item.href ? (
                                                isHash ? (
                                                    <button
                                                        key={iIdx}
                                                        onClick={() => {
                                                            setActiveForm("complaint");
                                                            document.getElementById("contact-card-container")?.scrollIntoView({ behavior: "smooth" });
                                                        }}
                                                        className="flex items-center gap-1 text-[0.85rem] font-semibold text-rose-600 hover:text-red-700 transition-colors truncate group/link mb-1 text-left w-full"
                                                    >
                                                        <span className="truncate">{item.text}</span>
                                                        <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover/link:opacity-60 transition-opacity" />
                                                    </button>
                                                ) : (
                                                    <a
                                                        key={iIdx}
                                                        href={item.href}
                                                        target={item.external ? "_blank" : undefined}
                                                        rel={item.external ? "noopener noreferrer" : undefined}
                                                        className="flex items-center gap-1 text-[0.85rem] font-semibold text-gray-800 hover:text-[#4B0082] transition-colors truncate group/link mb-1"
                                                    >
                                                        <span className="truncate">{item.text}</span>
                                                        {item.external && <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover/link:opacity-60 transition-opacity" />}
                                                    </a>
                                                )
                                            ) : (
                                                <p key={iIdx} className="text-[0.85rem] text-gray-600 mb-1">{item.text}</p>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Google Maps embed card */}
                        <a
                            href={COMPANY_INFO.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                            aria-label="Open office location in Google Maps"
                        >
                            <div className="relative bg-slate-100 h-44 overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.4096!2d115.1679!3d-8.6753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zIndonesian+Visas!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                                    className="w-full h-full border-0 pointer-events-none"
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Indonesian Visas Office Location"
                                />
                                <div className="absolute inset-0 bg-[#4B0082]/0 group-hover:bg-[#4B0082]/10 transition-colors flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#4B0082] font-bold text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Open in Google Maps
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white px-4 py-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 flex-shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-800">Indonesian Visas Office</p>
                                    <p className="text-xs text-gray-400">{COMPANY_INFO.addressFull}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-300 ml-auto" />
                            </div>
                        </a>

                        {/* Social Links */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Follow Us</p>
                            <div className="flex gap-2 flex-wrap">
                                {socialLinks.map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className={`w-10 h-10 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 transition-all duration-200 hover:scale-110 active:scale-95 ${social.color}`}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column: Contact Form ── */}
                    <div className="lg:col-span-3" id="contact-card-container">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
                            {!isSuccess ? (
                                <>
                                    {/* Tabs Switcher */}
                                    <div className="flex bg-gray-50 border border-gray-100 p-1.5 rounded-xl mb-8">
                                        <button
                                            type="button"
                                            onClick={() => { setActiveForm("inquiry"); setError(""); }}
                                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                                                activeForm === "inquiry"
                                                    ? "bg-[#4B0082] text-white shadow-sm"
                                                    : "text-gray-500 hover:text-gray-900"
                                            }`}
                                        >
                                            General Inquiry
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setActiveForm("complaint"); setError(""); }}
                                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                                                activeForm === "complaint"
                                                    ? "bg-red-600 text-white shadow-sm"
                                                    : "text-gray-500 hover:text-gray-950"
                                            }`}
                                        >
                                            File a Complaint
                                        </button>
                                    </div>

                                    {activeForm === "inquiry" ? (
                                        <>
                                            <div className="mb-6">
                                                <h2 className="text-2xl font-black text-gray-900 mb-2">Send Us a Message</h2>
                                                <p className="text-gray-500 text-sm">
                                                    Fill out the form and we'll get back to you within 2 business hours.
                                                </p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                {/* Name */}
                                                <div>
                                                    <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                        Full Name <span className="text-red-400">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            id="contact-name"
                                                            type="text"
                                                            placeholder="John Doe"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            required
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B0082]/20 focus:border-[#4B0082] transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Email */}
                                                <div>
                                                    <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                        Email Address <span className="text-red-400">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            id="contact-email"
                                                            type="email"
                                                            placeholder="john@example.com"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            required
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B0082]/20 focus:border-[#4B0082] transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* WhatsApp */}
                                                <div>
                                                    <label htmlFor="contact-wa" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                        WhatsApp Number <span className="text-gray-400 font-normal text-xs">(optional)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            id="contact-wa"
                                                            type="text"
                                                            placeholder="+62 8XX XXXX XXXX"
                                                            value={formData.whatsapp}
                                                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B0082]/20 focus:border-[#4B0082] transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Message */}
                                                <div>
                                                    <label htmlFor="contact-msg" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                        Message <span className="text-red-400">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                                                        <textarea
                                                            id="contact-msg"
                                                            placeholder="How can we help you? Describe your visa needs..."
                                                            value={formData.message}
                                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                            required
                                                            rows={5}
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B0082]/20 focus:border-[#4B0082] transition-all resize-none"
                                                        />
                                                    </div>
                                                </div>

                                                {error && (
                                                    <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                                        {error}
                                                    </p>
                                                )}

                                                {/* Submit */}
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-gray-900 font-bold rounded-xl py-4 text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-amber-200"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4" />
                                                            Send Message
                                                        </>
                                                    )}
                                                </button>

                                                {/* Divider */}
                                                <div className="relative flex items-center gap-3 py-2">
                                                    <div className="flex-1 h-px bg-gray-100" />
                                                    <span className="text-xs text-gray-400 font-medium">or reach us directly</span>
                                                    <div className="flex-1 h-px bg-gray-100" />
                                                </div>

                                                {/* WhatsApp direct CTA */}
                                                <a
                                                    href={COMPANY_INFO.whatsappUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl py-3.5 text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-emerald-200"
                                                >
                                                    <MessageCircle className="w-5 h-5" />
                                                    Chat on WhatsApp — {COMPANY_INFO.whatsapp}
                                                </a>
                                            </form>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-6">
                                                <h2 className="text-2xl font-black text-red-600 mb-2">File a Complaint</h2>
                                                <p className="text-gray-500 text-sm">
                                                    We take service issues very seriously. Your complaint will be escalated directly to management.
                                                </p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                {/* Email */}
                                                <div>
                                                    <label htmlFor="complaint-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                        Email Address <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            id="complaint-email"
                                                            type="email"
                                                            placeholder="john@example.com"
                                                            value={complaintData.email}
                                                            onChange={(e) => setComplaintData({ ...complaintData, email: e.target.value })}
                                                            required
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* WhatsApp */}
                                                <div>
                                                    <label htmlFor="complaint-wa" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                        WhatsApp Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            id="complaint-wa"
                                                            type="text"
                                                            placeholder="+62 8XX XXXX XXXX"
                                                            value={complaintData.whatsapp}
                                                            onChange={(e) => setComplaintData({ ...complaintData, whatsapp: e.target.value })}
                                                            required
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Complaint Category Dropdown */}
                                                <div>
                                                    <label htmlFor="complaint-category" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                        Complaint Category <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        id="complaint-category"
                                                        value={complaintData.category}
                                                        onChange={(e) => setComplaintData({ ...complaintData, category: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all cursor-pointer"
                                                    >
                                                        <option value="Payment">Payment</option>
                                                        <option value="Visa Application">Visa Application</option>
                                                        <option value="Refund">Refund</option>
                                                        <option value="Services">Services</option>
                                                        <option value="Others">Others</option>
                                                    </select>
                                                </div>

                                                {/* Message */}
                                                <div>
                                                    <label htmlFor="complaint-msg" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                        Describe the Issue <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                                                        <textarea
                                                            id="complaint-msg"
                                                            placeholder="Please provide details of your complaint (order ID, what happened, etc.)..."
                                                            value={complaintData.message}
                                                            onChange={(e) => setComplaintData({ ...complaintData, message: e.target.value })}
                                                            required
                                                            rows={5}
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                                                        />
                                                    </div>
                                                </div>

                                                {error && (
                                                    <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                                        {error}
                                                    </p>
                                                )}

                                                {/* Submit */}
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-rose-700 hover:to-red-600 text-white font-bold rounded-xl py-4 text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-rose-200"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Submitting Complaint...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4" />
                                                            Submit Complaint
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </>
                            ) : (
                                /* ── Success State ── */
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                                        {activeForm === "inquiry" ? "Message Sent!" : "Complaint Submitted!"}
                                    </h3>
                                    <p className="text-gray-500 mb-8 max-w-xs text-sm leading-relaxed">
                                        {activeForm === "inquiry"
                                            ? "Thank you for reaching out. We'll get back to you within 2 business hours."
                                            : "Your complaint has been successfully logged. Our operations manager will contact you within 1 business hour."}
                                    </p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="btn btn-primary px-8 py-3 rounded-xl font-bold bg-[#4B0082] text-white hover:bg-[#3d006b] transition-colors"
                                    >
                                        {activeForm === "inquiry" ? "Send Another Message" : "Submit Another Complaint"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ── Review CTA card ── */}
                        <div className="mt-6 bg-gradient-to-br from-[#4B0082] to-[#1E005A] rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-5 shadow-xl shadow-purple-900/20">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                                </div>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-white font-black text-lg mb-1">Happy with our service?</h3>
                                <p className="text-white/70 text-sm">
                                    Help other travelers find us by leaving a quick Google review. It means the world to us!
                                </p>
                            </div>
                            <a
                                href={COMPANY_INFO.googleReviewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl px-6 py-3 text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                            >
                                <Star className="w-4 h-4 fill-current" />
                                Review Us on Google
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Bottom CTA Strip ─────────────────────────────────── */}
            <section className="border-t border-gray-100 py-10 px-4 bg-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-500 text-sm mb-4">
                        Looking for visa information? Check out our resources:
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href={`/${locale}/faq`} className="text-sm font-semibold text-[#4B0082] hover:underline underline-offset-4">
                            Visa FAQ
                        </Link>
                        <span className="text-gray-300">·</span>
                        <Link href={`/${locale}/services`} className="text-sm font-semibold text-[#4B0082] hover:underline underline-offset-4">
                            Our Services
                        </Link>
                        <span className="text-gray-300">·</span>
                        <Link href={`/${locale}/apply`} className="text-sm font-semibold text-[#4B0082] hover:underline underline-offset-4">
                            Apply Now
                        </Link>
                        <span className="text-gray-300">·</span>
                        <Link href={`/${locale}/pricing`} className="text-sm font-semibold text-[#4B0082] hover:underline underline-offset-4">
                            Pricing
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
