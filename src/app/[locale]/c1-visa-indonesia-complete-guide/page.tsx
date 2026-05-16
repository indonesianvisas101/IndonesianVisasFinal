import React from "react";
import { Metadata } from "next";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Link from "next/link";
import IDivCardModern from "@/components/idiv/IDivCardModern";
import { 
  ShieldCheck, 
  Plane, 
  Users, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Globe, 
  TrendingUp, 
  Lock, 
  BadgeCheck, 
  Info,
  Calendar,
  Shield,
  Search,
  BookOpen,
  Map,
  Scale
} from "lucide-react";
import dynamic from "next/dynamic";

const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview"));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';
  
  return {
    title: "Panduan Lengkap Visa C1 (B211A) Indonesia 2026-2027 | Wajib Sponsor",
    description: "Edukasi mendalam tentang Visa C1 (B211A) Indonesia. Mengapa negara Non-VOA wajib menggunakan sponsor perusahaan untuk masuk ke Indonesia secara legal. Panduan 180 hari tinggal.",
    keywords: ["visa c1 indonesia", "visa b211a", "sponsor visa indonesia", "panduan visa indonesia", "negara non voa indonesia", "calling visa indonesia", "indonesia immigration 2027", "bali visa guide"],
    authors: [{ name: "PT Indonesian Visas Agency", url: APP_URL }],
    publisher: "PT Indonesian Visas Agency",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${APP_URL}/${locale}/c1-visa-indonesia-complete-guide`,
    },
    openGraph: {
      type: "article",
      title: "Rahasia Masuk Indonesia: Panduan Edukasi Visa C1 & B211A (Edisi 2027)",
      description: "Segala hal yang perlu Anda ketahui tentang Visa C1, mulai dari persyaratan sponsor hingga aturan terbaru 2027 untuk negara Non-VOA.",
      url: `${APP_URL}/${locale}/c1-visa-indonesia-complete-guide`,
      siteName: "Indonesian Visas",
      images: [
        {
          url: `${APP_URL}/images/BaliHelpCompress.webp`,
          width: 1200,
          height: 630,
          alt: "Panduan Edukasi Visa C1 Indonesia",
        },
      ],
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: "Panduan Lengkap Visa C1 (B211A) Indonesia 2026-2027",
      description: "Edukasi mendalam tentang Visa C1 (B211A) Indonesia. Mengapa negara Non-VOA wajib menggunakan sponsor perusahaan.",
      images: [`${APP_URL}/images/BaliHelpCompress.webp`],
    }
  };
}

export default async function C1VisaEducationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    "name": "Panduan Edukasi Visa C1 (B211A) Indonesia",
    "description": "Modul edukasi komprehensif mengenai prosedur visa pengunjung C1 bagi warga negara asing yang tidak terdaftar dalam daftar VOA Indonesia.",
    "provider": { "@type": "Organization", "name": "PT Indonesian Visas Agency" },
    "educationalLevel": "Advanced",
    "datePublished": "2026-05-16"
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION - Clickbait & SEO Title */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-slate-900 text-white min-h-[90vh] flex items-center border-b-8 border-primary">
        <div className="absolute inset-0 z-0 opacity-40">
            <img src="/images/BaliHelpCompress.webp" alt="Edukasi Visa Indonesia" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-6xl">
            <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-red-600/20 border-2 border-red-500/50 text-red-500 text-sm font-black mb-12 animate-pulse uppercase tracking-[0.3em]">
                <AlertCircle size={20} />
                Critical Update: Aturan Sponsor 2026-2027
            </div>
            <h1 className="text-6xl md:text-9xl font-black mb-12 tracking-tighter leading-[0.85] italic">
                JANGAN TERBANG <br/>TANPA <span className="text-primary drop-shadow-[0_0_25px_rgba(124,58,237,0.6)] uppercase">VISA C1</span>
            </h1>
            <p className="text-2xl md:text-4xl text-slate-200 mb-16 font-bold leading-tight max-w-5xl mx-auto italic">
                Mengapa Negara <span className="text-white underline decoration-red-600 underline-offset-8">NON-REGISTERED</span> Wajib Memiliki Sponsor Perusahaan Legal untuk Masuk ke Indonesia.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
                <Link href="/apply" className="px-16 py-8 bg-primary text-white font-black rounded-3xl hover:scale-105 transition-all flex items-center gap-4 text-2xl shadow-[0_30px_70px_rgba(124,58,237,0.5)] border-2 border-white/30 uppercase italic">
                    AJUKAN VISA C1 SEKARANG <ArrowRight size={32} />
                </Link>
                <Link href="/list-country" className="px-16 py-8 bg-white/5 backdrop-blur-2xl text-white font-black rounded-3xl hover:bg-white/10 transition-all text-2xl border-2 border-white/20 shadow-2xl uppercase italic tracking-tighter">
                    CEK DAFTAR NEGARA
                </Link>
            </div>
        </div>
      </section>

      {/* 2. EXECUTIVE SUMMARY - Information Dense */}
      <SectionWrapper>
        <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1">
                <h2 className="text-6xl font-black mb-10 tracking-tighter text-slate-950 dark:text-white uppercase italic leading-none border-l-8 border-primary pl-8">Realitas <br/>Imigrasi 2027</h2>
                <div className="space-y-8 text-2xl text-slate-900 dark:text-white font-black leading-relaxed">
                    <p>
                        Indonesia telah memperketat sistem perbatasan secara digital. Bagi warga negara yang tidak terdaftar dalam <Link href="/list-country" className="text-primary hover:underline">Daftar Bebas Visa atau VOA</Link>, Anda tidak bisa masuk tanpa izin yang disetujui sebelumnya dari Jakarta.
                    </p>
                    <p className="text-slate-500 italic">
                        Visa C1 (sebelumnya dikenal sebagai B211A) adalah gerbang utama bagi dunia internasional untuk mengeksplorasi Indonesia dengan perlindungan hukum penuh dari sponsor lokal.
                    </p>
                </div>
            </div>
            <div className="order-1 md:order-2 bg-red-50 dark:bg-red-900/10 p-16 rounded-[5rem] border-4 border-red-600 shadow-3xl relative overflow-hidden">
                <div className="flex items-center gap-6 mb-10">
                    <div className="p-5 bg-red-600 text-white rounded-[2.5rem] shadow-2xl shadow-red-600/40">
                        <AlertCircle size={48} />
                    </div>
                    <h3 className="text-4xl font-black text-red-700 dark:text-red-400 italic tracking-tight uppercase">Peringatan Keras</h3>
                </div>
                <p className="text-xl font-bold text-red-900 dark:text-red-200 mb-8 italic">
                    Maskapai penerbangan berhak menolak boarding jika Anda berasal dari negara non-registrasi dan tidak membawa Dokumen Persetujuan Visa C1.
                </p>
                <ul className="space-y-6">
                    {[
                        "Tanpa VOA: Wajib Visa C1",
                        "Tanpa Sponsor: Aplikasi Ditolak",
                        "Tanpa E-Visa: Dilarang Boarding",
                        "Tanpa Perusahaan: Ilegal"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-5 font-black text-red-800 dark:text-red-300 text-2xl">
                            <CheckCircle2 size={32} className="text-red-600" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </SectionWrapper>

      {/* 3. TECHNICAL BREAKDOWN - C1 VS B211A */}
      <section className="py-32 bg-slate-100 dark:bg-white/5 border-y-4 border-slate-200 dark:border-white/10">
        <div className="container mx-auto px-4">
            <div className="text-center mb-24">
                <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-slate-950 dark:text-white uppercase italic">Anatomi Visa C1</h2>
                <div className="w-48 h-3 bg-primary mx-auto rounded-full mb-6" />
                <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.4em] text-sm">Transformasi dari B211A ke Standar Internasional</p>
            </div>
            <div className="grid md:grid-cols-4 gap-10">
                {[
                    { label: "KODE VISA", value: "C1", sub: "Status: Visitor", icon: <FileText size={40} /> },
                    { label: "MASA BERLAKU", value: "60 HARI", sub: "Awal Kedatangan", icon: <Calendar size={40} /> },
                    { label: "PERPANJANGAN", value: "2X 60 HARI", sub: "Total 180 Hari", icon: <BadgeCheck size={40} /> },
                    { label: "METODE", value: "SINGLE ENTRY", sub: "Satu Kali Masuk", icon: <Zap size={40} /> },
                ].map((spec, i) => (
                    <div key={i} className="p-12 bg-white dark:bg-black rounded-[4rem] shadow-2xl border-b-[15px] border-primary group hover:-translate-y-4 transition-all duration-700 text-center">
                        <div className="w-20 h-20 bg-slate-950 text-white rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:bg-primary transition-all rotate-3 group-hover:rotate-0">
                            {spec.icon}
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{spec.label}</p>
                        <p className="text-4xl font-black text-slate-950 dark:text-white mb-3 italic tracking-tighter">{spec.value}</p>
                        <p className="text-lg text-primary font-black uppercase italic tracking-widest">{spec.sub}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 4. THE NON-VOA REALITY - Internal Link to /list-country */}
      <SectionWrapper>
        <div className="bg-slate-950 text-white p-16 md:p-24 rounded-[6rem] border-4 border-white/10 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)]">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="grid md:grid-cols-3 gap-20 items-center relative z-10">
                <div className="md:col-span-2">
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 italic leading-[0.85] uppercase">Nasib Negara <br/><span className="text-red-500">Non-Registrasi</span></h2>
                    <p className="text-2xl text-slate-300 leading-relaxed font-bold mb-12 italic">
                        Banyak wisatawan terjebak di bandara karena berasumsi Indonesia mengizinkan VOA untuk semua negara. Faktanya, hanya negara tertentu yang bisa. Sisanya? **Wajib Visa C1 dengan Sponsor Perusahaan.**
                    </p>
                    <div className="flex flex-wrap gap-8">
                        <Link href="/list-country" className="px-12 py-6 bg-red-600 text-white rounded-3xl font-black text-2xl hover:bg-red-700 transition-all flex items-center gap-3 shadow-xl italic uppercase">
                            LIHAT DAFTAR NEGARA VOA <Search size={24} />
                        </Link>
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="p-10 bg-white/5 border-2 border-white/10 rounded-[3rem] backdrop-blur-xl group hover:border-red-500 transition-all">
                        <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-4 italic">Kategori Khusus</p>
                        <h4 className="text-3xl font-black mb-6 italic uppercase">Calling Visa</h4>
                        <p className="text-lg opacity-60 font-medium mb-8">Negara dengan kerentanan tertentu memerlukan persetujuan khusus dari Jakarta.</p>
                        <Link href="/calling-visa" className="text-primary font-black text-xl flex items-center gap-3 italic hover:translate-x-3 transition-transform">
                            INFO CALLING VISA <ArrowRight />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </SectionWrapper>

      {/* 5. THE CORPORATE SPONSORSHIP MANDATE */}
      <SectionWrapper>
        <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-4 text-primary font-black uppercase tracking-[0.5em] text-sm mb-12">
                <Lock size={24} />
                KEWAJIBAN HUKUM: SPONSOR KORPORASI
            </div>
            <h2 className="text-6xl md:text-9xl font-black mb-16 tracking-tighter text-slate-950 dark:text-white leading-[0.85] italic uppercase">
                SPONSOR ADALAH <br/><span className="text-primary">PENJAMIN ANDA</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-12 text-left">
                <div className="p-16 bg-slate-950 text-white rounded-[5rem] border-l-[15px] border-primary shadow-3xl hover:scale-[1.02] transition-transform">
                    <h3 className="text-4xl font-black mb-10 italic uppercase">Perusahaan vs Individu</h3>
                    <p className="text-slate-300 text-xl leading-relaxed font-bold mb-12">
                        Imigrasi Indonesia lebih memprioritaskan Sponsor Perusahaan (Corporate Sponsor) karena memiliki basis hukum dan jaminan finansial yang lebih kuat daripada sponsor perorangan.
                    </p>
                    <div className="p-8 bg-white/5 rounded-3xl border-2 border-white/10 italic font-black text-primary text-xl">
                        PT Indonesian Visas Agency memberikan jaminan penuh 100% untuk aplikasi Anda.
                    </div>
                </div>
                <div className="p-16 bg-slate-50 dark:bg-white/5 rounded-[5rem] border-4 border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-4xl font-black mb-10 text-slate-950 dark:text-white italic uppercase">Peran Sponsor</h3>
                    <ul className="space-y-6">
                        {[
                            "Menjamin perilaku baik selama di Indonesia",
                            "Melaporkan keberadaan WNA secara digital",
                            "Menanggung biaya repatriasi jika terjadi pelanggaran",
                            "Mengurus perpanjangan visa secara legal"
                        ].map((item, i) => (
                            <li key={i} className="flex gap-4 items-start text-xl font-bold text-slate-600 dark:text-slate-300">
                                <CheckCircle2 className="text-primary shrink-0 mt-1" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </SectionWrapper>

      {/* 6. STEP-BY-STEP ROADMAP */}
      <section className="py-32 bg-slate-950 text-white">
        <div className="container mx-auto px-4">
            <h2 className="text-6xl md:text-8xl font-black mb-24 text-center tracking-tighter italic uppercase">ALUR KERJA <span className="text-primary">VISA C1</span></h2>
            <div className="grid md:grid-cols-4 gap-12 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 z-0" />
                {[
                    { step: "01", title: "Submit Data", desc: "Kirim Paspor & Foto Portrait." },
                    { step: "02", title: "Approval Jakarta", desc: "Kami memproses via Imigrasi Pusat." },
                    { step: "03", title: "E-Visa Issued", desc: "Visa dikirim via Email/WhatsApp." },
                    { step: "04", title: "Ready to Fly", desc: "Bebas terbang ke Indonesia." },
                ].map((item, i) => (
                    <div key={i} className="relative z-10 p-10 bg-white/5 border-2 border-white/10 rounded-[3.5rem] backdrop-blur-md text-center hover:bg-primary transition-all duration-500 group">
                        <div className="text-6xl font-black text-primary group-hover:text-white mb-6 italic">{item.step}</div>
                        <h4 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">{item.title}</h4>
                        <p className="text-slate-400 group-hover:text-white/80 font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 7. FINANCIAL INTEGRITY & DEPOSITS */}
      <SectionWrapper>
        <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1">
                <div className="bg-amber-50 dark:bg-amber-900/10 p-16 rounded-[5rem] border-4 border-amber-500 shadow-3xl">
                    <h3 className="text-4xl font-black mb-10 text-amber-800 dark:text-amber-400 italic uppercase">Integritas Finansial</h3>
                    <p className="text-xl text-amber-900/80 dark:text-amber-200/80 mb-10 font-bold leading-relaxed">
                        Imigrasi mewajibkan sponsor memiliki bukti saldo yang cukup untuk menjamin tamu mereka. Dengan menggunakan jasa kami, kami menanggung persyaratan finansial tersebut di hadapan otoritas Indonesia.
                    </p>
                    <div className="flex items-center gap-4 p-6 bg-white dark:bg-black/40 rounded-2xl text-amber-600 font-black shadow-xl">
                        <ShieldCheck size={40} />
                        Aset Perusahaan Sebagai Jaminan Anda.
                    </div>
                </div>
            </div>
            <div className="order-1 md:order-2">
                <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter text-slate-950 dark:text-white italic uppercase leading-tight">BEBAS <br/>REPOT <span className="text-amber-500">BANK</span></h2>
                <p className="text-2xl text-slate-600 dark:text-slate-400 leading-loose font-medium italic">
                    Anda tidak perlu menunjukkan rekening koran pribadi berbulan-bulan. Kami sebagai korporasi yang akan melakukan "Bonding" untuk menjamin visa Anda disetujui.
                </p>
            </div>
        </div>
      </SectionWrapper>

      {/* 8. DOCUMENT CHECKLIST */}
      <section className="py-32 bg-slate-50 dark:bg-black/40">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="p-16 bg-white dark:bg-black rounded-[6rem] shadow-3xl border-4 border-primary/20">
                <h2 className="text-5xl font-black mb-16 text-center italic uppercase tracking-tighter underline decoration-primary decoration-8 underline-offset-[20px]">Checklist Dokumen</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        "Scan Paspor (Halaman Bio)",
                        "Paspor Berlaku Min. 6 Bulan",
                        "Foto Portrait Latar Belakang Putih",
                        "Tiket Masuk Indonesia",
                        "Bukti Vaksin (Opsional 2026/27)",
                        "Dokumen Pendukung Bisnis (Jika Perlu)"
                    ].map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl font-black text-slate-700 dark:text-white text-xl">
                            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle2 size={24} />
                            </div>
                            {doc}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* 9. THE CALLING VISA DISTINCTION */}
      <section className="py-32 bg-red-600 text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="inline-flex items-center gap-4 bg-white/20 px-8 py-3 rounded-full font-black mb-12 uppercase tracking-widest text-sm backdrop-blur-md">
                <AlertCircle /> NEGARA KHUSUS
            </div>
            <h2 className="text-6xl md:text-9xl font-black mb-12 tracking-tighter italic uppercase leading-none">CALLING <br/>VISA ZONE</h2>
            <p className="text-2xl md:text-4xl font-bold mb-16 leading-tight italic">
                Jika negara Anda masuk daftar <span className="underline decoration-white underline-offset-8">Calling Visa</span>, proses akan melibatkan Badan Intelijen dan Kemenkumham Pusat.
            </p>
            <Link href="/calling-visa" className="px-16 py-8 bg-white text-red-600 font-black rounded-3xl hover:scale-110 transition-all text-3xl shadow-2xl uppercase italic tracking-tighter">
                PELAJARI CALLING VISA <ArrowRight size={32} />
            </Link>
        </div>
      </section>

      {/* 10. EXTENSION LOGIC */}
      <SectionWrapper>
        <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-6xl font-black mb-10 tracking-tighter text-slate-950 dark:text-white italic uppercase">Aturan 60 + 60 + 60</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-10 bg-white dark:bg-white/5 rounded-[3rem] border-4 border-slate-100 dark:border-white/10 shadow-xl">
                    <p className="text-6xl font-black text-primary mb-4">60</p>
                    <p className="text-lg font-black text-slate-500 uppercase tracking-widest">HARI PERTAMA</p>
                </div>
                <div className="p-10 bg-white dark:bg-white/5 rounded-[3rem] border-4 border-primary shadow-xl">
                    <p className="text-6xl font-black text-primary mb-4">60</p>
                    <p className="text-lg font-black text-slate-500 uppercase tracking-widest">PERPANJANGAN 1</p>
                </div>
                <div className="p-10 bg-white dark:bg-white/5 rounded-[3rem] border-4 border-slate-100 dark:border-white/10 shadow-xl">
                    <p className="text-6xl font-black text-primary mb-4">60</p>
                    <p className="text-lg font-black text-slate-500 uppercase tracking-widest">PERPANJANGAN 2</p>
                </div>
            </div>
            <p className="mt-16 text-2xl text-slate-600 dark:text-slate-400 font-bold leading-loose">
                Total Anda bisa tinggal secara legal hingga **180 hari** tanpa perlu keluar dari Indonesia. Ini adalah keunggulan utama Visa C1 dibandingkan VOA.
            </p>
        </div>
      </SectionWrapper>

      {/* 11. B211A FOR BUSINESS & INVESTMENT */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter italic uppercase leading-none">B211A UNTUK <br/><span className="text-primary">BISNIS & INVESTASI</span></h2>
                    <p className="text-2xl text-slate-300 leading-relaxed font-bold mb-12">
                        Ingin mensurvei pasar atau meeting dengan klien di Indonesia? Visa C1/B211A adalah pilihan yang paling tepat dan legal untuk kegiatan pra-investasi.
                    </p>
                    <div className="space-y-6">
                        {[
                            "Meeting & Negosiasi Bisnis",
                            "Survei Lokasi Investasi",
                            "Seminar & Pelatihan Singkat",
                            "Kunjungan Audit Industri"
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-center text-xl font-black italic">
                                <Zap className="text-primary" /> {item}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative group w-full flex justify-center scale-90 md:scale-100">
                    <IDivCardModern mode="IDIV" variant="gold" autoRotate={true} showDownload={false} />
                </div>
            </div>
        </div>
      </section>

      {/* 12. DIGITAL NOMAD ADVANTAGE */}
      <SectionWrapper>
        <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-sm mb-12">
                <Globe /> DIGITAL NOMAD STRATEGY
            </div>
            <h2 className="text-6xl md:text-9xl font-black mb-16 tracking-tighter text-slate-950 dark:text-white leading-[0.85] italic uppercase">BEBAS KERJA <br/>DI MANA SAJA</h2>
            <p className="text-2xl text-slate-600 dark:text-slate-400 font-bold leading-loose max-w-4xl mx-auto mb-16">
                Visa C1 memberikan fleksibilitas bagi *Remote Worker* untuk tinggal di Bali, Jakarta, atau Lombok selama 6 bulan penuh sambil mengurus aplikasi <Link href="/gci" className="text-primary underline">Golden Visa</Link> atau KITAS Remote Worker (E33G).
            </p>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-slate-200 dark:border-white/10 text-center shadow-lg">
                    <h4 className="text-2xl font-black mb-4 uppercase italic">Stabilitas</h4>
                    <p className="text-slate-500 font-medium italic">Tidak perlu Visa-Run tiap bulan.</p>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-slate-200 dark:border-white/10 text-center shadow-lg">
                    <h4 className="text-2xl font-black mb-4 uppercase italic">Legalitas</h4>
                    <p className="text-slate-500 font-medium italic">Diakui secara nasional di sistem digital.</p>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-slate-200 dark:border-white/10 text-center shadow-lg">
                    <h4 className="text-2xl font-black mb-4 uppercase italic">Prioritas</h4>
                    <p className="text-slate-500 font-medium italic">Jaminan perlindungan dari sponsor.</p>
                </div>
            </div>
        </div>
      </SectionWrapper>

      {/* 13. FAQ / KNOWLEDGE BASE */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-black mb-16 text-center tracking-tighter italic uppercase underline decoration-primary decoration-8 underline-offset-[20px]">KOTAK ILMU (FAQ)</h2>
            <div className="space-y-10">
                {[
                    { q: "Apa beda Visa C1 dan B211A?", a: "Hanya namanya saja. C1 adalah kode baru dalam klasifikasi visa pengunjung Indonesia tahun 2024-2027, menggantikan kode B211A lama." },
                    { q: "Dapatkah saya apply C1 jika saya sudah di Bali?", a: "Hanya jika visa Anda saat ini adalah visa yang bisa dialih-statuskan. Biasanya, C1 paling umum diajukan saat Anda masih di Luar Negeri (Offshore)." },
                    { q: "Berapa lama proses persetujuannya?", a: "Normalnya 3-5 hari kerja. Namun dengan layanan Express kami, visa bisa selesai dalam 24-48 jam tergantung verifikasi Jakarta." },
                    { q: "Apakah sponsor harus perusahaan Indonesia?", a: "Ya. Perusahaan harus memiliki izin resmi (NIB) dan terdaftar di portal imigrasi sebagai penjamin WNA." }
                ].map((faq, i) => (
                    <div key={i} className="p-12 bg-white dark:bg-white/5 rounded-[4rem] border-2 border-slate-100 dark:border-white/10 shadow-2xl hover:border-primary transition-all group">
                        <h4 className="text-3xl font-black text-slate-950 dark:text-white mb-6 italic group-hover:text-primary transition-colors uppercase tracking-tighter">Q: {faq.q}</h4>
                        <p className="text-xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed">A: {faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </SectionWrapper>

      {/* 14. FINAL CALL TO ACTION */}
      <section className="py-48 relative overflow-hidden bg-white dark:bg-black border-t-8 border-primary">
        <div className="absolute inset-0 bg-primary/5 opacity-50" />
        <div className="container mx-auto px-4 text-center max-w-6xl relative z-10">
            <h2 className="text-7xl md:text-[11rem] font-black mb-12 tracking-tighter text-slate-950 dark:text-white leading-[0.8] italic uppercase">MULAI <br/><span className="text-primary drop-shadow-[0_0_30px_rgba(124,58,237,0.4)]">SEKARANG</span></h2>
            <p className="text-2xl md:text-5xl text-slate-500 dark:text-slate-400 font-black mb-20 leading-tight max-w-4xl mx-auto italic uppercase">
                Jangan ambil risiko deportasi. <br/>Gunakan jalur legal dengan sponsor korporasi.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-10">
                <Link href="/apply" className="px-20 py-10 bg-slate-950 text-white font-black rounded-[2.5rem] hover:scale-105 hover:bg-primary transition-all text-4xl shadow-3xl flex items-center justify-center gap-6 italic uppercase tracking-tighter border-4 border-white/10 group">
                    AJUKAN VISA C1 <ArrowRight size={48} className="group-hover:translate-x-4 transition-transform" />
                </Link>
                <Link href="/services" className="px-20 py-10 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-black rounded-[2.5rem] hover:bg-slate-900 hover:text-white transition-all text-4xl border-4 border-slate-200 dark:border-white/10 italic uppercase tracking-tighter shadow-2xl">
                    LIHAT LAYANAN
                </Link>
            </div>
            <p className="mt-24 text-xl text-slate-400 font-black uppercase tracking-[0.6em] italic">
                PT Indonesian Visas Agency™ - Digital Immigration Experts
            </p>
        </div>
      </section>

      {/* Services Preview (Internal Interlinking) */}
      <ServicesPreview dict={{}} />

    </div>
  );
}
