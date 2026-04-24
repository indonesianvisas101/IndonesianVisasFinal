"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ThreeDCardVisualProps {
    title: string;
    subtitle: string;
    className?: string;
}

const ThreeDCardVisual: React.FC<ThreeDCardVisualProps> = ({ title, subtitle, className }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative flex items-center justify-center p-4 perspective-1000 ${className}`}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={`relative w-64 h-96 rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-tr from-slate-50 to-blue-50 p-6 flex flex-col border border-slate-200`}
            >
                {/* 1. Header: Official Banner */}
                <div className="flex flex-col items-center gap-2 mb-6 border-b border-slate-200 pb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <div className="w-6 h-6 border-2 border-white rounded-full opacity-60" />
                    </div>
                    <div className="text-center">
                        <h5 className="text-[12px] font-black text-blue-900 tracking-tighter uppercase leading-none">Republik Indonesia</h5>
                        <p className="text-[8px] font-black text-blue-500 uppercase mt-1">Smart Electronic Identity</p>
                    </div>
                </div>

                {/* 2. Main content: Large Portrait */}
                <div className="flex flex-col items-center gap-4 flex-1">
                    <div className="w-32 h-40 bg-white rounded-2xl border-2 border-slate-100 shadow-inner flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                            <div className="w-10 h-10 bg-slate-300 rounded-full" />
                        </div>
                        <div className="w-16 h-3 bg-slate-200 rounded-full" />
                        <div className="absolute bottom-2 right-2 w-8 h-8 opacity-20 bg-blue-900 rounded-full blur-[4px]" />
                    </div>

                    <div className="text-center space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">{title}</h4>
                        <p className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{subtitle}</p>
                    </div>
                </div>

                {/* 3. Footer: Barcode + Security */}
                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
                    <div className="w-full h-8 flex gap-1 justify-center opacity-40">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className={`h-full bg-slate-900 ${i % 3 === 0 ? 'w-[1px]' : 'w-[2px]'}`} />
                        ))}
                    </div>
                    <div className="flex justify-between w-full items-center">
                        <span className="text-[10px] font-mono font-bold text-slate-400 tracking-tighter">IND-ID-2026</span>
                        <div className="w-8 h-8 p-1 bg-white border border-slate-100 rounded-md">
                            <div className="w-full h-full bg-slate-800 rounded-[1px]" />
                        </div>
                    </div>
                </div>

                {/* Shimmer Effect */}
                <motion.div 
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.1), transparent)",
                    }}
                    className="absolute inset-0 w-[200%] pointer-events-none"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>
        </div>
    );
};

export default ThreeDCardVisual;
