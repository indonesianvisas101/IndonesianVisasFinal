
import { VisaDetail } from './visaDetails';

export interface VisaType {
    id: string;
    category: string;
    name: string;
    description: string;
    price: string | number | Record<string, string>;
    fee?: string | number | Record<string, number>;
    validity: string;
    requirements?: string[];
    extendable?: boolean;
    details?: VisaDetail;
}


export const VISA_DATABASE: VisaType[] = [
    {
        "id": "A1",
        "category": "Visitor Visa Exemptions",
        "name": "Tourism Visa Exemption",
        "description": "Indonesian Tourism Visa Exemption",
        "price": "IDR 0",
        "fee": 0,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "A4",
        "category": "Visitor Visa Exemptions",
        "name": "Government Mission Visa Exemption",
        "description": "Indonesian Government Mission Visa Exemption",
        "price": "IDR 0",
        "fee": 0,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "A36",
        "category": "Visitor Visa Exemptions",
        "name": "Ship and Plane Crew Visa Exemption",
        "description": "Indonesian Ship and Plane Crew Visa Exemption",
        "price": "IDR 0",
        "fee": 0,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "A37",
        "category": "Visitor Visa Exemptions",
        "name": "Ship Crew in Indonesian Waters Visa Exemption",
        "description": "Indonesian Ship Crew in Indonesian Waters Visa Exemption",
        "price": "IDR 0",
        "fee": 0,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "B1",
        "category": "Visitor Visas on Arrival",
        "name": "B1 Tourist Visa (Visa on Arrival / e-VOA)",
        "description": "Indonesian B1 Tourist Visa (Visa on Arrival / e-VOA)",
        "price": {
            "Standard": "IDR 500.000",
            "Priority": "IDR 750.000"
        },
        "fee": 250000,
        "validity": "Select Speed",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "B4",
        "category": "Visitor Visas on Arrival",
        "name": "Government Mission Visitor Visa",
        "description": "Indonesian Government Mission Visitor Visa",
        "price": "IDR 500.000",
        "fee": 250000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "F1",
        "category": "Visitor Visas on Arrival",
        "name": "Tourism Visitor Visa",
        "description": "Indonesian Tourism Visitor Visa",
        "price": "IDR 500.000",
        "fee": 250000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "F4",
        "category": "Visitor Visas on Arrival",
        "name": "Government Mission Visitor Visa",
        "description": "Indonesian Government Mission Visitor Visa",
        "price": "IDR 250.000",
        "fee": 125000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C1",
        "category": "Single-Entry Visitor Visas",
        "name": "C1 Visit Visa (Single-Entry Visit Visa)",
        "description": "Indonesian C1 Visit Visa (Single-Entry Visit Visa)",
        "price": {
            "Standard (7-10 Working Days)": "IDR 1.000.000",
            "Express (3-5 Working Days)": "IDR 2.500.000",
            "VIP (24-48 Hours)": "IDR 5.000.000"
        },
        "fee": 700000,
        "validity": "Select Speed",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C2",
        "category": "Single-Entry Visitor Visas",
        "name": "C2 Business Visa (Single-Entry Business Visit Visa)",
        "description": "Indonesian C2 Business Visa (Single-Entry Business Visit Visa)",
        "price": {
            "Standard": "IDR 1.000.000",
            "Priority": "IDR 2.500.000"
        },
        "fee": 1500000,
        "validity": "Select Speed",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "IDIV",
        "category": "Add-ons & ID Cards",
        "name": "IDiv Card (Digital Sponsor ID)",
        "description": "Official Indonesian Visas Digital ID. Acts as a verified sponsor ID for travelers and nomad activities.",
        "price": "IDR 325.000",
        "fee": 0,
        "validity": "Lifetime / Per Visa",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": false
    },
    {
        "id": "C3",
        "category": "Single-Entry Visitor Visas",
        "name": "Medical Treatment Visitor Visa",
        "description": "Indonesian Medical Treatment Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C4",
        "category": "Single-Entry Visitor Visas",
        "name": "Government Mission Visitor Visa",
        "description": "Indonesian Government Mission Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C5",
        "category": "Single-Entry Visitor Visas",
        "name": "Media and Press Visitor Visa",
        "description": "Indonesian Media and Press Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C5A",
        "category": "Single-Entry Visitor Visas",
        "name": "Content Creator Visitor Visa",
        "description": "Indonesian Content Creator Visitor Visa",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C6",
        "category": "Single-Entry Visitor Visas",
        "name": "Social Activities Visitor Visa",
        "description": "Indonesian Social Activities Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C7",
        "category": "Single-Entry Visitor Visas",
        "name": "Arts and Cultural Performance Visitor Visa",
        "description": "Indonesian Arts and Cultural Performance Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C7A",
        "category": "Single-Entry Visitor Visas",
        "name": "Music Performance Visitor Visa",
        "description": "Indonesian Music Performance Visitor Visa",
        "price": "IDR 500.000",
        "fee": 500000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C7B",
        "category": "Single-Entry Visitor Visas",
        "name": "Music Performance Crew Visitor Visa",
        "description": "Indonesian Music Performance Crew Visitor Visa",
        "price": "IDR 500.000",
        "fee": 500000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C7C",
        "category": "Single-Entry Visitor Visas",
        "name": "Talent Performance Visitor Visa",
        "description": "Indonesian Talent Performance Visitor Visa",
        "price": "IDR 500.000",
        "fee": 500000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C8",
        "category": "Single-Entry Visitor Visas",
        "name": "Sports Event Visitor Visa",
        "description": "Indonesian Sports Event Visitor Visa",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C8A",
        "category": "Single-Entry Visitor Visas",
        "name": "Sports Athlete Visitor Visa",
        "description": "Indonesian Sports Athlete Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C8B",
        "category": "Single-Entry Visitor Visas",
        "name": "Sports Official Visitor Visa",
        "description": "Indonesian Sports Official Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C9",
        "category": "Single-Entry Visitor Visas",
        "name": "Skill Enrichment Visitor Visa",
        "description": "Indonesian Skill Enrichment Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C9A",
        "category": "Single-Entry Visitor Visas",
        "name": "Religious-Based Training Visitor Visa",
        "description": "Indonesian Religious-Based Training Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C9B",
        "category": "Single-Entry Visitor Visas",
        "name": "Indonesian Language Training Visitor Visa",
        "description": "Indonesian Indonesian Language Training Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 700000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C10",
        "category": "Single-Entry Visitor Visas",
        "name": "Business Events Speaker Visitor Visa",
        "description": "Indonesian Business Events Speaker Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C10A",
        "category": "Single-Entry Visitor Visas",
        "name": "Religious Speaker Visitor Visa",
        "description": "Indonesian Religious Speaker Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C11",
        "category": "Single-Entry Visitor Visas",
        "name": "Exhibitor Visitor Visa",
        "description": "Indonesian Exhibitor Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C11A",
        "category": "Single-Entry Visitor Visas",
        "name": "Exhibitor Visitor Visa",
        "description": "Indonesian Exhibitor Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C12",
        "category": "Single-Entry Visitor Visas",
        "name": "C12 Pre-Investment Visa",
        "description": "Indonesian C12 Pre-Investment Visa",
        "price": {
            "60 Days": "IDR 2.500.000",
            "180 Days": "IDR 5.000.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C13",
        "category": "Single-Entry Visitor Visas",
        "name": "Crew Joining Ship/Plane",
        "description": "Indonesian Crew Joining Ship/Plane",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C14",
        "category": "Single-Entry Visitor Visas",
        "name": "Film Production Visitor Visa",
        "description": "Indonesian Film Production Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C15",
        "category": "Single-Entry Visitor Visas",
        "name": "Emergency Response Visitor Visa",
        "description": "Indonesian Emergency Response Visitor Visa",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C16",
        "category": "Single-Entry Visitor Visas",
        "name": "Industrial Dev Instructor",
        "description": "Indonesian Industrial Dev Instructor",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C17",
        "category": "Single-Entry Visitor Visas",
        "name": "Audit & Inspection",
        "description": "Indonesian Audit & Inspection",
        "price": "IDR 1.000.000",
        "fee": 1500000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C18",
        "category": "Single-Entry Visitor Visas",
        "name": "Skills Assessment",
        "description": "Indonesian Skills Assessment",
        "price": "IDR 2.000.000",
        "fee": 1400000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C19",
        "category": "Single-Entry Visitor Visas",
        "name": "After-Sales Service",
        "description": "Indonesian After-Sales Service",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C20",
        "category": "Single-Entry Visitor Visas",
        "name": "Machinery Install/Repair",
        "description": "Indonesian Machinery Install/Repair",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C21",
        "category": "Single-Entry Visitor Visas",
        "name": "Court Appearance",
        "description": "Indonesian Court Appearance",
        "price": "IDR 1.000.000",
        "fee": 1300000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C22",
        "category": "Single-Entry Visitor Visas",
        "name": "Internship Visitor Visa",
        "description": "Indonesian Internship Visitor Visa",
        "price": "60 Days: IDR 2.000.000",
        "fee": "180 Days: IDR 3.900.000",
        "validity": "Multiple Options",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C22A",
        "category": "Single-Entry Visitor Visas",
        "name": "Academic Internship",
        "description": "Indonesian Academic Internship",
        "price": "60 Days: IDR 2.000.000",
        "fee": "180 Days: IDR 3.900.000",
        "validity": "Multiple Options",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "C22B",
        "category": "Single-Entry Visitor Visas",
        "name": "Competency Internship",
        "description": "Indonesian Competency Internship",
        "price": "60 Days: IDR 2.000.000",
        "fee": "180 Days: IDR 3.900.000",
        "validity": "Multiple Options",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "D1",
        "category": "Multiple-Entry Visitor Visas",
        "name": "D1 Tourist Visit Visa (Single-Entry Visit Visa)",
        "description": "Indonesian D1 Tourist Visit Visa (Single-Entry Visit Visa)",
        "price": {
            "1 Year": "IDR 4.500.000",
            "2 Years": "IDR 7.300.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "D2",
        "category": "Multiple-Entry Visitor Visas",
        "name": "D2 Business Visit Visa (Single-Entry)",
        "description": "Indonesian D2 Business Visit Visa (Single-Entry)",
        "price": {
            "1 Year": "IDR 5.500.000",
            "2 Years": "IDR 8.500.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "D3",
        "category": "Multiple-Entry Visitor Visas",
        "name": "Medical Treatment Visa",
        "description": "Indonesian Medical Treatment Visa",
        "price": {
            "1 Year": "IDR 3.000.000"
        },
        "fee": "2 Years: IDR 8.000.000",
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "D4",
        "category": "Multiple-Entry Visitor Visas",
        "name": "Government Mission Visa",
        "description": "Indonesian Government Mission Visa",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "D7",
        "category": "Multiple-Entry Visitor Visas",
        "name": "Arts/Cultural Performance",
        "description": "Indonesian Arts/Cultural Performance",
        "price": "IDR 1.500.000",
        "fee": 1500000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "D8",
        "category": "Multiple-Entry Visitor Visas",
        "name": "Sports Event Visa",
        "description": "Indonesian Sports Event Visa",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "D12",
        "category": "Multiple-Entry Visitor Visas",
        "name": "D12 Pre-Investment Visit Visa",
        "description": "Indonesian D12 Pre-Investment Visit Visa",
        "price": { "1 Year": "5.000.000", "2 Years": "7.000.000" },
        "fee": { "1 Year": 3000000, "2 Years": 4000000 },
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "D14",
        "category": "Multiple-Entry Visitor Visas",
        "name": "Film Production Visa",
        "description": "Indonesian Film Production Visa",
        "price": {
            "1 Year": "IDR 3.000.000"
        },
        "fee": "2 Years: IDR 5.000.000",
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "D17",
        "category": "Multiple-Entry Visitor Visas",
        "name": "Audit & Inspection Visa",
        "description": "Indonesian Audit & Inspection Visa",
        "price": {
            "1 Year": "IDR 3.000.000"
        },
        "fee": "2 Years: IDR 5.000.000",
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E23A",
        "category": "Work Visas",
        "name": "SEZ Work Visa",
        "description": "Indonesian SEZ Work Visa",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E23U",
        "category": "Work Visas",
        "name": "Domestic Staff Diplomat",
        "description": "Indonesian Domestic Staff Diplomat",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E23V",
        "category": "Work Visas",
        "name": "Economic/Trade Office Work",
        "description": "Indonesian Economic/Trade Office Work",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E23X",
        "category": "Work Visas",
        "name": "Gov-Appointed Expert",
        "description": "Indonesian Gov-Appointed Expert",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E23Y",
        "category": "Work Visas",
        "name": "Digital Sector Expert",
        "description": "Indonesian Digital Sector Expert",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E25",
        "category": "Work Visas",
        "name": "Commissioner/Executive",
        "description": "Indonesian Commissioner/Executive",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E25A",
        "category": "Work Visas",
        "name": "Non-Executive Commissioner",
        "description": "Indonesian Non-Executive Commissioner",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E25B",
        "category": "Work Visas",
        "name": "Company Director",
        "description": "Indonesian Company Director",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E25C",
        "category": "Work Visas",
        "name": "Deputy Director",
        "description": "Indonesian Deputy Director",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E25D",
        "category": "Work Visas",
        "name": "General Manager",
        "description": "Indonesian General Manager",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E25E",
        "category": "Work Visas",
        "name": "Company Manager",
        "description": "Indonesian Company Manager",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E25F",
        "category": "Work Visas",
        "name": "Company Supervisor",
        "description": "Indonesian Company Supervisor",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E26",
        "category": "Work Visas",
        "name": "Offshore/Maritime Crew",
        "description": "Indonesian Offshore/Maritime Crew",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E27",
        "category": "Work Visas",
        "name": "Religious Worker",
        "description": "Indonesian Religious Worker",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E29",
        "category": "Work Visas",
        "name": "Researcher Work Visa",
        "description": "Indonesian Researcher Work Visa",
        "price": "IDR 6.000.000",
        "fee": 4200000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E28",
        "category": "Investor Visas",
        "name": "Investor Visa",
        "description": "Indonesian Investor Visa",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E28A",
        "category": "Investor Visas",
        "name": "E28A Investment KITAS",
        "description": "Indonesian E28A Investment KITAS",
        "price": {
            "Offshore 1 Year": "IDR 14.000.000",
            "Offshore 2 Years": "IDR 17.000.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E28B",
        "category": "Investor Visas",
        "name": "Company Establishment GV",
        "description": "Indonesian Company Establishment GV",
        "price": "5 Years: IDR 13.000.000",
        "fee": "10 Years: IDR 19.500.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E28C",
        "category": "Investor Visas",
        "name": "Capital Market GV",
        "description": "Indonesian Capital Market GV",
        "price": "5 Years: IDR 13.000.000",
        "fee": "10 Years: IDR 19.500.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E28D",
        "category": "Investor Visas",
        "name": "Branch/Subsidiary GV",
        "description": "Indonesian Branch/Subsidiary GV",
        "price": "5 Years: IDR 13.000.000",
        "fee": "10 Years: IDR 19.500.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E28E",
        "category": "Investor Visas",
        "name": "SEZ Investor Visa",
        "description": "Indonesian SEZ Investor Visa",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E28F",
        "category": "Investor Visas",
        "name": "Nusantara Capital City GV",
        "description": "Indonesian Nusantara Capital City GV",
        "price": "5 Years: IDR 13.000.000",
        "fee": "10 Years: IDR 19.500.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E28G",
        "category": "Investor Visas",
        "name": "Parent Co Representative GV",
        "description": "Indonesian Parent Co Representative GV",
        "price": "5 Years: IDR 13.000.000",
        "fee": "10 Years: IDR 19.500.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E30",
        "category": "Student Visas",
        "name": "Student Visa",
        "description": "Indonesian Student Visa",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E30A",
        "category": "Student Visas",
        "name": "Primary/Secondary Student",
        "description": "Indonesian Primary/Secondary Student",
        "price": {
            "1 Year": "IDR 6.000.000",
            "2 Years": "IDR 8.500.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E30B",
        "category": "Student Visas",
        "name": "Higher Education Student",
        "description": "Indonesian Higher Education Student",
        "price": {
            "1 Year": "IDR 6.000.000",
            "2 Years": "IDR 8.500.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E30E",
        "category": "Student Visas",
        "name": "SEZ Student Visa",
        "description": "Indonesian SEZ Student Visa",
        "price": {
            "1 Year": "IDR 6.000.000",
            "2 Years": "IDR 8.500.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E30F",
        "category": "Student Visas",
        "name": "Student Exchange Visa",
        "description": "Indonesian Student Exchange Visa",
        "price": "6 Months: IDR 12.000.000",
        "fee": "1 Year: IDR 15.500.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E31",
        "category": "Family Visas",
        "name": "Family Visa",
        "description": "Indonesian Family Visa",
        "price": "5 Years: IDR 33.000.000",
        "fee": "10 Years: IDR 48.500.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E31A",
        "category": "Family Visas",
        "name": "Spouse of Indonesian",
        "description": "Indonesian Spouse of Indonesian",
        "price": {
            "1 Year": "IDR 11.500.000",
            "2 Years": "IDR 14.000.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E31B",
        "category": "Family Visas",
        "name": "Spouse of Resident",
        "description": "Indonesian Spouse of Resident",
        "price": {
            "1 Year": "IDR 11.500.000",
            "2 Years": "IDR 14.000.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E31C",
        "category": "Family Visas",
        "name": "Child of Indonesian",
        "description": "Indonesian Child of Indonesian",
        "price": {
            "1 Year": "IDR 11.500.000",
            "2 Years": "IDR 14.000.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E31D",
        "category": "Family Visas",
        "name": "Accompanying Child (Indonesian)",
        "description": "Indonesian Accompanying Child (Indonesian)",
        "price": {
            "1 Year": "IDR 11.500.000",
            "2 Years": "IDR 14.000.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E31E",
        "category": "Family Visas",
        "name": "Child of Resident",
        "description": "Indonesian Child of Resident",
        "price": {
            "1 Year": "IDR 11.500.000",
            "2 Years": "IDR 14.000.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E31F",
        "category": "Family Visas",
        "name": "Child of Ind. Parent",
        "description": "Indonesian Child of Ind. Parent",
        "price": {
            "1 Year": "IDR 11.500.000",
            "2 Years": "IDR 14.000.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E31G",
        "category": "Family Visas",
        "name": "Parent of Indonesian",
        "description": "Indonesian Parent of Indonesian",
        "price": {
            "1 Year": "IDR 11.500.000",
            "2 Years": "IDR 14.000.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E31H",
        "category": "Family Visas",
        "name": "Parent of Resident",
        "description": "Indonesian Parent of Resident",
        "price": "IDR 6.000.000",
        "fee": 4200000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E31J",
        "category": "Family Visas",
        "name": "Child Joining Sibling",
        "description": "Indonesian Child Joining Sibling",
        "price": {
            "1 Year": "IDR 6.000.000",
            "2 Years": "IDR 8.500.000"
        },
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E32",
        "category": "Repatriation and Descendant Visas",
        "name": "Repatriation Visa",
        "description": "Indonesian Repatriation Visa",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E32A",
        "category": "Repatriation and Descendant Visas",
        "name": "5-Year Repatriation Visa",
        "description": "Indonesian 5-Year Repatriation Visa",
        "price": "IDR 12.000.000",
        "fee": 8400000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E32B",
        "category": "Repatriation and Descendant Visas",
        "name": "5/10-Year Descendant GV",
        "description": "Indonesian 5/10-Year Descendant GV",
        "price": "5 Years: IDR 12.000.000",
        "fee": "10 Years: IDR 18.500.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E32C",
        "category": "Repatriation and Descendant Visas",
        "name": "2-Year Repatriation Visa",
        "description": "Indonesian 2-Year Repatriation Visa",
        "price": "IDR 8.500.000",
        "fee": 5950000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E32D",
        "category": "Repatriation and Descendant Visas",
        "name": "1-Year Repatriation GV",
        "description": "Indonesian 1-Year Repatriation GV",
        "price": "IDR 6.000.000",
        "fee": 4200000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E32E",
        "category": "Repatriation and Descendant Visas",
        "name": "Permanent Resident Repatriation",
        "description": "Indonesian Permanent Resident Repatriation",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E32F",
        "category": "Repatriation and Descendant Visas",
        "name": "Special Expertise Repatriation",
        "description": "Indonesian Special Expertise Repatriation",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E32G",
        "category": "Repatriation and Descendant Visas",
        "name": "Permanent Resident Descendant",
        "description": "Indonesian Permanent Resident Descendant",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E32H",
        "category": "Repatriation and Descendant Visas",
        "name": "Special Expertise Descendant",
        "description": "Indonesian Special Expertise Descendant",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E33",
        "category": "Special Residency Visas",
        "name": "Special Residency Visa",
        "description": "Indonesian Special Residency Visa",
        "price": "Offshore 5 Years: IDR 32.000.000",
        "fee": "Onshore 5 Years: IDR 37.000.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E33A",
        "category": "Special Residency Visas",
        "name": "Gov Appointed Expert",
        "description": "Indonesian Gov Appointed Expert",
        "price": "5 Years: IDR 13.000.000",
        "fee": "10 Years: IDR 19.500.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E33B",
        "category": "Special Residency Visas",
        "name": "Gov Partnership Expert GV",
        "description": "Indonesian Gov Partnership Expert GV",
        "price": "5 Years: IDR 13.000.000",
        "fee": "10 Years: IDR 19.500.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E33C",
        "category": "Special Residency Visas",
        "name": "Eminent Person",
        "description": "Indonesian Eminent Person",
        "price": "5 Years: IDR 13.000.000",
        "fee": "10 Years: IDR 19.500.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E33D",
        "category": "Special Residency Visas",
        "name": "Distinguished Entrepreneur",
        "description": "Indonesian Distinguished Entrepreneur",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E33E",
        "category": "Special Residency Visas",
        "name": "5-Year Retiree GV",
        "description": "Indonesian 5-Year Retiree GV",
        "price": "Offshore 5 Years: IDR 32.000.000",
        "fee": "Onshore 5 Years: IDR 37.000.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E33F",
        "category": "Special Residency Visas",
        "name": "1-Year Retiree",
        "description": "Indonesian 1-Year Retiree",
        "price": "Offshore 6 Months: IDR 13.000.000",
        "fee": "Offshore 1 Year: IDR 14.000.000",
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E33G",
        "category": "Special Residency Visas",
        "name": "E33G Digital Nomad Visa",
        "description": "Indonesian E33G Digital Nomad Visa",
        "price": "IDR 7.000.000",
        "fee": 2499998,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E34",
        "category": "Special Residency Visas",
        "name": "Medical Treatment Resident",
        "description": "Indonesian Medical Treatment Resident",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E35",
        "category": "Working Holiday Visas",
        "name": "Working Holiday Visa",
        "description": "Indonesian Working Holiday Visa",
        "price": "IDR 7.000.000",
        "fee": 4900000,
        "validity": "Single Entry",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    },
    {
        "id": "E35A",
        "category": "Working Holiday Visas",
        "name": "Australia Working Holiday",
        "description": "Indonesian Australia Working Holiday",
        "price": "Contact Us",
        "fee": 0,
        "validity": "Select Duration",
        "requirements": [
            "Valid Passport",
            "Recent Photograph"
        ],
        "extendable": true
    }
];

export const POPULAR_VISA_IDS = ['B1', 'C1', 'E28A', 'C2', 'C12', 'D1', 'D2', 'D12', 'E33G'];
