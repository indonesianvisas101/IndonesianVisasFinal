
import { Locale } from './locales';

export async function getMessages(locale: string) {
    try {
        return (await import(`./messages/${locale}.json`)).default;
    } catch (error) {
        // Fallback to default locale (English) if the specific locale file is missing or fails
        return (await import(`./messages/en.json`)).default;
    }
}
