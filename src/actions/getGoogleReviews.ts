"use server";

import { supabase } from "@/lib/supabase";

interface GoogleReview {
    author_name: string;
    profile_photo_url: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
}

interface GooglePlacesResponse {
    result: {
        reviews: GoogleReview[];
    };
    status: string;
}

export async function getGoogleReviews(): Promise<GoogleReview[]> {
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLACE_ID || process.env.GOOGLE_PLACE_ID;

    console.log("Fetching reviews...");

    // 1. Try to fetch from Supabase first (Cache)
    try {
        const { data: cachedReviews, error } = await supabase
            .from('google_reviews')
            .select('*')
            .order('time', { ascending: false })
            .limit(5);

        if (!error && cachedReviews && cachedReviews.length > 0) {
            console.log("Returning cached reviews from Supabase");
            return cachedReviews as GoogleReview[];
        }
    } catch (dbError) {
        console.error("Supabase Cache Error:", dbError);
    }

    // 2. Fetch from Google Maps API
    if (!GOOGLE_API_KEY || !PLACE_ID) {
        console.warn("Google credentials missing in environment variables.");
        return [];
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_API_KEY}&language=en`;

        const res = await fetch(url, { next: { revalidate: 3600 } });
        const data: GooglePlacesResponse = await res.json();

        if (data.status !== "OK" || !data.result.reviews) {
            console.error("Google Places API Error:", data.status);
            return [];
        }

        // 3. Process and Save to Supabase
        const reviews = data.result.reviews;

        // Filter and format (Top 5 4+ star reviews)
        const bestReviews = reviews
            .filter(r => r.rating >= 4)
            .slice(0, 10);

        const upsertData = bestReviews.map(review => ({
            author_name: review.author_name,
            profile_photo_url: review.profile_photo_url,
            rating: review.rating,
            relative_time_description: review.relative_time_description,
            text: review.text,
            time: review.time || Math.floor(Date.now() / 1000) // Fallback if time missing
        }));

        try {
            // Simplest strategy: Delete old ones, insert new ones
            const { error: deleteError } = await supabase.from('google_reviews').delete().neq('rating', 0);
            if (!deleteError) {
                await supabase.from('google_reviews').insert(upsertData);
            }
        } catch (saveError) {
            console.error("Failed to save to Supabase:", saveError);
        }

        return bestReviews.slice(0, 5);

    } catch (error) {
        console.error("Error fetching Google Reviews:", error);
        return [];
    }
}
