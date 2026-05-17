/**
 * Simple deterministic hash: converts any string into a stable 8-digit number.
 * Used as a last-resort fallback so the ID never changes between renders.
 */
function deterministicHash8(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  // Ensure it's always positive and exactly 8 digits
  const positive = Math.abs(hash) % 90000000 + 10000000;
  return String(positive);
}


// ITU-T Country Code Map: Country Name → 2-digit code (first 2 digits of dial code)
const COUNTRY_CODE_MAP: Record<string, string> = {
  // === ASIA ===
  "indonesia": "62",
  "india": "91",
  "china": "86",
  "japan": "81",
  "south korea": "82",
  "korea": "82",
  "thailand": "66",
  "vietnam": "84",
  "malaysia": "60",
  "singapore": "65",
  "philippines": "63",
  "myanmar": "95",
  "cambodia": "85",
  "laos": "85",
  "bangladesh": "88",
  "sri lanka": "94",
  "nepal": "97", // +977 → 97
  "pakistan": "92",
  "afghanistan": "93",
  "iran": "98",
  "iraq": "96", // +964 → 96
  "jordan": "96", // +962 → 96
  "israel": "97", // +972 → 97
  "saudi arabia": "96", // +966 → 96
  "uae": "97", // +971 → 97
  "united arab emirates": "97",
  "qatar": "97", // +974 → 97
  "kuwait": "96", // +965 → 96
  "bahrain": "97", // +973 → 97
  "oman": "96", // +968 → 96
  "yemen": "96", // +967 → 96
  "turkey": "90",
  "turkiye": "90",
  "taiwan": "88", // +886 → 88
  "hong kong": "85", // +852 → 85
  "macau": "85", // +853 → 85
  "mongolia": "97", // +976 → 97
  "kazakhstan": "77",
  "uzbekistan": "99", // +998 → 99

  // === EUROPE ===
  "france": "33",
  "germany": "49",
  "united kingdom": "44",
  "uk": "44",
  "england": "44",
  "italy": "39",
  "spain": "34",
  "netherlands": "31",
  "belgium": "32",
  "switzerland": "41",
  "austria": "43",
  "sweden": "46",
  "norway": "47",
  "denmark": "45",
  "finland": "35", // +358 → 35
  "poland": "48",
  "czech republic": "42", // +420 → 42
  "hungary": "36",
  "romania": "40",
  "portugal": "35", // +351 → 35
  "greece": "30",
  "ireland": "35", // +353 → 35
  "ukraine": "38",
  "russia": "74",
  "russia moscow": "74",
  "russia saint": "78",
  "croatia": "38", // +385 → 38
  "serbia": "38", // +381 → 38
  "slovakia": "42", // +421 → 42
  "bulgaria": "35", // +359 → 35
  "luxembourg": "35", // +352 → 35

  // === AMERICAS ===
  "united states": "12",
  "usa": "12",
  "us": "12",
  "canada": "13",
  "mexico": "52",
  "brazil": "55",
  "argentina": "54",
  "colombia": "57",
  "chile": "56",
  "peru": "51",
  "venezuela": "58",
  "ecuador": "59",
  "bolivia": "59",
  "uruguay": "59",
  "paraguay": "59",
  "cuba": "53",
  "jamaica": "18",
  "puerto rico": "17",
  "dominican republic": "18",

  // === AFRICA ===
  "south africa": "27",
  "nigeria": "23", // +234 → 23
  "kenya": "25", // +254 → 25
  "ethiopia": "25", // +251 → 25
  "ghana": "23", // +233 → 23
  "tanzania": "25", // +255 → 25
  "uganda": "25", // +256 → 25
  "egypt": "20",
  "morocco": "21", // +212 → 21
  "algeria": "21", // +213 → 21
  "tunisia": "21", // +216 → 21
  "cameroon": "23", // +237 → 23
  "senegal": "22", // +221 → 22
  "ivory coast": "22", // +225 → 22
  "côte d'ivoire": "22",

  // === OCEANIA ===
  "australia": "61",
  "new zealand": "64",
  "fiji": "67", // +679 → 67
  "papua new guinea": "67", // +675 → 67
};

/**
 * Get 2-digit country code from nationality string.
 * Falls back to "00" if nationality is not found.
 */
export function getCountryCode(nationality: string): string {
  if (!nationality) return "00";
  const key = nationality.toLowerCase().trim();

  // Direct match
  if (COUNTRY_CODE_MAP[key]) return COUNTRY_CODE_MAP[key];

  // Partial match (e.g., "French" → "France")
  for (const [country, code] of Object.entries(COUNTRY_CODE_MAP)) {
    if (key.includes(country) || country.includes(key)) return code;
  }

  return "00"; // Unknown nationality
}

