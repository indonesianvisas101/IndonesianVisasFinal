export interface RegionalHub {
    id: string;
    name: string;
    displayName: string;
    heading: string;
    description: string;
    visas: string[]; // List of visa IDs to feature
    image?: string;
}

export const REGIONAL_HUBS: Record<string, RegionalHub> = {
    'Bali': {
        id: 'Bali',
        name: 'Bali',
        displayName: 'Bali, Indonesia',
        heading: 'Ultimate Bali Visa Hub',
        description: 'Explore the most popular visas for Bali. From digital nomad hideaways to luxury investment, we guide you through every immigration step in the Island of Gods.',
        visas: ['Tourist-Visa', 'B211A-Visa', 'Digital-Nomad', 'Investor-KITAS']
    },
    'Jakarta': {
        id: 'Jakarta',
        name: 'Jakarta',
        displayName: 'Jakarta (Capital)',
        heading: 'Jakarta Business & Entry Hub',
        description: 'The definitive center for business, investment, and corporate immigration in Indonesia\'s capital. Seamlessly navigate the highest concentration of immigration offices.',
        visas: ['Business-Visa', 'Working-KITAS', 'Investor-KITAS']
    },
    'Lombok': {
        id: 'Lombok',
        name: 'Lombok',
        displayName: 'Lombok & Gili Islands',
        heading: 'Lombok Travel & Residency',
        description: 'Quiet beaches and booming development. Secure your visa for Lombok and the Gili Islands with official sponsorship from PT Indonesian Visas.',
        visas: ['Tourist-Visa', 'B211A-Visa']
    },
    'Australia': {
        id: 'Australia',
        name: 'Australia',
        displayName: 'Australia to Indonesia',
        heading: 'Australian Travelers Hub',
        description: 'Specialized visa guidance for Australian citizens. From eVisa on Arrival to long-term residency, we bridge the gap between Oz and Indo.',
        visas: ['Tourist-Visa', 'B211A-Visa', 'Retirement-KITAS']
    },
    // --- ANALYTICS-DRIVEN TOP 10 EXPANSION ---
    'United-States': {
        id: 'United-States',
        name: 'United States',
        displayName: 'USA to Indonesia',
        heading: 'Indonesian Visa for Americans 2026',
        description: 'Exclusive immigration portal for US Citizens. Whether you are moving for business or remote work, we provide authorized PT Indonesian Visas sponsorship.',
        visas: ['Tourist-Visa', 'B211A-Visa', 'Digital-Nomad', 'Business-Visa']
    },
    'France': {
        id: 'France',
        name: 'France',
        displayName: 'France to Indonesia',
        heading: 'Centre des Visas pour les Français',
        description: 'Le guide premium pour les citoyens français souhaitant résider en Indonésie. Sécurisez votre visa B211A ou KITAS avec notre expertise officielle.',
        visas: ['Tourist-Visa', 'B211A-Visa', 'Digital-Nomad']
    },
    'Mexico': {
        id: 'Mexico',
        name: 'Mexico',
        displayName: 'México a Indonesia',
        heading: 'Visa para Ciudadanos Mexicanos',
        description: 'Obtenga su permiso de entrada oficial para Bali y Yakarta. Facilitamos el eVisa para viajeros de México con total seguridad jurídica.',
        visas: ['Tourist-Visa', 'B211A-Visa']
    },
    'Netherlands': {
        id: 'Netherlands',
        name: 'Netherlands',
        displayName: 'Netherlands to Indonesia',
        heading: 'Indonesisch Visum voor Nederlanders',
        description: 'Navigate the historic and modern visa pathways between the Netherlands and Indonesia. Special focus on dual heritage and retirement visas.',
        visas: ['Tourist-Visa', 'B211A-Visa', 'Retirement-KITAS']
    },
    'Canada': {
        id: 'Canada',
        name: 'Canada',
        displayName: 'Canada to Indonesia',
        heading: 'Indonesian Visa Hub for Canadians',
        description: 'The definitive center for Canadian travelers and investors. From the Rocky Mountains to Bali\'s beaches, let us handle your immigration strategy.',
        visas: ['Tourist-Visa', 'B211A-Visa', 'Investor-KITAS']
    },
    'Poland': {
        id: 'Poland',
        name: 'Poland',
        displayName: 'Poland to Indonesia',
        heading: 'Wizy do Indonezji dla Polaków',
        description: 'A dedicated portal for Polish citizens. Secure your VoA or B211A visa without the bureaucracy. Official PT Indonesian Visas support.',
        visas: ['Tourist-Visa', 'B211A-Visa']
    },
    'Brazil': {
        id: 'Brazil',
        name: 'Brazil',
        displayName: 'Brasil para Indonésia',
        heading: 'Visto Indonésio para Brasileiros',
        description: 'Tudo o que os cidadãos brasileiros precisam saber para entrar em Bali. Processamento rápido de vistos para turismo e investimentos.',
        visas: ['Tourist-Visa', 'B211A-Visa', 'Business-Visa']
    },
    'China': {
        id: 'China',
        name: 'China',
        displayName: 'China to Indonesia',
        heading: '中印官方签证中心 (China Hub)',
        description: 'Official corporate entry for Chinese investors and travelers. From market entry visas to industrial KITAS, we provide full legal mediation.',
        visas: ['Business-Visa', 'Investor-KITAS', 'Tourist-Visa']
    },
    'Singapore': {
        id: 'Singapore',
        name: 'Singapore',
        displayName: 'Singapore to Indonesia',
        heading: 'Singapore - Indonesia Corridor',
        description: 'The ultimate guide for the busiest travel route in South East Asia. Expert handling for cross-border business and weekend residency permits.',
        visas: ['Business-Visa', 'B211A-Visa', 'Tourist-Visa']
    },
    'Sweden': {
        id: 'Sweden',
        name: 'Sweden',
        displayName: 'Sweden to Indonesia',
        heading: 'Indonesiska Visum för Svenskar',
        description: 'Modern, high-speed visa solutions for Swedish travelers. Secure your Indonesian entry for 2026 with our premium relocation services.',
        visas: ['Tourist-Visa', 'B211A-Visa', 'Digital-Nomad']
    }
};
