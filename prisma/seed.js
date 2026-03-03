const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();




const rawVisas = [
{
  id: "A1",
  name: "Tourism Visa Exemption",
  category: "Tourist",
  validity: "Visa Exemption",
  price: "IDR 0",
  fee: 0,
  description: "Tourism visa exemption. No visa required prior to arrival in Indonesia.",
  extendable: false,
  requirements: ["Passport (valid per regulation)"]
},
{
  id: "A4",
  name: "Government Mission Visa Exemption",
  category: "Official/Government",
  validity: "Visa Exemption",
  price: "IDR 0",
  fee: 0,
  description: "Visa exemption for official government missions.",
  extendable: false,
  requirements: ["Passport", "Official Government Assignment"]
},
{
  id: "A36",
  name: "Ship and Plane Crew Visa Exemption",
  category: "Employment",
  validity: "Visa Exemption",
  price: "IDR 0",
  fee: 0,
  description: "Visa exemption for ship and aircraft crew members.",
  extendable: false,
  requirements: ["Passport", "Crew Manifest"]
},
{
  id: "A37",
  name: "Ship Crew in Indonesian Waters Visa Exemption",
  category: "Employment",
  validity: "Visa Exemption",
  price: "IDR 0",
  fee: 0,
  description: "Visa exemption for ship crew operating in Indonesian waters.",
  extendable: false,
  requirements: ["Passport", "Ship Assignment Letter"]
},
{
  id: "B1",  // VOA or Extension
  name: "Tourism Visitor Visa (Visa on Arrival)",
  category: "Tourist",
  validity: "30 Days",
  price: "IDR 500.000",
  fee: 250000,
  description: "Tourism visitor visa valid for 30 days. No sponsor required.",
  extendable: true,
  requirements: ["Passport (6 months validity)", "Return Ticket"]
},
{
  id: "B4",
  name: "Government Mission Visitor Visa (Visa on Arrival)",
  category: "Official/Government",
  validity: "30 Days",
  price: "IDR 500.000",
  fee: 250000,
  description: "Visitor visa for official government missions. No sponsor required.",
  extendable: true,
  requirements: ["Passport", "Official Assignment Letter"]
},
{
  id: "F1",
  name: "Tourism Visitor Visa",
  category: "Tourist",
  validity: "30 Days",
  price: "IDR 500.000",
  fee: 250000,
  description: "Tourism visitor visa valid for short stays in Indonesia. No sponsor required.",
  extendable: true,
  requirements: ["Passport", "Return Ticket"]
},
{
  id: "F4",
  name: "Government Mission Visitor Visa",
  category: "Official/Government",
  validity: "30 Days",
  price: "IDR 250.000",
  fee: 125000,
  description: "Visitor visa for government missions with reduced visa cost. No sponsor required.",
  extendable: true,
  requirements: ["Passport", "Official Assignment Letter"]
},
{
  id: "C1",
  name: "Tourism Visitor Visa",
  category: "Tourist",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 500000,
  description: "Single-entry tourism visitor visa, extendable up to 180 days.",
  extendable: true,
  requirements: ["Passport", "Bank Statement"]
},
{
  id: "C2",
  name: "Business Visitor Visa",
  category: "Business",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 500000,
  description: "Business visitor visa for meetings, negotiations, and commercial activities.",
  extendable: true,
  requirements: ["Passport", "Business Invitation", "Sponsor Letter"]
},
{
  id: "C3",
  name: "Medical Treatment Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 500000,
  description: "Visitor visa for medical treatment purposes.",
  extendable: true,
  requirements: ["Passport", "Medical Referral Letter"]
},
{
  id: "C4",
  name: "Government Mission Visitor Visa",
  category: "Official/Government",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 500000,
  description: "Visitor visa for official government missions.",
  extendable: true,
  requirements: ["Passport", "Official Assignment Letter"]
},
{
  id: "C5",
  name: "Media and Press Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 500000,
  description: "Visitor visa for media and press activities.",
  extendable: true,
  requirements: ["Passport", "Press Card", "Sponsor Letter"]
},
{
  id: "C5A",
  name: "Content Creator Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "Contact Us",
  fee: 0,
  description: "Visitor visa for content creators and digital media activities.",
  extendable: true,
  requirements: ["Passport", "Activity Proposal"]
},
{
  id: "C6",
  name: "Social Activities Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 500000,
  description: "Visitor visa for social and cultural activities.",
  extendable: true,
  requirements: ["Passport", "Sponsor Letter"]
},
{
  id: "C7",
  name: "Arts and Cultural Performance Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 500000,
  description: "Visitor visa for arts and cultural performances.",
  extendable: true,
  requirements: ["Passport", "Event Permit"]
},
{
  id: "C7A",
  name: "Music Performance Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 500.000",
  fee: 350000,
  description: "Visitor visa for music performances.",
  extendable: true,
  requirements: ["Passport", "Performance Permit"]
},
{
  id: "C7B",
  name: "Music Performance Crew Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 500.000",
  fee: 350000,
  description: "Visitor visa for music performance crew.",
  extendable: true,
  requirements: ["Passport", "Crew List"]
},
{
  id: "C7C",
  name: "Talent Performance Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 500.000",
  fee: 350000,
  description: "Visitor visa for talent performances.",
  extendable: true,
  requirements: ["Passport", "Event Permit"]
},
{
  id: "C8",
  name: "Sports Event Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "Contact Us",
  fee: 0,
  description: "Visitor visa for sports events.",
  extendable: true,
  requirements: ["Passport", "Event Invitation"]
},
{
  id: "C8A",
  name: "Sports Athlete Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for sports athletes.",
  extendable: true,
  requirements: ["Passport", "Event Invitation"]
},
{
  id: "C8B",
  name: "Sports Official Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for sports officials.",
  extendable: true,
  requirements: ["Passport", "Event Invitation"]
},
{
  id: "C9",
  name: "Skill Enrichment Visitor Visa",
  category: "Education/Research",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for skill enrichment programs.",
  extendable: true,
  requirements: ["Passport", "Training Invitation"]
},
{
  id: "C9A",
  name: "Religious-Based Training Visitor Visa",
  category: "Education/Research",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for religious-based training.",
  extendable: true,
  requirements: ["Passport", "Institution Letter"]
},
{
  id: "C9B",
  name: "Indonesian Language Training Visitor Visa",
  category: "Education/Research",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for Indonesian language training.",
  extendable: true,
  requirements: ["Passport", "Institution Letter"]
},
{
  id: "C10",
  name: "Business Events Speaker Visitor Visa",
  category: "Business",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for business event speakers.",
  extendable: true,
  requirements: ["Passport", "Event Invitation"]
},
{
  id: "C10A",
  name: "Religious Speaker Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for religious speakers.",
  extendable: true,
  requirements: ["Passport", "Event Invitation"]
},
{
  id: "C11",
  name: "Exhibitor Visitor Visa",
  category: "Business",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 500000,
  description: "Visitor visa for exhibitors.",
  extendable: true,
  requirements: ["Passport", "Exhibition Invitation"]
},
{
  id: "C11A",
  name: "Exhibitor Visitor Visa",
  category: "Business",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 500000,
  description: "Single-entry exhibitor visitor visa.",
  extendable: true,
  requirements: ["Passport", "Exhibition Invitation"]
},
{
  id: "C12",
  name: "Pre-Investment Visitor Visa",
  category: "Business",
  validity: "60 Days / 180 Days",
  price: {
    "60 Days": "IDR 1.000.000",
    "180 Days": "IDR 2.000.000"
  },
  fee: {
    "60 Days": 700000,   // 70% dari 1.000.000
    "180 Days": 1400000  // 70% dari 2.000.000
  },
  description: `
Visitor visa for foreign nationals conducting pre-investment activities in Indonesia.
Available Options:
• 60 Days – Single Entry
• 180 Days – Single Entry (Extended validity)
This visa allows:
- Market research
- Business feasibility studies
- Investment planning prior to company establishment
Sponsor / Guarantor required.
`,
  extendable: true,
  requirements: [
    "Passport",
    "Business Plan",
    "Sponsor Letter"
  ]
},
{
  id: "C13",
  name: "Crew Joining Ship or Plane Visitor Visa",
  category: "Employment",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for crew joining ships or planes.",
  extendable: true,
  requirements: ["Passport", "Crew Assignment"]
},
{
  id: "C14",
  name: "Film Production Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for film production activities.",
  extendable: true,
  requirements: ["Passport", "Production Permit"]
},
{
  id: "C15",
  name: "Emergency Response Visitor Visa",
  category: "Employment",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for emergency response activities.",
  extendable: true,
  requirements: ["Passport", "Emergency Assignment"]
},
{
  id: "C16",
  name: "Industrial Development Instructor Visitor Visa",
  category: "Business",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for industrial instructors.",
  extendable: true,
  requirements: ["Passport", "Company Invitation"]
},
{
  id: "C17",
  name: "Audit and Inspection Visitor Visa",
  category: "Business",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for audit and inspection purposes.",
  extendable: true,
  requirements: ["Passport", "Company Invitation"]
},
{
  id: "C18",
  name: "Foreign Worker Skills Assessment Visitor Visa",
  category: "Employment",
  validity: "60 Days",
  price: "IDR 2.000.000",
  fee: 1400000,
  description: "Visitor visa for foreign worker skills assessment.",
  extendable: true,
  requirements: ["Passport", "Company Request"]
},
{
  id: "C19",
  name: "After-Sales Service Visitor Visa",
  category: "Business",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for after-sales services.",
  extendable: true,
  requirements: ["Passport", "Company Letter"]
},
{
  id: "C20",
  name: "Machinery Installation and Repair Visitor Visa",
  category: "Business",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 700000,
  description: "Visitor visa for machinery installation and repair.",
  extendable: true,
  requirements: ["Passport", "Company Letter"]
},
{
  id: "C21",
  name: "Court Appearance Visitor Visa",
  category: "Other",
  validity: "60 Days",
  price: "IDR 1.000.000",
  fee: 500000,
  description: "Visitor visa for court appearances.",
  extendable: true,
  requirements: ["Passport", "Court Summons"]
},
{
  id: "C22",
  name: "Internship Visitor Visa",
  category: "Other",
  validity: "60 / 180 Days",
  price: "IDR 1.000.000 – 2.000.000",
  fee: 1400000,
  description: "Visitor visa for internship programs.",
  extendable: true,
  requirements: ["Passport", "Internship Agreement"]
},
{
  id: "C22A",
  name: "Academic Internship Visitor Visa",
  category: "Education/Research",
  validity: "60 / 180 Days",
  price: "IDR 1.000.000 – 2.000.000",
  fee: 1400000,
  description: "Visitor visa for academic internships.",
  extendable: true,
  requirements: ["Passport", "Institution Letter"]
},
{
  id: "C22B",
  name: "Competency Internship Visitor Visa",
  category: "Other",
  validity: "60 / 180 Days",
  price: "IDR 1.000.000 – 2.000.000",
  fee: 1400000,
  description: "Visitor visa for competency-based internships.",
  extendable: true,
  requirements: ["Passport", "Company Letter"]
},
{
  id: "D1",
  name: "Tourism Visitor Visa (Multiple Entry)",
  category: "Tourist",
  validity: "1 Year / 2 Years / 3 Years",
  price: {
    "1 Year": "IDR 3.000.000",
    "2 Years": "IDR 5.000.000",
    "3 Years": "IDR 10.000.000"
  },
  fee: {
    "1 Year": 2250000,
    "2 Years": 3500000,
    "3 Years": 6000000
  },
  description: "Multiple-entry tourism visa for frequent travelers visiting Indonesia.",
  extendable: false,
  requirements: ["Passport", "Bank Statement"]
},
{
  id: "D2",
  name: "Business Visitor Visa (Multiple Entry)",
  category: "Business",
  validity: "1 Year / 2 Years / 3 Years",
  price: {
    "1 Year": "IDR 3.000.000",
    "2 Years": "IDR 5.000.000",
    "3 Years": "IDR 10.000.000"
  },
  fee: {
    "1 Year": 2250000,
    "2 Years": 3500000,
    "3 Years": 6000000
  },
  description: "Multiple-entry business visitor visa for meetings and commercial activities.",
  extendable: false,
  requirements: ["Passport", "Sponsor Letter"]
},
{
  id: "D3",
  name: "Medical Treatment Visitor Visa (Multiple Entry)",
  category: "Other",
  validity: "1 Year / 2 Years",
  price: {
    "1 Year": "IDR 3.000.000",
    "2 Years": "IDR 5.000.000"
  },
  fee: {
    "1 Year": 2250000,
    "2 Years": 3500000
  },
  description: "Multiple-entry visitor visa for ongoing medical treatment in Indonesia.",
  extendable: false,
  requirements: ["Passport", "Medical Referral"]
},
{
  id: "D7",
  name: "Arts and Cultural Performance Visitor Visa (Multiple Entry)",
  category: "Other",
  validity: "30 Days",
  price: `
30 Days: IDR 1.500.000
`,
  fee: 1125000,
  description: "Multiple-entry visa for arts and cultural performance activities.",
  extendable: false,
  requirements: ["Passport", "Performance Permit"]
},
{
  id: "D12",
  name: "Pre-Investment Visitor Visa (Multiple Entry)",
  category: "Business",
  validity: "1 Year / 2 Years",
  price: {
    "1 Year": "IDR 3.000.000",
    "2 Years": "IDR 5.000.000"
  },
  fee: {
    "1 Year": 2250000,
    "2 Years": 3500000
  },
  description: "Multiple-entry visa for investors conducting pre-investment activities in Indonesia.",
  extendable: false,
  requirements: ["Passport", "Business Plan"]
},
{
  id: "D14",
  name: "Film-Making and Film Production Visitor Visa (Multiple Entry)",
  category: "Other",
  validity: "1 Year / 2 Years",
  price: {
    "1 Year": "IDR 3.000.000",
    "2 Years": "IDR 5.000.000"
  },
  fee: {
    "1 Year": 2250000,
    "2 Years": 3500000
  },
  description: "Multiple-entry visa for film production and media activities in Indonesia.",
  extendable: false,
  requirements: ["Passport", "Production Permit"]
},
{
  id: "D17",
  name: "Company Audit, Quality Control, and Inspection Visitor Visa (Multiple Entry)",
  category: "Business",
  validity: "1 Year / 2 Years",
  price: {
    "1 Year": "IDR 3.000.000",
    "2 Years": "IDR 5.000.000"
  },
  fee: {
    "1 Year": 2250000,
    "2 Years": 3500000
  },
  description: "Multiple-entry visa for company audits, inspections, and quality control activities.",
  extendable: false,
  requirements: ["Passport", "Company Invitation"]
},
{
  id: "E23",
  name: "General Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "General work visa for foreign nationals employed by Indonesian entities.",
  extendable: true,
  requirements: ["Passport", "RPTKA Approval", "Employment Contract"]
},
{
  id: "E23A",
  name: "Special Economic Zone Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for foreign workers employed in Indonesia’s Special Economic Zones.",
  extendable: true,
  requirements: ["Passport", "RPTKA Approval", "SEZ Employment Letter"]
},
{
  id: "E23U",
  name: "Domestic Staff of a Diplomat Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for domestic staff employed by diplomats in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Diplomatic Assignment Letter"]
},
{
  id: "E23V",
  name: "Economic and Trade Office Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for foreign staff working in economic or trade representative offices.",
  extendable: true,
  requirements: ["Passport", "Official Appointment Letter"]
},
{
  id: "E23X",
  name: "Government-Appointed Expert Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for foreign experts officially appointed by the Indonesian government.",
  extendable: true,
  requirements: ["Passport", "Government Appointment Letter"]
},
{
  id: "E23Y",
  name: "Digital Sector Expert Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for foreign experts in Indonesia’s digital and technology sectors.",
  extendable: true,
  requirements: ["Passport", "RPTKA Approval", "Digital Sector Assignment"]
},
{
  id: "E25",
  name: "Company Commissioner or Executive Board Member Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for commissioners or executive board members of Indonesian companies.",
  extendable: true,
  requirements: ["Passport", "Company Deed", "RPTKA Approval"]
},
{
  id: "E25A",
  name: "Non-Executive Commissioner Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for non-executive commissioners of Indonesian companies.",
  extendable: true,
  requirements: ["Passport", "Company Appointment Letter"]
},
{
  id: "E25B",
  name: "Company Director Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for directors or executive board members of Indonesian companies.",
  extendable: true,
  requirements: ["Passport", "Company Deed", "RPTKA Approval"]
},
{
  id: "E25C",
  name: "Deputy Director Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for deputy directors or deputy executive board members.",
  extendable: true,
  requirements: ["Passport", "Company Appointment Letter"]
},
{
  id: "E25D",
  name: "Company General Manager Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for general managers of Indonesian companies.",
  extendable: true,
  requirements: ["Passport", "Company Appointment Letter"]
},
{
  id: "E25E",
  name: "Company Manager Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for managerial-level foreign employees.",
  extendable: true,
  requirements: ["Passport", "Employment Contract"]
},
{
  id: "E25F",
  name: "Company Supervisor Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for supervisory-level foreign workers.",
  extendable: true,
  requirements: ["Passport", "Employment Contract"]
},
{
  id: "E26",
  name: "Offshore and Maritime Crew Work Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for offshore and maritime crew operating in Indonesian waters.",
  extendable: true,
  requirements: ["Passport", "Crew Assignment Letter"]
},
{
  id: "E27",
  name: "Religious Worker Visa",
  category: "Employment",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Work visa for foreign religious workers assigned in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Religious Organization Letter"]
},
{
  id: "E29",
  name: "Researcher Work Visa",
  category: "Employment",
  validity: "1 Year",
  price: "IDR 6.000.000",
  fee: 4200000, // 70% dari total
  description: `
Work visa for foreign researchers conducting research activities in Indonesia.
Cost Breakdown:
- Temporary Stay Permit: IDR 500.000
- Visa Cost: IDR 3.000.000
- Verification Cost: IDR 1.500.000
- Re-entry Permit: IDR 1.000.000
Total Cost: IDR 6.000.000
`,
  extendable: true,
  requirements: [
    "Passport",
    "Research Permit",
    "Sponsorship Letter"
  ]
},
{
  id: "E28",
  name: "Investor Visa",
  category: "Business",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "General investor visa for foreign nationals investing in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Investment Documents", "Company Sponsorship"]
},
{
  id: "E28A",
  name: "Investor Visa / KITAS",
  category: "Business",
  validity: "1 / 2 Years",
  price: `
1 Year:
- Temporary Stay Permit: IDR 3.000.000
- Visa Cost: IDR 500.000
- Verification Cost: IDR 2.000.000
- Re-entry Permit: IDR 1.500.000
TOTAL: IDR 7.000.000
2 Years:
- Temporary Stay Permit: IDR 1.000.000
- Visa Cost: IDR 500.000
- Verification Cost: IDR 2.000.000
- Re-entry Permit: IDR 2.000.000
TOTAL: IDR 9.500.000
`,
  fee: [
    { duration: "1 Year", amount: 4900000 }, // 70% dari 7.000.000
    { duration: "2 Years", amount: 6650000 }  // 70% dari 9.500.000
  ],
  description: "Investor KITAS for foreign nationals investing in Indonesia. Allows residence and business activities in compliance with Indonesian regulations.",
  extendable: true,
  requirements: [
    "Passport",
    "Investment Proof",
    "Company Documents"
  ]
},
{
  id: "E28B",
  name: "Company Establishment Investor Visa (Golden Visa)",
  category: "Business",
  validity: "5 / 10 Years",
  price: `
5 Years:
- Temporary Stay Permit: IDR 7.000.000
- Visa Cost: IDR 500.000
- Verification Cost: IDR 2.000.000
- Re-entry Permit: IDR 2.000.000
TOTAL: IDR 13.000.000
10 Years:
- Temporary Stay Permit: IDR 12.000.000
- Visa Cost: IDR 500.000
- Verification Cost: IDR 2.000.000
- Re-entry Permit: IDR 2.000.000
TOTAL: IDR 19.500.000
`,
  fee: [
    { duration: "5 Years", amount: 9100000 },   // 70%
    { duration: "10 Years", amount: 13650000 } // 70%
  ],
  description: "Golden Visa for investors establishing companies in Indonesia with long-term residence benefits.",
  extendable: true,
  requirements: [
    "Passport",
    "Company Establishment Documents",
    "Investment Proof"
  ]
},
{
  id: "E28C",
  name: "Capital Market Investor Visa (Golden Visa)",
  category: "Business",
  validity: "Contact Us",
  price: "Contact Us",
  fee: [],
  description: "Golden Visa for foreign investors investing through Indonesian capital markets.",
  extendable: true,
  requirements: [
    "Passport",
    "Capital Market Investment Proof"
  ]
},
{
  id: "E28D",
  name: "Branch or Subsidiary Establishment Investor Visa (Golden Visa)",
  category: "Business",
  validity: "Long Term",
  price: "Contact Us",
  fee: 0,
  description: "Golden Visa for investors establishing a branch or subsidiary company.",
  extendable: true,
  requirements: ["Passport", "Parent Company Documents", "Business License"]
},
{
  id: "E28E",
  name: "Special Economic Zone Investor Visa",
  category: "Business",
  validity: "Long Term",
  price: "Contact Us",
  fee: 0,
  description: "Investor visa for investment activities within Indonesia’s Special Economic Zones.",
  extendable: true,
  requirements: ["Passport", "SEZ Investment Approval"]
},
{
  id: "E28F",
  name: "Nusantara Capital City Investor Visa",
  category: "Business",
  validity: "Long Term",
  price: "Contact Us",
  fee: 0,
  description: "Investor visa for projects related to Indonesia’s new capital city (IKN Nusantara).",
  extendable: true,
  requirements: ["Passport", "IKN Investment Approval"]
},
{
  id: "E28G",
  name: "Parent Company Representative Investor Visa",
  category: "Business",
  validity: "Up to 1 Year",
  price: "Contact Us",
  fee: 0,
  description: "Investor visa for representatives of parent companies operating in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Parent Company Appointment Letter"]
},
{
  id: "E30",
  name: "Student Visa",
  category: "Education/Research",
  validity: "Up to Study Period",
  price: "Contact Us",
  fee: 0,
  description: "Student visa for foreign nationals studying at accredited educational institutions in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Acceptance Letter", "Institution Sponsorship"]
},
{
  id: "E30A",
  name: "Primary and Secondary Student Visa",
  category: "Education/Research",
  validity: "Up to Study Period",
  price: "Contact Us",
  fee: 0,
  description: "Student visa for primary and secondary education in Indonesia.",
  extendable: true,
  requirements: ["Passport", "School Acceptance Letter", "Guardian Documents"]
},
{
  id: "E30B",
  name: "Higher Education Student Visa",
  category: "Education/Research",
  validity: "Up to Study Period",
  price: "Contact Us",
  fee: 0,
  description: "Student visa for university, college, and higher education programs in Indonesia.",
  extendable: true,
  requirements: ["Passport", "University Acceptance Letter", "Sponsorship Letter"]
},
{
  id: "E30E",
  name: "Special Economic Zone Student Visa",
  category: "Education/Research",
  validity: "Up to Study Period",
  price: "Contact Us",
  fee: 0,
  description: "Student visa for education programs conducted within Special Economic Zones in Indonesia.",
  extendable: true,
  requirements: ["Passport", "SEZ Institution Acceptance Letter"]
},
{
  id: "E30F",
  name: "Student Exchange Visa",
  category: "Education/Research",
  validity: "Up to Exchange Program Period",
  price: "Contact Us",
  fee: 0,
  description: "Student visa for participants in international student exchange programs in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Exchange Program Letter", "Host Institution Sponsorship"]
},
{
  id: "E31",
  name: "Family Visa",
  category: "Family",
  validity: "Up to Sponsor Permit",
  price: "Contact Us",
  fee: 0,
  description: "Family visa for relatives of Indonesian citizens or resident permit holders.",
  extendable: true,
  requirements: ["Passport", "Family Relationship Proof", "Sponsor Documents"]
},
{
  id: "E31A",
  name: "Spouse of Indonesian National Family Visa",
  category: "Family",
  validity: "365 Days",
  price: "Contact Us",
  fee: 0,
  description: "Family visa for foreign spouses legally married to Indonesian nationals.",
  extendable: true,
  requirements: ["Passport", "Marriage Certificate", "Indonesian Spouse ID"]
},
{
  id: "E31B",
  name: "Spouse of Resident Permit Holder Family Visa",
  category: "Family",
  validity: "365 Days",
  price: "Contact Us",
  fee: 0,
  description: "Family visa for spouses of ITAS or ITAP holders residing in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Marriage Certificate", "Spouse ITAS/ITAP"]
},
{
  id: "E31C",
  name: "Child of Indonesian National Family Visa",
  category: "Family",
  validity: "365 Days",
  price: "Contact Us",
  fee: 0,
  description: "Family visa for children born from marriage to an Indonesian national.",
  extendable: true,
  requirements: ["Passport", "Birth Certificate", "Parent Indonesian ID"]
},
{
  id: "E31D",
  name: "Accompanying Child Family Visa",
  category: "Family",
  validity: "365 Days",
  price: "Contact Us",
  fee: 0,
  description: "Family visa for accompanying children from marriage to an Indonesian national.",
  extendable: true,
  requirements: ["Passport", "Birth Certificate", "Marriage Certificate"]
},
{
  id: "E31E",
  name: "Child of Resident Permit Holder Family Visa",
  category: "Family",
  validity: "365 Days",
  price: "Contact Us",
  fee: 0,
  description: "Family visa for children of ITAS or ITAP holders in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Birth Certificate", "Parent ITAS/ITAP"]
},
{
  id: "E31F",
  name: "Child of Indonesian National Parent Family Visa",
  category: "Family",
  validity: "365 Days",
  price: "Contact Us",
  fee: 0,
  description: "Family visa for children of Indonesian nationals.",
  extendable: true,
  requirements: ["Passport", "Birth Certificate", "Parent Indonesian ID"]
},
{
  id: "E31G",
  name: "Parent of Indonesian National Family Visa",
  category: "Family",
  validity: "365 Days",
  price: "Contact Us",
  fee: 0,
  description: "Family visa for parents of Indonesian nationals.",
  extendable: true,
  requirements: ["Passport", "Family Relationship Proof", "Indonesian Child ID"]
},
{
  id: "E31H",
  name: "Parent of Resident Permit Holder Family Visa",
  category: "Family",
  validity: "365 Days",
  price: "Contact Us",
  fee: 0,
  description: "Family visa for parents of ITAS or ITAP holders in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Family Relationship Proof", "Child ITAS/ITAP"]
},
{
  id: "E31J",
  name: "Child Joining Sibling Family Visa",
  category: "Family",
  validity: "365 Days",
  price: "Contact Us",
  fee: 0,
  description: "Family visa for children joining siblings who hold ITAS or ITAP in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Sibling ITAS/ITAP", "Family Relationship Proof"]
},
{
  id: "E32",
  name: "Repatriation and Descendant Visa",
  category: "Other",
  validity: "Up to Permit Period",
  price: "Contact Us",
  fee: 0,
  description: "Visa for former Indonesian citizens or descendants seeking residency in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Proof of Indonesian Descent", "Sponsor Documents"]
},
{
  id: "E32A",
  name: "5-Year Repatriation Visa",
  category: "Other",
  validity: "5 Years",
  price: "Contact Us",
  fee: 0,
  description: "Five-year repatriation visa for former Indonesian citizens.",
  extendable: true,
  requirements: ["Passport", "Former Indonesian Citizenship Proof"]
},
{
  id: "E32B",
  name: "Descendant Visa Golden Visa",
  category: "Other",
  validity: "5 / 10 Years",
  price: "Contact Us",
  fee: 0,
  description: "Golden visa for descendants of Indonesian citizens with long-term residency options.",
  extendable: true,
  requirements: ["Passport", "Proof of Lineage", "Financial Proof"]
},
{
  id: "E32C",
  name: "2-Year Repatriation Visa",
  category: "Other",
  validity: "2 Years",
  price: "Contact Us",
  fee: 0,
  description: "Two-year repatriation visa for former Indonesian citizens.",
  extendable: true,
  requirements: ["Passport", "Former Indonesian Citizenship Proof"]
},
{
  id: "E32D",
  name: "1-Year Repatriation Golden Visa",
  category: "Other",
  validity: "1 Year",
  price: "Contact Us",
  fee: 0,
  description: "One-year golden visa for repatriation with premium residency privileges.",
  extendable: true,
  requirements: ["Passport", "Former Citizenship Proof", "Financial Proof"]
},
{
  id: "E32E",
  name: "Permanent Resident Repatriation Visa",
  category: "Other",
  validity: "Permanent",
  price: "Contact Us",
  fee: 0,
  description: "Permanent residency visa for repatriation applicants under Global Citizen of Indonesia program.",
  extendable: true,
  requirements: ["Passport", "Eligibility Proof", "Government Approval"]
},
{
  id: "E32F",
  name: "Special Expertise Repatriation Visa",
  category: "Other",
  validity: "Up to Permit Period",
  price: "Contact Us",
  fee: 0,
  description: "Repatriation visa for applicants with special expertise under Global Citizen of Indonesia.",
  extendable: true,
  requirements: ["Passport", "Expertise Proof", "Government Endorsement"]
},
{
  id: "E32G",
  name: "Permanent Resident Descendant Visa",
  category: "Other",
  validity: "Permanent",
  price: "Contact Us",
  fee: 0,
  description: "Permanent residency visa for descendants of Indonesian citizens.",
  extendable: true,
  requirements: ["Passport", "Proof of Descent", "Government Approval"]
},
{
  id: "E32H",
  name: "Special Expertise Descendant Visa",
  category: "Other",
  validity: "Up to Permit Period",
  price: "Contact Us",
  fee: 0,
  description: "Visa for descendants with special expertise under Global Citizen of Indonesia.",
  extendable: true,
  requirements: ["Passport", "Expertise Proof", "Government Endorsement"]
},
{
  id: "E33",
  name: "Special Residency Visa",
  category: "Other",
  validity: "Up to Permit Period",
  price: "Contact Us",
  fee: 0,
  description: "Special residency visa for foreign nationals granted long-term stay privileges in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Eligibility Proof", "Sponsor Documents"]
},
{
  id: "E33A",
  name: "Government Appointed Expert Special Residency Visa",
  category: "Other",
  validity: "Up to Permit Period",
  price: "Contact Us",
  fee: 0,
  description: "Special residency visa for experts appointed by the Indonesian government.",
  extendable: true,
  requirements: ["Passport", "Government Appointment Letter"]
},
{
  id: "E33B",
  name: "Government Partnership Expert Golden Visa",
  category: "Other",
  validity: "Up to Permit Period",
  price: "Contact Us",
  fee: 0,
  description: "Golden visa for experts participating in official government partnership programs.",
  extendable: true,
  requirements: ["Passport", "Government Partnership Proof"]
},
{
  id: "E33C",
  name: "Eminent Person Special Residency Visa",
  category: "Other",
  validity: "Up to Permit Period",
  price: "Contact Us",
  fee: 0,
  description: "Special residency visa for eminent or internationally recognized individuals.",
  extendable: true,
  requirements: ["Passport", "Recognition Proof", "Government Endorsement"]
},
{
  id: "E33D",
  name: "Distinguished Entrepreneur Special Residency Visa",
  category: "Other",
  validity: "Up to Permit Period",
  price: "Contact Us",
  fee: 0,
  description: "Special residency visa for distinguished entrepreneurs contributing to Indonesia’s economy.",
  extendable: true,
  requirements: ["Passport", "Business Track Record", "Investment Proof"]
},
{
  id: "E33E",
  name: "5-Year Retiree Special Residency Golden Visa",
  category: "Other",
  validity: "5 Years",
  price: "Contact Us",
  fee: 0,
  description: "Five-year golden residency visa for retirees living in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Retirement Proof", "Financial Proof"]
},
{
  id: "E33F",
  name: "1-Year Retiree Special Residency Visa",
  category: "Other",
  validity: "1 Year",
  price: "Contact Us",
  fee: 0,
  description: "One-year special residency visa for retirees in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Retirement Proof"]
},
{
  id: "E33G",
  name: "Remote Worker Special Residency Golden Visa",
  category: "Employment",
  validity: "Up to Permit Period",
  price: "Contact Us",
  fee: 0,
  description: "Golden visa for remote workers employed by foreign companies while residing in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Employment Proof", "Income Proof"]
},
{
  id: "E34",
  name: "Medical Treatment Resident Visa",
  category: "Other",
  validity: "Up to Treatment Period",
  price: "Contact Us",
  fee: 0,
  description: "Resident visa for foreign nationals undergoing long-term medical treatment in Indonesia.",
  extendable: true,
  requirements: ["Passport", "Medical Referral", "Hospital Letter"]
},
{
  id: "E35",
  name: "Working Holiday Visa",
  category: "Tourist",
  validity: "Up to Program Period",
  price: "Contact Us",
  fee: 0,
  description: "Working holiday visa allowing young travelers to holiday and undertake limited work activities in Indonesia under bilateral agreements.",
  extendable: false,
  requirements: [
    "Passport",
    "Proof of Age Eligibility",
    "Bilateral Agreement Eligibility Proof"
  ]
},
{
  id: "E35A",
  name: "Australia Working Holiday Visa",
  category: "Tourist",
  validity: "Up to Program Period",
  price: "Contact Us",
  fee: 0,
  description: "Working holiday visa specifically for Australian citizens under Indonesia–Australia bilateral working holiday arrangements.",
  extendable: false,
  requirements: [
    "Passport",
    "Australian Citizenship Proof",
    "Program Eligibility Documents"
  ]
}
];


async function main() {
  console.log('Seeding database...');
  
  // Clear existing data
  await prisma.visa.deleteMany({});
  console.log('Cleared existing visas.');

  for (const visa of rawVisas) {
      // Handle price: if object, stringify. If string, keep.
      let priceVal = visa.price;
      if (typeof priceVal !== 'string') {
          priceVal = JSON.stringify(priceVal);
      }

      // Handle fee: if number/object/array, stringify.
      let feeVal = visa.fee;
      if (typeof feeVal !== 'string') {
          feeVal = JSON.stringify(feeVal);
      }
      
      // Handle requirements: always stringify array
      const requirementsVal = JSON.stringify(visa.requirements);

      await prisma.visa.create({
          data: {
              id: visa.id,
              category: visa.category,
              name: visa.name,
              description: visa.description,
              price: priceVal,
              fee: feeVal,
              validity: visa.validity,
              extendable: visa.extendable,
              requirements: requirementsVal
          }
      });
  }
  
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
