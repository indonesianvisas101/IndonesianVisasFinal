"use client";

import React from "react";

const HeroGlobeSimple = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
            {/* Rotating Container */}
            <div className="relative w-[300px] h-[300px] md:w-[700px] md:h-[700px] animate-spin-slow">
                {/* Globe Grid - Longitude (Meridians) */}
                <div className="absolute inset-0 border border-indigo-900/30 dark:border-white/30 rounded-full"></div>
                <div className="absolute inset-0 border border-indigo-900/30 dark:border-white/30 rounded-full rotate-45 transform"></div>
                <div className="absolute inset-0 border border-indigo-900/30 dark:border-white/30 rounded-full -rotate-45 transform"></div>
                <div className="absolute inset-0 border border-indigo-900/30 dark:border-white/30 rounded-full rotate-90 transform"></div>

                {/* Globe Grid - Latitude (Parallels) */}
                <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] border-2 border-indigo-900/20 dark:border-white/20 rounded-full"></div>
                <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] border-2 border-indigo-900/20 dark:border-white/20 rounded-full"></div>
                <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] border-2 border-indigo-900/20 dark:border-white/20 rounded-full"></div>

                {/* Decorative Dots - GUARANTEED VISIBILITY */}
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-accent rounded-full shadow-lg z-10 border-2 border-white"></div>
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-accent rounded-full shadow-lg z-10 border-2 border-white"></div>
            </div>

            {/* World Map Overlay - HIGH CONTRAST */}
            <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] animate-pulse-slow overflow-visible">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-indigo-800 dark:text-white" strokeWidth="2" strokeOpacity="0.8" />
                </svg>
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 60s linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default HeroGlobeSimple;
