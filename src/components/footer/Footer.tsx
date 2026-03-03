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
                        </div>
                    </div>

                    {/* COLUMN 2: SERVICES */}
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>{t.services_title || "Services"}</h4>
                        <Link href={`/${locale}/apply`} className={styles.footerLink}>{t.apply_visa || "Apply Visa"}</Link>
                        <Link href={`/${locale}/extend`} className={styles.footerLink}>{t.visa_extension || "Visa Extension"}</Link>
                        <Link href={`/${locale}/pricing`} className={styles.footerLink}>{t.pricing || "Pricing"}</Link>
                        <Link href={`/${locale || 'en'}/company-formation`} className={styles.footerLink}>{t.company_reg || "Company Registration"}</Link>
                    </div>

                    {/* COLUMN 3: SUPPORT */}
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>{t.support_title || "Support"}</h4>
                        <Link href={`/${locale}/verification-explained`} className={styles.footerLink}>{t.verification || "Verification System"}</Link>
                        <Link href={`/${locale}/faq`} className={styles.footerLink}>{t.faq_help || "FAQ & Help"}</Link>
                        <Link href="https://wa.me/6285727041992" target="_blank" className={styles.footerLink}>{t.whatsapp_contact || "Contact via WhatsApp"}</Link>
                        <Link href={`mailto:${COMPANY_EMAILS.public.contact}`} className={styles.footerLink}>{t.email_support || "Email Support"}</Link>
                    </div>

                    {/* COLUMN 4: LEGAL */}
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>{t.legal_title || "Legal"}</h4>
                        <Link href={`/${locale}/privacy-policy`} className={styles.footerLink}>{t.privacy_policy || "Privacy Policy"}</Link>
                        <Link href={`/${locale}/terms-and-conditions`} className={styles.footerLink}>{t.terms_conditions || "Terms & Conditions"}</Link>
                        <Link href={`/${locale}/refund`} className={styles.footerLink}>{t.refund_policy || "Refund Policy"}</Link>
                        <Link href={`/${locale}/affiliate`} className={styles.footerLink}>{t.affiliate_program || "Affiliate Program"}</Link>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className={styles.bottomBar}>
                    <div className={styles.copyright}>
                        &copy; {new Date().getFullYear()} PT Indonesian Visas Agency™. {t.rights_reserved || "All Rights Reserved."}
                    </div>

                    {/* Network Links */}
                    <div className={styles.networkLinks}>
                        <a href="https://balihelp.id" target="_blank" rel="noopener noreferrer">balihelp.id</a>
                        <span className={styles.divider}>|</span>
                        <a href="https://voabali.com" target="_blank" rel="noopener noreferrer">voabali.com</a>
                        <span className={styles.divider}>|</span>
                        <a href="https://balivisas.agency" target="_blank" rel="noopener noreferrer">balivisas.agency</a>
                        <span className={styles.divider}>|</span>
                        <a href="https://voajakarta.com" target="_blank" rel="noopener noreferrer">voajakarta.com</a>
                        <span className={styles.divider}>|</span>
                        <a href="https://jakartavisas.agency" target="_blank" rel="noopener noreferrer">jakartavisas.agency</a>
                        <span className={styles.divider}>|</span>
                        <a href="https://mybisnis.app" target="_blank" rel="noopener noreferrer">mybisnis.app</a>
                        <span className={styles.divider}>|</span>
                        <a href="https://indodesign.website" target="_blank" rel="noopener noreferrer">indodesign.website</a>
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
