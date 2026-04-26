import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    FileText, 
    Users, 
    Settings, 
    MessageSquare, 
    Briefcase,
    ShieldCheck,
    CreditCard,
    Building2
} from 'lucide-react';

const MENU_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Visa Applications', icon: FileText, href: '/admin/visa-applications' },
    { label: 'Company Formation', icon: Building2, href: '/admin/company-formation' },
    { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    { label: 'Messaging', icon: MessageSquare, href: '/admin/conversations' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin' || pathname === '/en/admin';
        return pathname.includes(href);
    };

    return (
        <aside className="w-80 h-screen bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-white/5 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-8 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black mode-aware-text tracking-tighter uppercase italic">Master</h1>
                        <p className="text-[10px] font-black text-primary tracking-widest uppercase opacity-60">Admin Dashboard</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                                active 
                                ? 'bg-primary text-black shadow-xl shadow-primary/20 font-bold scale-[1.02]' 
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary font-medium'
                            }`}
                        >
                            <Icon size={22} className={`${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                            <span className="text-sm tracking-tight">{item.label}</span>
                            {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 border-t border-slate-100 dark:border-white/5 space-y-4">
                <div className="p-5 bg-primary/10 rounded-3xl border border-primary/20 group hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <Briefcase size={16} />
                        </div>
                        <h4 className="text-xs font-black mode-aware-text uppercase tracking-widest">Enterprise</h4>
                    </div>
                    <p className="text-[10px] mode-aware-subtext leading-relaxed font-bold">Manage corporate accounts and bulk applications.</p>
                </div>
                
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-xs font-black mode-aware-text">Admin Master</span>
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
