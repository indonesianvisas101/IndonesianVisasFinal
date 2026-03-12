"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = [
    "/images/IndonesianVisas/BaliHelp.webp",
    "/images/IndonesianVisas/Lombok.webp",
    "/images/IndonesianVisas/indonesia.webp",
    "/images/IndonesianVisas/java.webp",
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2638&auto=format&fit=crop",  // Optimized Bali Image
];


interface PhotoCollageProps {
    className?: string;
}

const PhotoCollage = ({ className = "" }: PhotoCollageProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
        }, 3000); // 3 seconds interval

        return () => clearInterval(timer);
    }, [isPaused]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    };

    return (
        <div
            className={`relative w-full h-full overflow-hidden cursor-pointer ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={handleNext}
            title="Click for next, Hold to pause"
        >
            {/* Background/Base Image (to prevent white flash) */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={IMAGES[currentIndex]}
                        alt={`Indonesian Visas Gallery ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1200px"
                        priority={currentIndex === 0}
                    />


                    {/* subtle overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {IMAGES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                            ? "bg-white w-6"
                            : "bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};


export default PhotoCollage;
