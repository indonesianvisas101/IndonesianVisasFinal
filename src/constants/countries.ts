// ISO 3166-1 alpha-2 codes for flags
// Registered (97), Calling Visa (6), Unregistered (Rest)

export interface CountryDef {
    name: string;
    code: string;
    isSpecial?: boolean;
    isUnregistered?: boolean;
}

export const COUNTRY_DATA: CountryDef[] = [
    {
        "name": "Afghanistan",
        "code": "AF",
        "isSpecial": true
    },
    {
        "name": "Albania",
        "code": "AL",
        "isSpecial": false
    },
    {
        "name": "Algeria",
        "code": "AL",
        "isUnregistered": true
    },
    {
        "name": "Andorra",
        "code": "AD",
        "isSpecial": false
    },
    {
        "name": "Angola",
        "code": "AN",
        "isUnregistered": true
    },
    {
        "name": "Antigua and Barbuda",
        "code": "AN",
        "isUnregistered": true
    },
    {
        "name": "Argentina",
        "code": "AR",
        "isSpecial": false
    },
    {
        "name": "Armenia",
        "code": "AM",
        "isSpecial": false
    },
    {
        "name": "Australia",
        "code": "AU",
        "isSpecial": false
    },
    {
        "name": "Austria",
        "code": "AT",
        "isSpecial": false
    },
    {
        "name": "Azerbaijan",
        "code": "AZ",
        "isSpecial": false
    },
    {
        "name": "Bahamas",
        "code": "BA",
        "isUnregistered": true
    },
    {
        "name": "Bahrain",
        "code": "BH",
        "isSpecial": false
    },
    {
        "name": "Bangladesh",
        "code": "BA",
        "isUnregistered": true
    },
    {
        "name": "Barbados",
        "code": "BA",
        "isUnregistered": true
    },
    {
        "name": "Belarus",
        "code": "BY",
        "isSpecial": false
    },
    {
        "name": "Belgium",
        "code": "BE",
        "isSpecial": false
    },
    {
        "name": "Belize",
        "code": "BE",
        "isUnregistered": true
    },
    {
        "name": "Benin",
        "code": "BE",
        "isUnregistered": true
    },
    {
        "name": "Bhutan",
        "code": "BH",
        "isUnregistered": true
    },
    {
        "name": "Bolivia",
        "code": "BO",
        "isUnregistered": true
    },
    {
        "name": "Bosnia and Herzegovina",
        "code": "BA",
        "isSpecial": false
    },
    {
        "name": "Botswana",
        "code": "BO",
        "isUnregistered": true
    },
    {
        "name": "Brazil",
        "code": "BR",
        "isSpecial": false
    },
    {
        "name": "Brunei Darussalam",
        "code": "BN",
        "isSpecial": false
    },
    {
        "name": "Bulgaria",
        "code": "BG",
        "isSpecial": false
    },
    {
        "name": "Burkina Faso",
        "code": "BU",
        "isUnregistered": true
    },
    {
        "name": "Burundi",
        "code": "BU",
        "isUnregistered": true
    },
    {
        "name": "Cabo Verde",
        "code": "CA",
        "isUnregistered": true
    },
    {
        "name": "Cambodia",
        "code": "KH",
        "isSpecial": false
    },
    {
        "name": "Cameroon",
        "code": "CM",
        "isSpecial": true
    },
    {
        "name": "Canada",
        "code": "CA",
        "isSpecial": false
    },
    {
        "name": "Central African Republic",
        "code": "CE",
        "isUnregistered": true
    },
    {
        "name": "Chad",
        "code": "CH",
        "isUnregistered": true
    },
    {
        "name": "Chile",
        "code": "CL",
        "isSpecial": false
    },
    {
        "name": "China",
        "code": "CN",
        "isSpecial": false
    },
    {
        "name": "Colombia",
        "code": "CO",
        "isSpecial": false
    },
    {
        "name": "Comoros",
        "code": "CO",
        "isUnregistered": true
    },
    {
        "name": "Congo (Brazzaville)",
        "code": "CO",
        "isUnregistered": true
    },
    {
        "name": "Congo (Kinshasa)",
        "code": "CO",
        "isUnregistered": true
    },
    {
        "name": "Costa Rica",
        "code": "CO",
        "isUnregistered": true
    },
    {
        "name": "Croatia",
        "code": "HR",
        "isSpecial": false
    },
    {
        "name": "Cuba",
        "code": "CU",
        "isUnregistered": true
    },
    {
        "name": "Cyprus",
        "code": "CY",
        "isSpecial": false
    },
    {
        "name": "Czech Republic",
        "code": "CZ",
        "isSpecial": false
    },
    {
        "name": "Denmark",
        "code": "DK",
        "isSpecial": false
    },
    {
        "name": "Djibouti",
        "code": "DJ",
        "isUnregistered": true
    },
    {
        "name": "Dominica",
        "code": "DO",
        "isUnregistered": true
    },
    {
        "name": "Dominican Republic",
        "code": "DO",
        "isUnregistered": true
    },
    {
        "name": "Ecuador",
        "code": "EC",
        "isSpecial": false
    },
    {
        "name": "Egypt",
        "code": "EG",
        "isSpecial": false
    },
    {
        "name": "El Salvador",
        "code": "EL",
        "isUnregistered": true
    },
    {
        "name": "Equatorial Guinea",
        "code": "EQ",
        "isUnregistered": true
    },
    {
        "name": "Eritrea",
        "code": "ER",
        "isUnregistered": true
    },
    {
        "name": "Estonia",
        "code": "EE",
        "isSpecial": false
    },
    {
        "name": "Eswatini",
        "code": "ES",
        "isUnregistered": true
    },
    {
        "name": "Ethiopia",
        "code": "ET",
        "isUnregistered": true
    },
    {
        "name": "Fiji",
        "code": "FI",
        "isUnregistered": true
    },
    {
        "name": "Finland",
        "code": "FI",
        "isSpecial": false
    },
    {
        "name": "France",
        "code": "FR",
        "isSpecial": false
    },
    {
        "name": "Gabon",
        "code": "GA",
        "isUnregistered": true
    },
    {
        "name": "Gambia",
        "code": "GA",
        "isUnregistered": true
    },
    {
        "name": "Georgia",
        "code": "GE",
        "isUnregistered": true
    },
    {
        "name": "Germany",
        "code": "DE",
        "isSpecial": false
    },
    {
        "name": "Ghana",
        "code": "GH",
        "isUnregistered": true
    },
    {
        "name": "Greece",
        "code": "GR",
        "isSpecial": false
    },
    {
        "name": "Grenada",
        "code": "GR",
        "isUnregistered": true
    },
    {
        "name": "Guatemala",
        "code": "GT",
        "isSpecial": false
    },
    {
        "name": "Guinea",
        "code": "GN",
        "isSpecial": true
    },
    {
        "name": "Guinea-Bissau",
        "code": "GU",
        "isUnregistered": true
    },
    {
        "name": "Guyana",
        "code": "GU",
        "isUnregistered": true
    },
    {
        "name": "Haiti",
        "code": "HA",
        "isUnregistered": true
    },
    {
        "name": "Honduras",
        "code": "HO",
        "isUnregistered": true
    },
    {
        "name": "Hong Kong",
        "code": "HK",
        "isSpecial": false
    },
    {
        "name": "Hungary",
        "code": "HU",
        "isSpecial": false
    },
    {
        "name": "Iceland",
        "code": "IS",
        "isSpecial": false
    },
    {
        "name": "India",
        "code": "IN",
        "isSpecial": false
    },
    {
        "name": "Iran",
        "code": "IR",
        "isUnregistered": true
    },
    {
        "name": "Iraq",
        "code": "IR",
        "isUnregistered": true
    },
    {
        "name": "Ireland",
        "code": "IE",
        "isSpecial": false
    },
    {
        "name": "Israel",
        "code": "IL",
        "isSpecial": true
    },
    {
        "name": "Italy",
        "code": "IT",
        "isSpecial": false
    },
    {
        "name": "Ivory Coast",
        "code": "IV",
        "isUnregistered": true
    },
    {
        "name": "Jamaica",
        "code": "JA",
        "isUnregistered": true
    },
    {
        "name": "Japan",
        "code": "JP",
        "isSpecial": false
    },
    {
        "name": "Jordan",
        "code": "JO",
        "isSpecial": false
    },
    {
        "name": "Kazakhstan",
        "code": "KZ",
        "isSpecial": false
    },
    {
        "name": "Kenya",
        "code": "KE",
        "isSpecial": false
    },
    {
        "name": "Kiribati",
        "code": "KI",
        "isUnregistered": true
    },
    {
        "name": "Kosovo",
        "code": "KO",
        "isUnregistered": true
    },
    {
        "name": "Kuwait",
        "code": "KW",
        "isSpecial": false
    },
    {
        "name": "Kyrgyzstan",
        "code": "KY",
        "isUnregistered": true
    },
    {
        "name": "Laos",
        "code": "LA",
        "isSpecial": false
    },
    {
        "name": "Latvia",
        "code": "LV",
        "isSpecial": false
    },
    {
        "name": "Lebanon",
        "code": "LE",
        "isUnregistered": true
    },
    {
        "name": "Lesotho",
        "code": "LE",
        "isUnregistered": true
    },
    {
        "name": "Liberia",
        "code": "LR",
        "isSpecial": true
    },
    {
        "name": "Libya",
        "code": "LI",
        "isUnregistered": true
    },
    {
        "name": "Liechtenstein",
        "code": "LI",
        "isSpecial": false
    },
    {
        "name": "Lithuania",
        "code": "LT",
        "isSpecial": false
    },
    {
        "name": "Luxembourg",
        "code": "LU",
        "isSpecial": false
    },
    {
        "name": "Madagascar",
        "code": "MA",
        "isUnregistered": true
    },
    {
        "name": "Malawi",
        "code": "MA",
        "isUnregistered": true
    },
    {
        "name": "Malaysia",
        "code": "MY",
        "isSpecial": false
    },
    {
        "name": "Maldives",
        "code": "MV",
        "isSpecial": false
    },
    {
        "name": "Mali",
        "code": "MA",
        "isUnregistered": true
    },
    {
        "name": "Malta",
        "code": "MT",
        "isSpecial": false
    },
    {
        "name": "Marshall Islands",
        "code": "MA",
        "isUnregistered": true
    },
    {
        "name": "Mauritania",
        "code": "MA",
        "isUnregistered": true
    },
    {
        "name": "Mauritius",
        "code": "MU",
        "isSpecial": false
    },
    {
        "name": "Mexico",
        "code": "MX",
        "isSpecial": false
    },
    {
        "name": "Micronesia",
        "code": "MI",
        "isUnregistered": true
    },
    {
        "name": "Moldova",
        "code": "MO",
        "isUnregistered": true
    },
    {
        "name": "Monaco",
        "code": "MC",
        "isSpecial": false
    },
    {
        "name": "Mongolia",
        "code": "MN",
        "isSpecial": false
    },
    {
        "name": "Montenegro",
        "code": "MO",
        "isUnregistered": true
    },
    {
        "name": "Morocco",
        "code": "MA",
        "isSpecial": false
    },
    {
        "name": "Mozambique",
        "code": "MZ",
        "isSpecial": false
    },
    {
        "name": "Myanmar",
        "code": "MM",
        "isSpecial": false
    },
    {
        "name": "Nauru",
        "code": "NA",
        "isUnregistered": true
    },
    {
        "name": "Nepal",
        "code": "NE",
        "isUnregistered": true
    },
    {
        "name": "Netherlands",
        "code": "NL",
        "isSpecial": false
    },
    {
        "name": "New Zealand",
        "code": "NZ",
        "isSpecial": false
    },
    {
        "name": "Nicaragua",
        "code": "NI",
        "isUnregistered": true
    },
    {
        "name": "Niger",
        "code": "NI",
        "isUnregistered": true
    },
    {
        "name": "Nigeria",
        "code": "NG",
        "isSpecial": true
    },
    {
        "name": "North Korea",
        "code": "KP",
        "isSpecial": true
    },
    {
        "name": "North Macedonia",
        "code": "NO",
        "isUnregistered": true
    },
    {
        "name": "Norway",
        "code": "NO",
        "isSpecial": false
    },
    {
        "name": "Oman",
        "code": "OM",
        "isSpecial": false
    },
    {
        "name": "Pakistan",
        "code": "PA",
        "isUnregistered": true
    },
    {
        "name": "Palau",
        "code": "PA",
        "isUnregistered": true
    },
    {
        "name": "Palestine",
        "code": "PS",
        "isSpecial": false
    },
    {
        "name": "Panama",
        "code": "PA",
        "isUnregistered": true
    },
    {
        "name": "Papua New Guinea",
        "code": "PG",
        "isSpecial": false
    },
    {
        "name": "Paraguay",
        "code": "PA",
        "isUnregistered": true
    },
    {
        "name": "Peru",
        "code": "PE",
        "isSpecial": false
    },
    {
        "name": "Philippines",
        "code": "PH",
        "isSpecial": false
    },
    {
        "name": "Poland",
        "code": "PL",
        "isSpecial": false
    },
    {
        "name": "Portugal",
        "code": "PT",
        "isSpecial": false
    },
    {
        "name": "Qatar",
        "code": "QA",
        "isSpecial": false
    },
    {
        "name": "Romania",
        "code": "RO",
        "isSpecial": false
    },
    {
        "name": "Russia",
        "code": "RU",
        "isSpecial": false
    },
    {
        "name": "Rwanda",
        "code": "RW",
        "isSpecial": false
    },
    {
        "name": "Saint Kitts and Nevis",
        "code": "SA",
        "isUnregistered": true
    },
    {
        "name": "Saint Lucia",
        "code": "SA",
        "isUnregistered": true
    },
    {
        "name": "Saint Vincent",
        "code": "SA",
        "isUnregistered": true
    },
    {
        "name": "Samoa",
        "code": "SA",
        "isUnregistered": true
    },
    {
        "name": "San Marino",
        "code": "SA",
        "isUnregistered": true
    },
    {
        "name": "Sao Tome and Principe",
        "code": "SA",
        "isUnregistered": true
    },
    {
        "name": "Saudi Arabia",
        "code": "SA",
        "isSpecial": false
    },
    {
        "name": "Senegal",
        "code": "SE",
        "isUnregistered": true
    },
    {
        "name": "Serbia",
        "code": "RS",
        "isSpecial": false
    },
    {
        "name": "Seychelles",
        "code": "SC",
        "isSpecial": false
    },
    {
        "name": "Sierra Leone",
        "code": "SI",
        "isUnregistered": true
    },
    {
        "name": "Singapore",
        "code": "SG",
        "isSpecial": false
    },
    {
        "name": "Slovakia",
        "code": "SK",
        "isSpecial": false
    },
    {
        "name": "Slovenia",
        "code": "SI",
        "isSpecial": false
    },
    {
        "name": "Solomon Islands",
        "code": "SO",
        "isUnregistered": true
    },
    {
        "name": "Somalia",
        "code": "SO",
        "isSpecial": true
    },
    {
        "name": "South Africa",
        "code": "ZA",
        "isSpecial": false
    },
    {
        "name": "South Korea",
        "code": "KR",
        "isSpecial": false
    },
    {
        "name": "South Sudan",
        "code": "SO",
        "isUnregistered": true
    },
    {
        "name": "Spain",
        "code": "ES",
        "isSpecial": false
    },
    {
        "name": "Sri Lanka",
        "code": "SR",
        "isUnregistered": true
    },
    {
        "name": "Sudan",
        "code": "SU",
        "isUnregistered": true
    },
    {
        "name": "Suriname",
        "code": "SR",
        "isSpecial": false
    },
    {
        "name": "Sweden",
        "code": "SE",
        "isSpecial": false
    },
    {
        "name": "Switzerland",
        "code": "CH",
        "isSpecial": false
    },
    {
        "name": "Syria",
        "code": "SY",
        "isUnregistered": true
    },
    {
        "name": "Taiwan",
        "code": "TW",
        "isSpecial": false
    },
    {
        "name": "Tajikistan",
        "code": "TA",
        "isUnregistered": true
    },
    {
        "name": "Tanzania",
        "code": "TZ",
        "isSpecial": false
    },
    {
        "name": "Thailand",
        "code": "TH",
        "isSpecial": false
    },
    {
        "name": "Timor-Leste",
        "code": "TL",
        "isSpecial": false
    },
    {
        "name": "Togo",
        "code": "TO",
        "isUnregistered": true
    },
    {
        "name": "Tonga",
        "code": "TO",
        "isUnregistered": true
    },
    {
        "name": "Trinidad and Tobago",
        "code": "TR",
        "isUnregistered": true
    },
    {
        "name": "Tunisia",
        "code": "TN",
        "isSpecial": false
    },
    {
        "name": "Turkey",
        "code": "TR",
        "isSpecial": false
    },
    {
        "name": "Turkmenistan",
        "code": "TU",
        "isUnregistered": true
    },
    {
        "name": "Tuvalu",
        "code": "TU",
        "isUnregistered": true
    },
    {
        "name": "Uganda",
        "code": "UG",
        "isUnregistered": true
    },
    {
        "name": "Ukraine",
        "code": "UA",
        "isSpecial": false
    },
    {
        "name": "United Arab Emirates",
        "code": "AE",
        "isSpecial": false
    },
    {
        "name": "United Kingdom",
        "code": "GB",
        "isSpecial": false
    },
    {
        "name": "United States",
        "code": "US",
        "isSpecial": false
    },
    {
        "name": "Uruguay",
        "code": "UR",
        "isUnregistered": true
    },
    {
        "name": "Uzbekistan",
        "code": "UZ",
        "isSpecial": false
    },
    {
        "name": "Vanuatu",
        "code": "VA",
        "isUnregistered": true
    },
    {
        "name": "Vatican",
        "code": "VA",
        "isSpecial": false
    },
    {
        "name": "Venezuela",
        "code": "VE",
        "isSpecial": false
    },
    {
        "name": "Vietnam",
        "code": "VN",
        "isSpecial": false
    },
    {
        "name": "Yemen",
        "code": "YE",
        "isUnregistered": true
    },
    {
        "name": "Zambia",
        "code": "ZA",
        "isUnregistered": true
    },
    {
        "name": "Zimbabwe",
        "code": "ZI",
        "isUnregistered": true
    }
];

// Backward compatibility or quick access arrays
export const STANDARD_COUNTRIES = COUNTRY_DATA.filter(c => !c.isSpecial && !c.isUnregistered).map(c => c.name);
export const SPECIAL_COUNTRIES = COUNTRY_DATA.filter(c => c.isSpecial).map(c => c.name);
export const UNREGISTERED_COUNTRIES = COUNTRY_DATA.filter(c => c.isUnregistered).map(c => c.name);
