
'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, X, Loader2 } from 'lucide-react'
import styles from './header/Header.module.css'
import Image from 'next/image'
import { locales, LANGUAGE_DETAILS } from '@/i18n/locales'
import { formatNavLink } from '@/utils/seo'

interface ThemeLanguageToggleProps {
    toggleTheme: () => void;
    theme: string;
}

export function ThemeLanguageToggle({ toggleTheme, theme }: ThemeLanguageToggleProps) {
    const [showMenu, setShowMenu] = useState(false)
    const [isSwitching, setIsSwitching] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)
    const [longPressActive, setLongPressActive] = useState(false)

    const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
    const closeTimerRef = useRef<NodeJS.Timeout | null>(null)
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const pathname = usePathname()

    // Close menu on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Tooltip Introduction Logic
    useEffect(() => {
        const showTimer = setTimeout(() => setShowTooltip(true), 3000)
        const hideTimer = setTimeout(() => setShowTooltip(false), 9000)
        return () => {
            clearTimeout(showTimer)
            clearTimeout(hideTimer)
        }
    }, [])

    function handleLanguageChange(targetLocale: string) {
        const segments = pathname.split('/')
        let baseRelPath = '';
        
        // If current path starts with a locale, skip it
        if (segments.length > 1 && locales.includes(segments[1] as any)) {
            baseRelPath = '/' + segments.slice(2).join('/');
        } else {
            baseRelPath = pathname;
        }

        const newPath = formatNavLink(targetLocale, baseRelPath);
        
        document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000`
        router.push(newPath)
        router.refresh()
    }

    // Toggle Theme (Logic for Click)
    const handleThemeClick = (e: React.MouseEvent) => {
        // Only toggle if not coming from a long-press release
        if (longPressActive) {
            setLongPressActive(false);
            return;
        }
        toggleTheme();
    };

    // Desktop Hover Logic: Stay 3s, Close 2s
    function handleMouseEnter() {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

        // "Hover stay 3s" -> We show it immediately but ensure it stays "active"
        // The user says "Make the hover stay 3 Second when Open"
        // Usually this means it opens and doesn't close even if you jitter for 3s? 
        // Or it takes 3s of hovering to open? 
        // "Make the hover stay 3 Second when Open and Auto close 2 seconds when not on hover mode"
        // Interpretation: Opens ON HOVER. Stays open for at least 3s. If you leave, wait 2s before closing.

        setShowMenu(true);
    }

    function handleMouseLeave() {
        // Wait 2 seconds before closing
        closeTimerRef.current = setTimeout(() => {
            setShowMenu(false);
        }, 2000);
    }

    // Mobile Long Press Logic (4s)
    const handleTouchStart = () => {
        longPressTimerRef.current = setTimeout(() => {
            setShowMenu(true);
            setLongPressActive(true);
            // Vibrate if available for feedback
            if (navigator.vibrate) navigator.vibrate(50);
        }, 4000); // 4 Seconds
    };

    const handleTouchEnd = () => {
        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };

    return (
        <div
            className="relative z-[1005]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                onClick={handleThemeClick}
                onPointerDown={handleTouchStart}
                onPointerUp={handleTouchEnd}
                onPointerCancel={handleTouchEnd}
                className={styles.themeBtn}
                aria-label="Toggle Theme"
            >
                <div className="w-full h-full flex items-center justify-center relative group">
                    <Globe size={20} />

                    {/* Desktop Tooltip */}
                    <div
                        className={`hidden md:block absolute top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-black/90 dark:bg-white/90 text-white dark:text-black text-[11px] font-bold rounded-xl transition-all duration-300 pointer-events-none whitespace-nowrap z-[1006] shadow-2xl border border-white/10 ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                    >
                        Hover for Language • Click for {theme === 'light' ? 'Dark' : 'Light'} Mode
                    </div>

                    {/* Mobile Tooltip - Different Logic */}
                    <div
                        className={`md:hidden absolute top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-primary text-black text-[11px] font-bold rounded-xl transition-all duration-300 pointer-events-none whitespace-nowrap z-[1006] shadow-2xl ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                    >
                        Hold 4s (Language) • Click (Theme)
                    </div>
                </div>
            </button>


            {/* Language Menu */}
            {showMenu && (
                <div
                    ref={menuRef}
                    className="absolute top-14 right-0 w-[320px] max-h-[500px] rounded-[2rem] shadow-2xl border p-4 flex flex-col animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                        color: theme === 'dark' ? '#ffffff' : '#000000' /* True Black for Light Mode */
                    }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 px-2 border-b pb-2" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#f3f4f6' }}>
                        <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
                            <Globe size={18} className="text-primary" /> Select Language
                        </h3>
                        <button
                            onClick={() => setShowMenu(false)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            style={{ color: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Loading Overlay */}
                    {isSwitching && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-10 flex items-center justify-center rounded-[2rem] backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-2 text-primary">
                                <Loader2 size={32} className="animate-spin" />
                                <span className="font-bold text-sm">Switching Language...</span>
                            </div>
                        </div>
                    )}

                    {/* List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                        {locales.map((code) => (
                            <button
                                key={code}
                                onClick={() => handleLanguageChange(code)}
                                disabled={isSwitching}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${pathname.startsWith(`/${code}`) || (pathname === '/' && code === 'en') // approximation
                                    ? 'bg-primary/10 border border-primary text-primary font-bold shadow-sm'
                                    : 'hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'
                                    }`}
                                style={{
                                    /* Force text color for non-active items */
                                    color: (pathname.startsWith(`/${code}`) || (pathname === '/' && code === 'en'))
                                        ? '' // Let class handle primary color
                                        : (theme === 'dark' ? '#e2e8f0' : '#1f2937')
                                }}
                            >
                                <div className="w-8 h-6 relative shadow-sm rounded overflow-hidden shrink-0 border border-black/10">
                                    <Image
                                        unoptimized
                                        src={`https://flagcdn.com/${LANGUAGE_DETAILS[code].flag}.svg`}
                                        alt={LANGUAGE_DETAILS[code].label}
                                        width={32}
                                        height={24}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <span className="flex-1 text-left">{LANGUAGE_DETAILS[code].label}</span>
                                {(pathname.startsWith(`/${code}`) || (pathname === '/' && code === 'en')) && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
