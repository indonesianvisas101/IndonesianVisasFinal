"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, Sun, MoonIcon, LogOut, Search, LayoutDashboard, FileText, Users, TrendingUp, ShieldCheck, Building2, Globe, History, Brain, BarChart3, ShoppingCart, Megaphone, MessageSquare } from "lucide-react";
import styles from "./Header.module.css";
import React from "react";
import { useAuth } from "../auth/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { ThemeLanguageToggle } from "../ThemeLanguageToggle";

const AuthModal = dynamic(() => import("../auth/AuthModal"), { ssr: false });
const ContactModal = dynamic(() => import("../contact/ContactModal"), { ssr: false });
const GlobalSearch = dynamic(() => import("../search/GlobalSearch"), { ssr: false });

const Header = ({ dict, locale }: { dict?: any; locale: string }) => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [theme, setTheme] = useState('light');
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const headerDict = dict?.header || {};

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        const storedTheme = localStorage.getItem('theme') || 'light';
        setTheme(storedTheme);
        document.documentElement.setAttribute('data-theme', storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');

        window.addEventListener("scroll", handleScroll);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const isAdminOnAdminPage = user?.role === 'admin' && pathname?.startsWith('/admin');

    const adminTabs = [
        { label: 'Overview', key: 'dashboard', icon: <LayoutDashboard size={16} /> },
        { label: 'Visa Database', key: 'visas', icon: <FileText size={16} /> },
        { label: 'User Management', key: 'users', icon: <Users size={16} /> },
        { label: 'Popular Visa', key: 'popular_visas', icon: <TrendingUp size={16} /> },
        { label: 'Arrival Cards', key: 'arrival_cards', icon: <FileText size={16} /> },
        { label: 'Verification', key: 'verification', icon: <ShieldCheck size={16} /> },
        { label: 'Company Services', key: 'company_services', icon: <Building2 size={16} /> },
        { label: 'Invoicing', key: 'invoicing', icon: <FileText size={16} /> },
        { label: 'Audit Logs', key: 'logs', icon: <History size={16} /> },
        { label: 'AI Master', key: 'ai_master', icon: <Brain size={16} /> },
        { label: 'Marketing', key: 'marketing', icon: <BarChart3 size={16} /> },
        { label: 'Incoming Orders', key: 'orders', icon: <ShoppingCart size={16} /> },
        { label: 'Immigration Updates', key: 'updates', icon: <Megaphone size={16} /> },
        { label: 'Support Chat', key: 'support', icon: <MessageSquare size={16} /> },
    ];

    const [showSearchTooltip, setShowSearchTooltip] = useState(false);
    const [showProfileTooltip, setShowProfileTooltip] = useState(false);
    const searchTooltipTimer = React.useRef<NodeJS.Timeout | null>(null);
    const profileTooltipTimer = React.useRef<NodeJS.Timeout | null>(null);

    const handleSearchHover = (isEntering: boolean) => {
        if (searchTooltipTimer.current) clearTimeout(searchTooltipTimer.current);
        if (isEntering) {
            searchTooltipTimer.current = setTimeout(() => setShowSearchTooltip(true), 400); // 0.4s delay for "non-instant"
        } else {
            setShowSearchTooltip(false);
        }
    };

    return (
        <>
            <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
                <div className="container">
                    <nav className={styles.nav}>
                        <Link href={`/${locale}`} className={styles.logo}>
                            <span className={styles.logoText}>Indonesian Visas</span>
                            <div className={styles.logoIcon}>
                                <Image
                                    src="/Favicon.webp"
                                    alt="Indonesian Visas"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>

                        {isAdminOnAdminPage && (
                            <div className="relative ml-2 md:ml-8 z-50">
                                <button
                                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                                    className="flex items-center justify-center w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:scale-110 transition-all shadow-lg border border-white/10"
                                >
                                    <Globe size={20} />
                                </button>
                                {isAdminMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" onClick={() => setIsAdminMenuOpen(false)}></div>
                                        <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 mt-3 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 py-2">
                                            {adminTabs.map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    onClick={() => {
                                                        router.push(`/admin?tab=${tab.key}`);
                                                        setIsAdminMenuOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                >
                                                    {tab.icon}
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <div className={`${styles.desktopMenu} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}>
                            <Link href={`/${locale}`} className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                                {headerDict.home || "Home"}
                            </Link>
                            <Link href={`/${locale}/services`} className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                                {headerDict.services || "Services"}
                            </Link>
                            <Link href={`/${locale}/about`} className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                                {headerDict.about || "About"}
                            </Link>
                            <Link href={`/${locale}/faq`} className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                                {headerDict.faq || "FAQ"}
                            </Link>

                            {user && (
                                <>
                                    <Link
                                        href={user.role === 'admin' ? `/${locale}/admin` : `/${locale}/${user.name ? user.name.toLowerCase().replace(/\s+/g, '_') : 'profile'}`}
                                        className={styles.navLink}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {headerDict.dashboard || "Dashboard"}
                                    </Link>

                                    {/* Mobile Only: Admin Navigation Links */}
                                    {user.role === 'admin' && (
                                        <div className="md:hidden flex flex-col gap-1 pl-4 border-l-2 border-primary/20 mt-2 mb-4">
                                            {adminTabs.map((tab) => (
                                                <Link
                                                    key={tab.key}
                                                    href={`/${locale}/admin?tab=${tab.key}`}
                                                    className="py-2 text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-2"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {tab.icon}
                                                    {tab.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            <div className={styles.mobileDivider}></div>

                            <div className={styles.actionButtons}>
                                <div className="relative group">
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsSearchOpen(true);
                                        }}
                                        onMouseEnter={() => handleSearchHover(true)}
                                        onMouseLeave={() => handleSearchHover(false)}
                                        className={styles.themeBtn}
                                    >
                                        <Search size={20} />
                                    </button>
                                    {/* Search Tooltip */}
                                    <div className={`absolute top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 dark:bg-white/90 text-white dark:text-black text-[10px] font-bold rounded-lg whitespace-nowrap shadow-xl border border-white/10 transition-all duration-300 pointer-events-none z-[1001] animate-in fade-in slide-in-from-top-2 ${showSearchTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                        Search what you need
                                    </div>
                                </div>

                                <ThemeLanguageToggle toggleTheme={toggleTheme} theme={theme} />

                                {!user ? (
                                    <Link
                                        href={`/${locale}/login`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={styles.themeBtn}
                                        role="button"
                                        title={headerDict.login || "Log In"}
                                    >
                                        <User size={20} />
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white overflow-hidden">
                                                {user.avatar ? (
                                                    <Image
                                                        src={user.avatar}
                                                        alt={user.name || 'User'}
                                                        width={24}
                                                        height={24}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User size={14} />
                                                )}
                                            </div>
                                            <span className="text-white text-xs font-medium truncate max-w-[80px]">{(user.name || 'User').split(' ')[0]}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                await logout();
                                            }}
                                            className={styles.themeBtn}
                                        >
                                            <LogOut size={20} />
                                        </button>
                                    </div>
                                )}

                                <button
                                    className={styles.contactBtn}
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsContactModalOpen(true);
                                    }}
                                    style={{
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                                        color: 'white',
                                        border: 'none',
                                        boxShadow: '0 8px 30px rgba(251, 191, 36, 0.4)'
                                    }}
                                >
                                    {headerDict.contact || "Contact Us"}
                                </button>
                            </div>
                        </div>

                        <button className={styles.mobileToggle} onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </nav>
                </div>
                {isMobileMenuOpen && <div className={styles.overlay} onClick={toggleMobileMenu}></div>}

                {isMounted && (
                    <>
                        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
                        <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
                        <GlobalSearch
                            isOpen={isSearchOpen}
                            onClose={() => setIsSearchOpen(false)}
                            locale={locale}
                        />
                    </>
                )}
            </header>
        </>
    );
};

export default Header;
