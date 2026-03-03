import { sendGAEvent } from '@next/third-parties/google';

type EventName =
    | 'application_submitted'
    | 'chat_sent'
    | 'document_uploaded'
    | 'invoice_paid'
    | 'login';

export function trackEvent(eventName: EventName, params?: Record<string, any>) {
    try {
        if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID) {
            sendGAEvent('event', eventName, params || {});
        } else {
            console.log(`[Analytics] ${eventName}`, params);
        }
    } catch (e) {
        console.error("Analytics Error", e);
    }
}
