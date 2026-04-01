"use client";

import React, { useState } from "react";
import { Globe, ChevronRight, Loader2, CheckCircle } from "lucide-react";

export default function GCIFinalCTA({ 
  gciCta, 
  email, 
  setEmail,
  locale
}: { 
  gciCta: any, 
  email: string, 
  setEmail: (val: string) => void,
  locale: string
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes('@') || !name) return;
    
    setLoading(true);
    setError(false);
    
    try {
      const res = await fetch('/api/gci/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, locale })
      });
      
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-32 bg-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Globe className="w-full h-full scale-150 rotate-12" />
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        {success ? (
          <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
            <CheckCircle className="w-24 h-24 text-white mb-8" />
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 italic">
              Application Received
            </h2>
            <p className="text-xl text-blue-100 font-bold">
              Check your inbox ({email}) for the tactical briefing package.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight italic">
              {gciCta.title}
            </h2>
            <p className="text-xl text-blue-100 mb-12 font-bold">
              {gciCta.subtitle}
            </p>
            <div className="flex flex-col gap-4 max-w-2xl mx-auto rounded-[2.5rem] p-2 bg-white/10 backdrop-blur-md border border-white/20">
               <div className="flex flex-col md:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder={gciCta.name_placeholder || "Full Legal Name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="flex-1 px-8 py-5 rounded-full bg-white text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-400 placeholder:text-slate-400"
                  />
                  <input 
                    type="email" 
                    placeholder={gciCta.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="flex-1 px-8 py-5 rounded-full bg-white text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-400 placeholder:text-slate-400"
                  />
               </div>
               <button 
                 onClick={handleSubmit}
                 disabled={loading || !email || !name}
                 className="w-full py-5 rounded-full bg-slate-950 text-white font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
               >
                 {loading ? <Loader2 className="animate-spin" /> : <>{gciCta.button} <ChevronRight /></>}
               </button>
            </div>
            {error && <p className="mt-4 text-red-300 font-bold">Failed to send. Please try again or contact support.</p>}
          </>
        )}
      </div>
    </section>
  );
}
