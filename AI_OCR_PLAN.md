# AI Passport OCR Implementation Plan
**Project**: Indonesian Visas - Smart Identity & Verification System
**Status**: Planned / Blueprint
**Objective**: To implement an advanced Optical Character Recognition (OCR) system that automatically extracts MRZ (Machine Readable Zone) data from uploaded passport images to pre-fill verification forms with 100% accuracy, creating a "zero-typing" experience.

---

## 1. System Architecture

The OCR system will be implemented as a serverless edge function or a dedicated Next.js API route (`/api/ocr/passport`). 

### Core Flow:
1. **Client Upload**: User uploads a passport photo via `StepDocuments` or `QuickApply`.
2. **Supabase Storage**: Image is temporarily or permanently saved in the Supabase `documents` bucket.
3. **AI Processing**: 
   - The backend triggers an OCR API (Google Cloud Vision API or AWS Textract).
   - The AI identifies and extracts the two lines of the MRZ code at the bottom of the passport.
4. **Data Parsing**: The system parses the MRZ string using an MRZ-parser library (e.g., `mrz` npm package) to extract structured data.
5. **Auto-Population**: 
   - **Frontend**: The extracted data (First Name, Last Name, DOB, Passport Number, Nationality, Expiry Date, Gender) is automatically populated into the application state (`ApplicationContext`).
   - **Backend**: For existing orders, the data is pushed directly to the `Verification` and `visa_applications` tables.

## 2. Technology Stack Options

| Provider | Pros | Cons | Recommendation |
| :--- | :--- | :--- | :--- |
| **Google Cloud Vision** | Extremely accurate, handles blurry photos well, very cheap ($1.50 per 1000 scans). | General-purpose OCR, requires custom regex to find MRZ lines. | **Primary Choice**. Easy to integrate with Next.js. |
| **AWS Textract** | High accuracy, specifically trained on documents. | AWS ecosystem can be complex to set up. | Alternative choice. |
| **BlinkID / Microblink** | Purpose-built for ID/Passport scanning. Extremely fast. | Very expensive for high-volume scanning. | Not recommended for Phase 1. |

## 3. Implementation Phases

### Phase 1: Admin Dashboard "Magic Wand" (Proof of Concept)
Before rolling this out to public users, we will implement it for the Admin Dashboard to speed up the Verification process and test the AI's accuracy.
- Add a **"Scan Passport AI"** button inside the Verification Panel.
- Admin clicks the button -> System reads the `photoUrl` from the application -> Sends to Google Vision -> Extracts data -> Pre-fills the Admin form.
- *Benefit*: Drastically reduces admin typing time. Zero risk to public UX if the photo is too blurry.

### Phase 2: Public Application "Zero-Typing" Flow
Integrate into the main user application (`StepDocuments.tsx` & `QuickApplicationModal.tsx`).
- User uploads passport.
- A loading spinner says "AI is analyzing your passport...".
- The system automatically fills the `personalInfo` state.
- User is asked to review and confirm the extracted data.
- *Benefit*: Premium UX, eliminates typos in critical legal documents.

### Phase 3: Fraud Detection & Security
- Implement logic to compare the extracted MRZ name with the user-inputted name.
- If there is a mismatch > 20% (Levenshtein distance), flag the application for manual review in the Dashboard.

## 4. Required Dependencies & Setup

1. **Google Cloud Account**: Create a Service Account and enable the Cloud Vision API.
2. **Environment Variables**:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS_JSON='{...}'
   ```
3. **NPM Packages**:
   - `@google-cloud/vision`: For interacting with Google's OCR.
   - `mrz`: A lightweight javascript library to parse standard TD3 (Passport) MRZ lines into JSON objects.

## 5. Security & Privacy Considerations
- **GDPR Compliance**: Ensure that the OCR processing does not permanently store the image on the AI provider's servers. Google Cloud Vision allows "data logging" to be disabled for privacy.
- **Ephemeral Processing**: The image buffer should be processed in memory and immediately discarded by the OCR API route to prevent sensitive data leaks.

---
*Blueprint created for future scaling of Indonesian Visas.*
