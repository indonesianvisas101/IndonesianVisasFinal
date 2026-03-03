"use client";

import React, { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import styles from "./WhyChooseUs.module.css";
import { getGoogleReviews } from "@/actions/getGoogleReviews";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Mock Data
const MOCK_REVIEWS = [
    {
        author_name: "Sarah Jenkins",
        profile_photo_url: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        relative_time_description: "2 weeks ago",
        text: "Incredible service! I was worried about the visa process for my family, but the team handled everything professionally."
    },
    {
        author_name: "Michael Chen",
        profile_photo_url: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        relative_time_description: "a month ago",
        text: "Fastest KITAS processing I've experienced. They retrieved my documents from Jakarta without me needing to fly there."
    },
    {
        author_name: "Elena Rodriguez",
        profile_photo_url: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        relative_time_description: "3 days ago",
        text: "Professional, reliable, and transparent with pricing. No hidden fees. The expedited service was exactly as promised."
    },
    {
        author_name: "David Smith",
        profile_photo_url: "https://randomuser.me/api/portraits/men/45.jpg",
        rating: 5,
        relative_time_description: "1 week ago",
        text: "Great communication throughout. The team is very knowledgeable about the latest regulations."
    }
];

interface GoogleReviewsProps {
    variant?: 'default' | 'compact';
    showHeader?: boolean;
    className?: string;
    dict?: any;
}

const GoogleReviews = ({ variant = 'default', showHeader = true, className = "", dict }: GoogleReviewsProps) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set());
    const t = dict?.google_reviews || {};

    const [emblaRef] = useEmblaCarousel(
        { loop: true, align: 'start', dragFree: true },
        [Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })]
    );

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getGoogleReviews();
                if (data && data.length > 0) {
                    setReviews(data);
                } else {
                    setReviews(MOCK_REVIEWS); // Fallback to mocks if no data
                }
            } catch (error) {
                console.error("Failed to load reviews", error);
                setReviews(MOCK_REVIEWS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const isCompact = variant === 'compact';

    return (
        <div className={`w-full ${className}`}>
            {showHeader && (
                <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-500 font-bold uppercase tracking-widest">
                    <MapPin size={16} />
                    <span>{t.header || "Google Maps Reviews"}</span>
                </div>
            )}

            {/* Embla Carousel Wrapper */}
            <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing pb-4" ref={emblaRef}>
                <div className="flex gap-4 sm:gap-6 px-4" style={{ touchAction: 'pan-y pinch-zoom' }}>
                    {isLoading
                        ? [...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className={styles.reviewItem}
                                style={isCompact ? { flex: '0 0 240px', minHeight: '180px', padding: '0.75rem' } : undefined}
                            >
                                <div className={`flex items-center gap-4 mb-4 animate-pulse ${isCompact ? 'mb-2' : ''}`}>
                                    <div className={`${isCompact ? 'w-8 h-8' : 'w-12 h-12'} bg-gray-200 dark:bg-white/10 rounded-full`}></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded"></div>
                                        <div className="h-3 w-16 bg-gray-200 dark:bg-white/10 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded"></div>
                                    <div className="h-3 w-4/5 bg-gray-200 dark:bg-white/10 rounded"></div>
                                </div>
                            </div>
                        ))
                        : reviews.map((review, i) => (
                            <div
                                key={i}
                                className={styles.reviewItem}
                                style={isCompact ? { flex: '0 0 240px', minHeight: '180px', padding: '0.75rem' } : undefined}
                            >
                                <div className={`flex items-center mb-4 ${isCompact ? 'justify-between mb-1' : 'gap-4'}`}>
                                    {(!isCompact) && (
                                        <Image
                                            src={review.profile_photo_url}
                                            alt={review.author_name}
                                            className="rounded-full border-2 border-primary/20 object-cover"
                                            width={48}
                                            height={48}
                                        />
                                    )}
                                    <div>
                                        <h4 className={`font-bold mode-aware-text mb-1 ${isCompact ? 'text-sm truncate' : 'text-base'}`}>
                                            {review.author_name || "Google User"}
                                        </h4>
                                        <div className={`flex items-center ${isCompact ? 'text-[10px]' : 'gap-1 text-xs'} text-yellow-400`}>
                                            {[...Array(5)].map((_, s) => (
                                                <span key={s}>{s < Math.round(review.rating) ? (isCompact ? "★" : <Star size={12} fill="currentColor" />) : (isCompact ? "☆" : null)}</span>
                                            ))}
                                            {!isCompact && <span className="text-gray-400 ml-1 font-normal">{review.relative_time_description}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow flex flex-col mb-4">
                                    <p
                                        className={`mode-aware-subtext ${isCompact ? 'text-xs italic leading-snug' : 'text-sm leading-relaxed'} transition-all duration-300`}
                                        style={!expandedIndexes.has(i) ? {
                                            display: "-webkit-box",
                                            WebkitLineClamp: isCompact ? 4 : 5,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        } : {}}
                                    >
                                        "{review.text}"
                                    </p>
                                    {review.text.length > 150 && (
                                        <button
                                            onClick={() => {
                                                setExpandedIndexes(prev => {
                                                    const next = new Set(prev);
                                                    if (next.has(i)) next.delete(i);
                                                    else next.add(i);
                                                    return next;
                                                });
                                            }}
                                            className="text-primary hover:text-primary-dark text-xs font-bold text-left mt-1 underline decoration-dotted underline-offset-4"
                                            aria-label={expandedIndexes.has(i) ? "Show less of the review" : "Read more of the review"}
                                        >
                                            {expandedIndexes.has(i) ? (t.show_less || "Show less") : (t.read_more || "Read more")}
                                        </button>
                                    )}
                                </div>
                                <div className={`flex items-center ${isCompact ? 'justify-between mt-auto pt-1' : 'gap-2 mt-auto pt-4 mx-auto'} border-t border-gray-100 dark:border-white/5 opacity-50`}>
                                    <Image src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width={isCompact ? 12 : 16} height={isCompact ? 12 : 16} />
                                    {isCompact ? (
                                        <span className="text-[10px]">{review.relative_time_description}</span>
                                    ) : (
                                        <span className="text-xs font-bold text-gray-500">{t.posted_on || "Posted on Google"}</span>
                                    )}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className={`text-center text-gray-400 ${isCompact ? 'text-xs mt-3' : 'text-sm mt-4'}`}>
                {t.swipe_hint || "← Swipe to see more →"}
            </div>
        </div>
    );
};

export default GoogleReviews;
