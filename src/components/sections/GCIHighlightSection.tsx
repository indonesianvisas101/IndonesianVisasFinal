"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { formatNavLink } from "@/utils/seo";

export default function GCIHighlightSection({ dict }: { dict?: any }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  return (
    <section className="py-24 relative overflow-hidden bg-slate-900">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Glassmorphic Card */}
          <div className="relative group p-[2px] rounded-[32px] overflow-hidden">
            {/* Infinity Glow Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-amber-400 to-blue-500 bg-[length:200%_auto] animate-gradient-xy opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 md:p-12 rounded-[30px] flex flex-col md:flex-row gap-12 items-center">
              
              {/* Left Side: Content */}
              <div className="flex-1 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-wider uppercase">
                  <Globe size={16} />
                  New Program 2026
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  Global Citizen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300">of Indonesia</span>
                </h2>
                
                <p className="text-lg text-slate-300 max-w-xl">
                  A lifetime legacy for the Indonesian Diaspora. Enjoy unlimited residency, work rights, and property ownership without the need for periodic extensions. The ultimate status for former WNI and their descendants.
                </p>

                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck size={20} className="text-amber-400" />
                    <span className="text-sm font-semibold italic">Unlimited ITAP Status</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Heart size={20} className="text-red-400" />
                    <span className="text-sm font-semibold italic">Preserving Blood Ties</span>
                  </div>
                </div>

                <div className="pt-8">
                  <Link 
                    href={formatNavLink(locale, "/gci")} 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-black hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                  >
                    Explore Diaspora Benefits <ArrowRight size={20} />
                  </Link>
                </div>
              </div>

              {/* Right Side: Visual Placeholder (GCI Infinity Image) */}
              <div className="w-full md:w-2/5 aspect-[4/5] rounded-[24px] overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                <Image 
                  src="/Global Citizen of Indonesia (GCI).webp" 
                  alt="Global Citizen of Indonesia (GCI) - Lifetime Legacy" 
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <div className="flex items-center gap-2 text-amber-400">
                    <div className="w-12 h-[2px] bg-amber-400" />
                    <span className="text-xs font-black tracking-widest uppercase">Unlimited Status</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          animation: gradient-xy 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