/**
 * Parse DOB from various formats:
 * - "London, 19-10-1976" → "19101976"
 * - "1976-10-19" (ISO) → "19101976"
 * - "19-10-1976" → "19101976"
 */
export function parseDOBDigits(birthPlaceDate: string): string | null {
  if (!birthPlaceDate) return null;

  // Strip city prefix if exists (e.g., "London, 19-10-1976")
  const datePart = birthPlaceDate.includes(",")
    ? birthPlaceDate.split(",")[1].trim()
    : birthPlaceDate.trim();

  // Try DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = datePart.match(/^(\d{1,2})[-\/\.](\d{1,2})[-\/\.](\d{4})$/);
  if (dmyMatch) {
    const dd = dmyMatch[1].padStart(2, "0");
    const mm = dmyMatch[2].padStart(2, "0");
    const yyyy = dmyMatch[3];
    return `${dd}${mm}${yyyy}`;
  }

  // Try YYYY-MM-DD (ISO format)
  const isoMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const dd = isoMatch[3];
    const mm = isoMatch[2];
    const yyyy = isoMatch[1];
    return `${dd}${mm}${yyyy}`;
  }

  return null;
}

/**
 * Get last 4 digits of WhatsApp/phone number.
 * Strips country code prefix (+, 00, etc.)
 */
export function getWADigits(phone: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, ""); // keep only digits
  if (digits.length < 4) return null;
  return digits.slice(-4);
}

/**
 * Generate structured 16-digit ID Number.
 *
 * Format: [CC(2)] + [DD(2)] + [MM(2)] + [DOB(8)] + [SEQ(2)]
 * Where:
 *   CC  = 2-digit country code
 *   DD  = Day of issue date
 *   MM  = Month of issue date
 *   DOB = DDMMYYYY of birth date (or last 4 WA digits + 0000 fallback)
 *   SEQ = 2-digit sequence/random to prevent duplicates
 *
 * @param nationality     e.g. "France" or "United Kingdom"
 * @param issueDate       ISO string of when the card was issued (e.g., "2026-05-17")
 * @param birthPlaceDate  e.g. "London, 19-10-1976" or "1976-10-19"
 * @param phone           WhatsApp/phone number (fallback if no DOB)
 * @param sequence        Optional 2-digit sequence (default "01")
 */
export function generateIDNumber(
  nationality: string,
  issueDate: string,
  birthPlaceDate: string,
  phone?: string,
  sequence: string = "01",
  seed: string = "" // Extra seed for deterministic fallback (e.g. order_id + name)
): string {
  const countryCode = getCountryCode(nationality);

  // Issue date DD+MM — guard against 'N/A' or invalid dates, and handle DD/MM/YYYY formats
  let issueDateObj = new Date(issueDate);
  if (isNaN(issueDateObj.getTime()) && typeof issueDate === 'string') {
    const dmy = issueDate.match(/^(\d{1,2})[-\/\.](\d{1,2})[-\/\.](\d{4})$/);
    if (dmy) {
      const dd = parseInt(dmy[1], 10);
      const mm = parseInt(dmy[2], 10) - 1; // 0-indexed month
      const yyyy = parseInt(dmy[3], 10);
      issueDateObj = new Date(yyyy, mm, dd);
    }
  }
  const validIssueDate = !isNaN(issueDateObj.getTime()) ? issueDateObj : new Date();
  const issueDD = String(validIssueDate.getDate()).padStart(2, "0");
  const issueMM = String(validIssueDate.getMonth() + 1).padStart(2, "0");

  // DOB digits (primary) or WA last-4 (secondary) or deterministic hash (fallback)
  let identityDigits = parseDOBDigits(birthPlaceDate);
  if (!identityDigits) {
    const waDigits = getWADigits(phone || "");
    if (waDigits) {
      identityDigits = waDigits + "0000"; // 8 digits
    } else {
      // Deterministic fallback — same result every render for same person
      identityDigits = deterministicHash8(seed || nationality + issueDD + issueMM);
    }
  }

  const seq = sequence.padStart(2, "0").slice(0, 2);

  return `${countryCode}${issueDD}${issueMM}${identityDigits}${seq}`;
}

/**
 * Format a 16-digit ID number for display on the card.
 * e.g. "3311051910197601" → "33-1105-19101976-01"
 */
export function formatIDNumber(rawId: string): string {
  if (!rawId || rawId.length < 16) return rawId;
  const clean = rawId.replace(/\D/g, "").slice(0, 16);
  // Format: CC (2) - DDMM (4) - DOB (8) - SEQ (2)
  return `${clean.slice(0, 2)}-${clean.slice(2, 6)}-${clean.slice(6, 14)}-${clean.slice(14)}`;
}
