/**
 * Calculates a date by adding a specific number of working days (Mon-Fri).
 * 
 * @param startDate The starting date
 * @param daysToAdd Number of working days to add
 * @returns The resulting Date object
 */
export function addWorkingDays(startDate: Date, daysToAdd: number): Date {
    const date = new Date(startDate.getTime());
    let addedDays = 0;
    
    while (addedDays < daysToAdd) {
        date.setDate(date.getDate() + 1);
        const dayOfWeek = date.getDay();
        
        // 0 = Sunday, 6 = Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            addedDays++;
        }
    }
    
    return date;
}

/**
 * Formats a date to YYYY-MM-DD for HTML input[type="date"]
 */
export function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Maps Tier names to their respective processing working days
 */
export const TIER_WORKING_DAYS: Record<string, number> = {
    "Standard": 10,
    "Priority": 7,
    "Express": 5,
    "Negotiated": 10,
    "Custom": 10
};

/**
 * Resolves the number of working days for a given tier label
 */
export function getDaysForTier(tierLabel: string): number {
    const normalized = tierLabel.trim();
    if (normalized.toLowerCase().includes('priority')) return TIER_WORKING_DAYS.Priority;
    if (normalized.toLowerCase().includes('express')) return TIER_WORKING_DAYS.Express;
    if (normalized.toLowerCase().includes('negotiated')) return TIER_WORKING_DAYS.Negotiated;
    
    return TIER_WORKING_DAYS.Standard;
}
