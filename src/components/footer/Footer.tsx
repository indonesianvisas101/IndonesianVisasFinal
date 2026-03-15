"use client";

import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";

import { COMPANY_EMAILS } from "@/constants/contact";

const Footer = ({ dict, locale }: { dict?: any; locale: string }) => {
    const t = dict?.footer || {};

    return (
        <footer className={styles.footer}>
            <div className="container">
                {/* 4-COLUMN GRID */}
                <div className={styles.gridContainer}>

                    {/* COLUMN 1: BRANDING */}
                    <div className={styles.brandColumn}>
                        <h3 className={styles.brandTitle}>{t.brand_title || "Indonesian Visas"}</h3>
                        <p className={styles.brandTagline}>
                            {t.brand_tagline || "Your trusted legal gateway to living and working in Indonesia."}
                        </p>
                        <div className={styles.authorityBox}>
                            <p className={styles.authorityLabel}>{t.operated_by || "Operated by"}</p>
                            <p className={styles.authorityName}>{t.company_name || "PT Indonesian Visas Agency™"}</p>
                            <p className={styles.authorityRegion}>{t.region || "Bali, Indonesia"}</p>
                            <div className="mt-4 text-[10px] text-gray-400 dark:text-gray-500 space-y-0.5 leading-tight font-mono">
                                <p>NIB: 0402260034806</p>
                                <p>License: 04022610215171007</p>
                                <p>AHU-00065.AH.02.01.TAHUN 2020</p>
                                <p>Sponsor: 2010, 2014, 2023, 2024, 2026</p>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: SERVICES */}
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>{t.services_title || "Services"}</h4>
                        <Link href={`/${locale}/apply`} className={styles.footerLink}>{t.apply_visa || "Apply Visa"}</Link>
                        <Link href={`/${locale}/extend`} className={styles.footerLink}>{t.visa_extension || "Visa Extension"}</Link>
                        <Link href={`/${locale}/pricing`} className={styles.footerLink}>{t.pricing || "Pricing"}</Link>
                        <Link href={`/${locale || 'en'}/company-formation`} className={styles.footerLink}>{t.company_reg || "Company Registration"}</Link>
                        <Link href={`/${locale}/travel`} className={styles.footerLink}>{t.travel || "Travel"}</Link>
                        <Link href={`/${locale || 'en'}/idiv-search`} className={styles.footerLink}>Track IDiv</Link>
                        <Link href={`/${locale || 'en'}/apply?visa=IDIV`} className={styles.footerLink}>
                            Order IDiv Card <span className="text-[8px] bg-primary text-white px-1.5 py-0.5 rounded-full ml-1 font-bold">HOT</span>
                        </Link>
                    </div>

                    {/* COLUMN 3: SUPPORT */}
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>{t.support_title || "Support"}</h4>
                        <Link href={`/${locale}/verification-explained`} className={styles.footerLink}>{t.verification || "Verification System"}</Link>
                        <Link href={`/${locale}/faq`} className={styles.footerLink}>{t.faq_help || "FAQ & Help"}</Link>
                        <Link href={`/${locale}/indonesia-visa-updates`} className={styles.footerLink}>Immigration Updates</Link>
                        <Link href={`/${locale}/sitemap`} className={styles.footerLink}>{t.sitemap || "Site Map"}</Link>
                        <Link href="https://wa.me/6285727041992" target="_blank" className={styles.footerLink}>{t.whatsapp_contact || "Contact via WhatsApp"}</Link>
                        <Link href={`mailto:${COMPANY_EMAILS.public.contact}`} className={styles.footerLink}>{t.email_support || "Email Support"}</Link>
                    </div>

                    {/* COLUMN 4: LEGAL */}
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>{t.legal_title || "Legal"}</h4>
                        <Link href={`/${locale}/privacy-policy`} className={styles.footerLink}>{t.privacy_policy || "Privacy Policy"}</Link>
                        <Link href={`/${locale}/terms-and-conditions`} className={styles.footerLink}>{t.terms_conditions || "Terms & Conditions"}</Link>
                        <Link href={`/${locale}/refund`} className={styles.footerLink}>{t.refund_policy || "Refund Policy"}</Link>
                        <Link href={`/${locale}/help`} className={styles.footerLink}>Help Center</Link>
                        <Link href={`/${locale}/affiliate`} className={styles.footerLink}>{t.affiliate_program || "Affiliate Program"}</Link>
                        
                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5">
                            <a 
                                href="https://bali.enterprises" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs font-black tracking-widest text-primary hover:opacity-70 transition-all uppercase italic flex items-center gap-2 group"
                            >
                                bali.enterprises
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className={styles.bottomBar}>
                    <div className={styles.copyright}>
                        &copy; {new Date().getFullYear()} PT Indonesian Visas Agency™. {t.rights_reserved || "All Rights Reserved."}
                    </div>

                    {/* Global Disclaimer */}
                    <p className={styles.disclaimer}>
                        {t.disclaimer || "Indonesian Visas provides administrative assistance. Final immigration approval remains the authority of the Indonesian government."}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
