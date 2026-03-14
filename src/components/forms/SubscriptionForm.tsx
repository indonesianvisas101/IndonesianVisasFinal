"use client";

import React from 'react';

export default function SubscriptionForm() {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubscribe = async () => {
        if (!email || !email.includes('@')) return;
        setStatus('loading');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-black rounded-[40px] p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Never Miss a Policy Change.</h2>
                <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                    Subscribe to our weekly immigration digest and stay ahead of the latest Indonesian visa regulations.
                </p>
                
                {status === 'success' ? (
                    <div className="bg-white/10 text-primary p-6 rounded-2xl font-bold animate-pulse">
                        Thanks for subscribing! Check your inbox soon.
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all"
                        />
                        <button 
                            onClick={handleSubscribe}
                            disabled={status === 'loading'}
                            className="bg-primary text-black font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Joining...' : 'Subscribe'}
                        </button>
                    </div>
                )}
                {status === 'error' && <p className="text-red-500 mt-4 font-bold">Something went wrong. Please try again.</p>}
            </div>
            {/* Background Decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
        </div>
    );
}
