export interface VisaDetail {
    id: string;
    badge: string;
    type: string;
    intro: string;
    description: { title: string; text: string };
    allowed: { title: string; text: string };
    sponsor: { title: string; text: string };
    period: { title: string; text: string };
    pricing: {
        title: string;
        note?: string;
        options: {
            title: string;
            rows: { label: string; value: string; isTotal?: boolean }[];
        }[];
    };
    requirements: { title: string; items: string[]; note?: string };
    special?: { title: string; text: string };
    provisions: { title: string; text: string };
    processing: { title: string; text: string };
    cta: { title: string; subtitle: string };
}

export const VISA_DETAILS: Record<string, VisaDetail> = {
    "E28A": {
        id: "E28A",
        badge: "E28A Investment KITAS",
        type: "Multiple Entry",
        intro: "The E28A Investment KITAS is a limited stay permit granted to foreign investors or shareholders of an Indonesian company, allowing them to reside in Indonesia based on their investment status.",
        description: {
            title: "What is E28A Investment KITAS?",
            text: "The E28A Investment KITAS is a limited stay permit granted to foreign investors or shareholders of an Indonesian company, allowing them to reside in Indonesia based on their investment status.\n\nKITAS Investasi E28A adalah izin tinggal terbatas yang diberikan kepada investor asing atau pemegang saham perusahaan di Indonesia, yang memungkinkan mereka tinggal di Indonesia berdasarkan status investasinya."
        },
        allowed: {
            title: "Allowed Activities / Aktivitas yang Diizinkan",
            text: "Permitted activities are limited to board-level, ownership, and strategic oversight functions consistent with investor status. This permit does not automatically grant the right to work or engage in daily operational roles within the company unless additional permits are obtained in accordance with manpower and immigration regulations.\n\nAktivitas yang diizinkan terbatas pada fungsi kepemilikan, tingkat direksi, dan pengawasan strategis sesuai dengan status investor. Izin ini tidak secara otomatis memberikan hak untuk bekerja atau menjalankan peran operasional harian dalam perusahaan, kecuali terdapat izin tambahan sesuai dengan peraturan ketenagakerjaan dan imigrasi."
        },
        sponsor: {
            title: "Sponsor Requirements",
            text: "Need a Guarantor - Your Indonesian investment company registered with the Ministry of Investment/Investment Coordinating Board."
        },
        period: {
            title: "Period of Stay / Masa Tinggal",
            text: "The stay permit is valid for the duration approved by immigration authorities and may be extendable in accordance with applicable regulations.\n\nIzin tinggal berlaku sesuai durasi yang disetujui oleh imigrasi dan dapat diperpanjang sesuai ketentuan yang berlaku."
        },
        pricing: {
            title: "Visa Fees / Biaya Visa",
            note: "Visa approval, permitted activities, duration of stay, and compliance obligations are determined solely by the Indonesian Immigration Authority and other relevant government institutions. Processing timelines and eligibility are subject to regulatory review and may change without prior notice.\n\nPersetujuan visa, aktivitas yang diizinkan, durasi izin tinggal, dan kewajiban kepatuhan sepenuhnya ditentukan oleh otoritas Imigrasi Indonesia dan instansi pemerintah terkait. Estimasi waktu proses dan kelayakan tunduk pada peninjauan regulasi dan dapat berubah sewaktu-waktu.",
            options: [
                {
                    title: "1 year stay - Complete Package",
                    rows: [
                        { label: "Limited Stay Visa", value: "Rp. 500,000" },
                        { label: "Verification Fee II", value: "Rp. 2,000,000" },
                        { label: "Limited Stay Permit (KITAS) - 1 year", value: "Rp. 3,000,000" },
                        { label: "Re-entry Permit - 1 year", value: "Rp. 1,500,000" },
                        { label: "TOTAL", value: "Rp. 7,000,000", isTotal: true }
                    ]
                },
                {
                    title: "2 year stay - Complete Package",
                    rows: [
                        { label: "Limited Stay Visa", value: "Rp. 500,000" },
                        { label: "Category II Visa Verification Fee", value: "Rp. 2,000,000" },
                        { label: "Limited Stay Permit (KITAS) - 2 years", value: "Rp. 5,000,000" },
                        { label: "Re-entry Permit - 2 years", value: "Rp. 2,000,000" },
                        { label: "TOTAL", value: "Rp. 9,500,000", isTotal: true }
                    ]
                }
            ]
        },
        requirements: {
            title: "Submission Requirements",
            items: [
                "Visa issuance application letter",
                "Valid national passport (minimum 6 months validity before expiration)",
                "Bank statement (last 3 months, min USD $2,000 or equivalent) in your name or guarantor's name",
                "Recent color photograph (within the last year)",
                "Detailed curriculum vitae (CV)",
                "Travel details (itinerary)",
                "E-visa account at evisa.imigrasi.go.id"
            ],
            note: "You must have an account at evisa.imigrasi.go.id before applying. Your guarantor company will submit the application on your behalf. All documents must be uploaded in electronic format."
        },
        special: {
            title: "Special Requirements for Investment Visa",
            text: "Proof of share ownership of at least IDR 10,000,000,000.00 (ten billion rupiah) or equivalent in a guarantor company registered with the Ministry of Investment/Investment Coordinating Board."
        },
        provisions: {
            title: "Other Provisions",
            text: "Visa is valid for 90 days from the date of issue. If unused after that period, foreigners must apply for a new visa to enter Indonesia. Please note that the visa validity period differs from the length of stay; please check your visa for information on the length of stay. A Limited Stay Permit (ITAS) and a Re-Entry Permit will be issued automatically once you are granted entry by an officer at the Immigration Checkpoint. You are prohibited from staying in Indonesia beyond the period of stay, engaging in work inconsistent with your stay permit, or selling goods or services unless required for the work."
        },
        processing: {
            title: "Processing Time / Waktu Pemrosesan",
            text: "Processing timelines and eligibility are subject to regulatory review and may change without prior notice.\n\nEstimasi waktu proses dan kelayakan tunduk pada peninjauan regulasi dan dapat berubah sewaktu-waktu."
        },
        cta: {
            title: "Apply for E28A Investment KITAS",
            subtitle: "Proceed with your E28A Investment KITAS application."
        }
    },
    "E33G": {
        id: "E33G",
        badge: "E33G Digital Nomad Visa",
        type: "Multiple Entry",
        intro: "The E33G Digital Nomad Visa is a limited stay visa intended for foreign nationals who work remotely for employers or businesses outside Indonesia, allowing them to reside in Indonesia while conducting overseas employment or business activities.",
        description: {
            title: "What is E33G Digital Nomad Visa?",
            text: "The E33G Digital Nomad Visa is a limited stay visa intended for foreign nationals who work remotely for employers or businesses outside Indonesia, allowing them to reside in Indonesia while conducting overseas employment or business activities.\n\nVisa Digital Nomad E33G adalah visa tinggal terbatas yang diperuntukkan bagi warga negara asing yang bekerja secara jarak jauh untuk perusahaan atau bisnis di luar Indonesia, dan memungkinkan mereka tinggal di Indonesia selama menjalankan aktivitas pekerjaan atau usaha dari luar negeri."
        },
        allowed: {
            title: "Allowed Activities / Aktivitas yang Diizinkan",
            text: "This visa does not permit employment, service provision, or income-generating activities within Indonesia, nor does it allow engagement with Indonesian entities for paid work.\n\nVisa ini tidak mengizinkan bekerja, memberikan jasa, atau melakukan aktivitas yang menghasilkan pendapatan di wilayah Indonesia, serta tidak memperbolehkan keterlibatan kerja berbayar dengan entitas Indonesia."
        },
        sponsor: {
            title: "Sponsor Requirements",
            text: "No Guarantor Required - Self-sponsored visa for independent remote workers."
        },
        period: {
            title: "Period of Stay / Masa Tinggal",
            text: "The permitted stay period follows immigration approval and prevailing regulations.\n\nMasa tinggal mengikuti persetujuan imigrasi dan ketentuan yang berlaku."
        },
        pricing: {
            title: "Visa Fees / Biaya Visa",
            note: "Visa approval, permitted activities, duration of stay, and compliance obligations are determined solely by the Indonesian Immigration Authority and other relevant government institutions. Processing timelines and eligibility are subject to regulatory review and may change without prior notice.\n\nPersetujuan visa, aktivitas yang diizinkan, durasi izin tinggal, dan kewajiban kepatuhan sepenuhnya ditentukan oleh otoritas Imigrasi Indonesia dan instansi pemerintah terkait. Estimasi waktu proses dan kelayakan tunduk pada peninjauan regulasi dan dapat berubah sewaktu-waktu.",
            options: [
                {
                    title: "1 year stay - Complete Package",
                    rows: [
                        { label: "Limited Stay Visa", value: "Rp. 500,000" },
                        { label: "Category II Visa Verification Fee", value: "Rp. 2,000,000" },
                        { label: "Limited Stay Permit (KITAS) - 1 year", value: "Rp. 3,000,000" },
                        { label: "Re-entry Permit - 1 year", value: "Rp. 1,500,000" },
                        { label: "TOTAL", value: "Rp. 7,000,000", isTotal: true }
                    ]
                }
            ]
        },
        requirements: {
            title: "Submission Requirements",
            items: [
                "Valid national passport (minimum 6 months validity before expiration)",
                "Bank statement (last 3 months, min USD $2,000 or equivalent)",
                "Recent color photograph (from last year)",
                "Detailed curriculum vitae (CV)",
                "Travel history (itinerary)",
                "E-visa account at evisa.imigrasi.go.id"
            ],
            note: "You must create an account at evisa.imigrasi.go.id before applying. All documents must be uploaded in electronic format (PDF or JPEG files)."
        },
        special: {
            title: "Tax & Legal Positioning / Posisi Pajak & Hukum",
            text: "Tax obligations are subject to individual circumstances and applicable Indonesian regulations. Holders of this visa are responsible for ensuring compliance with all tax and legal requirements.\n\nKewajiban perpajakan tunduk pada kondisi masing-masing individu dan peraturan perpajakan Indonesia yang berlaku. Pemegang visa bertanggung jawab memastikan kepatuhan terhadap seluruh ketentuan hukum dan perpajakan."
        },
        provisions: {
            title: "Other Provisions",
            text: "Visa is valid for 90 days from the date of issue. If unused after that period, foreigners must apply for a new visa to enter Indonesia. Please note that the validity period of a visa differs from the length of stay; please check your visa for information on the length of stay. Limited Stay Permits and Re-Entry Permits will be issued automatically once you are granted entry by an officer at the Immigration Checkpoint. You are prohibited from staying in Indonesia beyond the period of stay, engaging in work inconsistent with your stay permit, or selling goods or services, unless required for your work."
        },
        processing: {
            title: "Processing Time / Waktu Pemrosesan",
            text: "Processing timelines and eligibility are subject to regulatory review and may change without prior notice.\n\nEstimasi waktu proses dan kelayakan tunduk pada peninjauan regulasi dan dapat berubah sewaktu-waktu."
        },
        cta: {
            title: "Apply for E33G Digital Nomad Visa",
            subtitle: "Proceed with your E33G Digital Nomad Visa application."
        }
    },
    "D12": {
        id: "D12",
        badge: "D12 Pre-Investment Visit Visa",
        type: "Multiple Entry",
        intro: "The D12 Pre-Investment Visit Visa is intended for foreign nationals who plan to explore and assess investment opportunities in Indonesia, including feasibility studies, preliminary meetings, and preparatory activities prior to formal company establishment or investment realization.",
        description: {
            title: "What is D12 Pre-Investment Visa?",
            text: "The D12 Pre-Investment Visit Visa is intended for foreign nationals who plan to explore and assess investment opportunities in Indonesia, including feasibility studies, preliminary meetings, and preparatory activities prior to formal company establishment or investment realization.\n\nVisa Kunjungan Pra-Investasi D12 diperuntukkan bagi warga negara asing yang berencana menjajaki dan menilai peluang investasi di Indonesia, termasuk studi kelayakan, pertemuan awal, dan aktivitas persiapan sebelum pendirian perusahaan atau realisasi investasi."
        },
        allowed: {
            title: "Allowed Activities / Aktivitas yang Diizinkan",
            text: "This visa does not grant the right to work, manage daily operations, or engage in revenue-generating activities.\n\nVisa ini tidak memberikan hak untuk bekerja, mengelola operasional harian, atau melakukan aktivitas yang menghasilkan pendapatan."
        },
        sponsor: {
            title: "Sponsor Requirements",
            text: "No Sponsor Required - This is the key advantage of the D12 visa."
        },
        period: {
            title: "Period of Stay / Masa Tinggal",
            text: "The permitted stay period is subject to immigration approval and prevailing regulations.\n\nMasa tinggal yang diizinkan tunduk pada persetujuan imigrasi dan regulasi yang berlaku."
        },
        pricing: {
            title: "Visa Fees / Biaya Visa",
            note: "Visa approval, permitted activities, and length of stay are determined solely by the Indonesian Immigration Authority. Processing timelines are estimates and may vary based on eligibility, documentation, and regulatory conditions.\n\nPersetujuan visa, aktivitas yang diizinkan, dan lama izin tinggal sepenuhnya ditentukan oleh otoritas Imigrasi Indonesia. Estimasi waktu proses dapat berbeda tergantung kelayakan, kelengkapan dokumen, dan ketentuan yang berlaku.",
            options: [
                {
                    title: "1 year validity",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 3,000,000" },
                        { label: "Fee", value: "Rp. 1,000,000" },
                        { label: "TOTAL", value: "Rp. 4,000,000", isTotal: true }
                    ]
                },
                {
                    title: "2 year validity",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 5,000,000" },
                        { label: "Fee", value: "Rp. 1,000,000" },
                        { label: "TOTAL", value: "Rp. 6,000,000", isTotal: true }
                    ]
                }
            ]
        },
        requirements: {
            title: "Submission Requirements",
            items: [
                "Valid passport (minimum 6 months validity)",
                "Bank statement",
                "Recent color photograph",
                "Return ticket/onward ticket"
            ],
            note: "All documents must be uploaded in electronic format."
        },
        special: {
            title: "Special Note",
            text: "Excellent for the 'setup phase' before establishing a company (PT PMA)."
        },
        provisions: {
            title: "Other Provisions",
            text: "Prohibited from engaging in manual labor or retail trade."
        },
        processing: {
            title: "Processing Time / Waktu Pemrosesan",
            text: "Processing timelines are estimates and may vary based on eligibility, documentation, and regulatory conditions.\n\nEstimasi waktu proses dapat berbeda tergantung kelayakan, kelengkapan dokumen, dan ketentuan yang berlaku."
        },
        cta: {
            title: "Apply for D12 Pre-Investment Visa",
            subtitle: "Proceed with your D12 Pre-Investment Visa application."
        }
    },
    "C11": {
        id: "C11",
        badge: "C11 BUSINESS VISA (EXHIBITION)",
        type: "Single Entry",
        intro: "Business visa for attending exhibitions, conventions, and trade shows in Indonesia. Perfect for exhibitors and business delegates.",
        description: {
            title: "What is C11 Business Visa?",
            text: "The C11 visa is a single-entry visitor visa to Indonesia, with an initial stay of up to 60 days, calculated from the date of arrival. This stay permit can be extended and converted to a Limited Stay Permit with the same guarantor. Specifically designed for business professionals attending exhibitions, conventions, and trade events."
        },
        allowed: {
            title: "What You Can Do",
            text: "Attending meetings, incentives, conventions, and exhibitions to market goods or services (exhibitor). This visa also allows you to travel and visit friends and family. You may participate in business discussions, negotiate deals, and showcase products or services at trade shows and conventions. Networking and business development activities are permitted."
        },
        sponsor: {
            title: "Sponsor Requirements",
            text: "Need a Guarantor - A local sponsor or guarantor in Indonesia is required to apply for this visa. The guarantor must be a registered Indonesian company or organization hosting or inviting you to the exhibition or convention."
        },
        period: {
            title: "Period of Stay",
            text: "You can stay in Indonesia for a maximum of 60 days, calculated from the date of arrival. You can extend this stay permit multiple times, up to a maximum of 180 days. Stay permit extensions can be processed online by your sponsor through the official immigration system."
        },
        pricing: {
            title: "Visa Fees",
            note: "Processing time starts when the payment is confirmed.",
            options: [
                {
                    title: "Standard Fee",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 1,000,000" },
                        { label: "Verification Fee", value: "Rp. 500,000" },
                        { label: "TOTAL", value: "Rp. 1,500,000", isTotal: true }
                    ]
                }
            ]
        },
        requirements: {
            title: "Submission Requirements",
            items: [
                "Valid passport (minimum 6 months validity from arrival date)",
                "Recent passport-size photo",
                "Return ticket or onward ticket to another country",
                "Proof of accommodation in Indonesia",
                "Letter of information or invitation from event organizer",
                "E-visa account at evisa.imigrasi.go.id"
            ],
            note: "Requirements may vary depending on your nationality and the specific event. Your sponsor will guide you through the complete application process."
        },
        special: {
            title: "Special Requirements",
            text: "A letter of information or invitation from a government agency or private institution as the organizer of the activity is required. This letter must detail the exhibition, convention, or business event you will be attending, including dates, venue, and your role as an exhibitor or participant."
        },
        provisions: {
            title: "Other Provisions",
            text: "Stateless foreigners and foreigners holding travel documents... The visa is valid for 90 days from the date of issuance... Foreigners with a stay permit from a C11 Visa are not permitted to receive compensation, wages, or the like from individuals or corporations in Indonesia. They are also not permitted to sell goods or services, unless required as part of the exhibition being attended."
        },
        processing: {
            title: "Processing Time & Procedure",
            text: "Order your visa, clear the payment and processing time starts. Normally 5-7 working days depending on documentation completeness. Your sponsor must first register and submit the application through the online immigration system. Once approved and payment is confirmed, you can collect your visa approval letter."
        },
        cta: {
            title: "Apply for C11 Business Visa",
            subtitle: "Ready to attend your exhibition or convention? We'll help arrange your visa and guarantor."
        }
    },
    "D2": {
        id: "D2",
        badge: "D2 Business Visit Visa (Single-Entry)",
        type: "Multiple Entry",
        intro: "The D2 Business Visit Visa is a single-entry visit permit for foreign nationals conducting non-remunerated business activities in Indonesia, such as attending meetings, business discussions, negotiations, or evaluating business opportunities.",
        description: {
            title: "What is D2 Business Visit Visa?",
            text: "The D2 Business Visit Visa is a single-entry visit permit for foreign nationals conducting non-remunerated business activities in Indonesia, such as attending meetings, business discussions, negotiations, or evaluating business opportunities.\n\nVisa Kunjungan Bisnis D2 adalah izin kunjungan satu kali masuk bagi warga negara asing untuk melakukan aktivitas bisnis tanpa bayaran di Indonesia, seperti menghadiri pertemuan, diskusi bisnis, negosiasi, atau evaluasi peluang usaha."
        },
        allowed: {
            title: "Allowed Activities / Aktivitas yang Diizinkan",
            text: "This visa does not allow employment, operational roles, or income-generating business activities in Indonesia.\n\nVisa ini tidak mengizinkan pekerjaan, peran operasional, atau aktivitas bisnis yang menghasilkan pendapatan di Indonesia."
        },
        sponsor: {
            title: "Sponsor Requirements",
            text: "Sponsor may be required depending on current regulations."
        },
        period: {
            title: "Period of Stay / Masa Tinggal",
            text: "The stay permit duration is determined by immigration approval and applicable regulations.\n\nDurasi izin tinggal ditentukan berdasarkan persetujuan imigrasi dan ketentuan yang berlaku."
        },
        pricing: {
            title: "Visa Fees / Biaya Visa",
            note: "Visa approval, permitted activities, and length of stay are determined solely by the Indonesian Immigration Authority. Processing timelines are estimates and may vary based on eligibility, documentation, and regulatory conditions.\n\nPersetujuan visa, aktivitas yang diizinkan, dan lama izin tinggal sepenuhnya ditentukan oleh otoritas Imigrasi Indonesia. Estimasi waktu proses dapat berbeda tergantung kelayakan, kelengkapan dokumen, dan ketentuan yang berlaku.",
            options: [
                {
                    title: "1 year validity",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 3,000,000" },
                        { label: "Fee", value: "Rp. 1,000,000" },
                        { label: "TOTAL", value: "Rp. 4,000,000", isTotal: true }
                    ]
                },
                {
                    title: "2 year validity",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 5,000,000" },
                        { label: "Fee", value: "Rp. 1,000,000" },
                        { label: "TOTAL", value: "Rp. 6,000,000", isTotal: true }
                    ]
                }
            ]
        },
        requirements: {
            title: "Submission Requirements",
            items: [
                "Valid passport (minimum 6 months validity)",
                "Bank statement (last 3 months, min USD 2000 or equivalent)",
                "Recent color photograph (from last year)",
                "Detailed curriculum vitae (CV)",
                "Travel plan (travel itinerary)"
            ],
            note: "All documents must be uploaded in electronic format."
        },
        special: {
            title: "Special Requirements",
            text: "Invitation letter from an Indonesian entity may be required."
        },
        provisions: {
            title: "Other Provisions",
            text: "Strictly prohibits employment relations with Indonesian companies."
        },
        processing: {
            title: "Processing Time / Waktu Pemrosesan",
            text: "Processing timelines are estimates and may vary based on eligibility, documentation, and regulatory conditions.\n\nEstimasi waktu proses dapat berbeda tergantung kelayakan, kelengkapan dokumen, dan ketentuan yang berlaku."
        },
        cta: {
            title: "Apply for D2 Business Visa",
            subtitle: "Proceed with your D2 Business Visa application."
        }
    },
    "D1": {
        id: "D1",
        badge: "D1 TOURIST VISA (MULTIPLE ENTRY)",
        type: "Multiple Entry",
        intro: "Multiple-entry tourist visa for Indonesia. Perfect for frequent travelers and tourists. Stay up to 60 days per visit. Valid for 1, 2, or 5 years.",
        description: {
            title: "What is D1 Tourist Visa?",
            text: "This visa is a multiple-entry visitor visa to Indonesia, with a maximum stay of 60 days per entry, calculated from the date of arrival. This stay permit can be extended but cannot be converted to a limited stay permit. Available in 1-year, 2-year, and 5-year validity options."
        },
        allowed: {
            title: "What You Can Do",
            text: "Sightseeing, visiting friends and family, and social activities. This visa is designed for tourists who wish to visit Indonesia multiple times within the visa validity period. You cannot conduct business activities or work with this visa."
        },
        sponsor: {
            title: "Sponsor Requirements",
            text: "No Guarantor Required - You can apply directly through evisa.imigrasi.go.id without needing a local sponsor or guarantor."
        },
        period: {
            title: "Period of Stay",
            text: "You can stay in Indonesia for a maximum of 60 days each time, calculated from the date of arrival. You can extend this stay permit multiple times, up to a maximum of 180 days per visit. Stay permit extensions can be done online by yourself through your registered account at evisa.imigrasi.go.id."
        },
        pricing: {
            title: "Visa Fees",
            note: "Processing time starts when the payment is confirmed.",
            options: [
                {
                    title: "1 year validity",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 3,000,000" },
                        { label: "Fee", value: "Rp. 1,000,000" },
                        { label: "TOTAL", value: "Rp. 4,000,000", isTotal: true }
                    ]
                },
                {
                    title: "2 year validity",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 5,000,000" },
                        { label: "Fee", value: "Rp. 1,000,000" },
                        { label: "TOTAL", value: "Rp. 6,000,000", isTotal: true }
                    ]
                },
                {
                    title: "5 year validity",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 10,000,000" },
                        { label: "Fee", value: "Rp. 1,000,000" },
                        { label: "TOTAL", value: "Rp. 11,000,000", isTotal: true }
                    ]
                }
            ]
        },
        requirements: {
            title: "Submission Requirements",
            items: [
                "Valid passport (minimum 6 months validity)",
                "Bank statement (last 3 months, min USD 2000 or equivalent)",
                "Recent color photograph (from last year)",
                "Return ticket/onward ticket",
                "E-visa account at evisa.imigrasi.go.id"
            ],
            note: "You must create an account at evisa.imigrasi.go.id before applying. All documents must be uploaded in electronic format."
        },
        special: {
            title: "Special Requirements",
            text: "No special requirements for general tourists."
        },
        provisions: {
            title: "Other Provisions",
            text: "Stateless foreigners and foreigners holding travel documents... The validity of the visa is calculated from the date of issuance... Foreigners with a residence permit from a D1 Visa are prohibited from selling goods/services or receiving compensation/wages or the like for their work/business from individuals or corporations in Indonesia."
        },
        processing: {
            title: "Processing Time & Procedure",
            text: "Register at evisa.imigrasi.go.id, complete your application online, upload required documents, and make payment. Processing typically takes 5-7 working days. You'll receive your visa approval electronically. No sponsor required - you manage everything yourself online."
        },
        cta: {
            title: "Apply for D1 Tourist Visa",
            subtitle: "Ready to explore Indonesia? Get your multiple-entry tourist visa today."
        }
    },
    // Generic entries for other popular visas to avoid 404
    "B1": {
        id: "B1",
        badge: "B1 Tourist Visa (Visa on Arrival / e-VOA)",
        type: "Single Entry",
        intro: "The B1 Tourist Visa (commonly known as Visa on Arrival or e-VOA) is a short-term visit permit issued to eligible foreign nationals for tourism, social visits, and attendance at non-remunerated meetings or events in Indonesia.",
        description: {
            title: "What is B1 Tourist Visa?",
            text: "The B1 Tourist Visa (commonly known as Visa on Arrival or e-VOA) is a short-term visit permit issued to eligible foreign nationals for tourism, social visits, and attendance at non-remunerated meetings or events in Indonesia.\n\nVisa Turis B1 (Visa on Arrival atau e-VOA) adalah izin kunjungan jangka pendek bagi warga negara asing yang memenuhi syarat, untuk tujuan pariwisata, kunjungan sosial, serta menghadiri pertemuan atau acara tanpa menerima bayaran."
        },
        allowed: {
            title: "Allowed Activities / Aktivitas yang Diizinkan",
            text: "Permitted activities include tourism, short social visits, and participation in meetings or events that do not involve employment or remuneration in Indonesia.\n\nAktivitas yang diizinkan meliputi pariwisata, kunjungan sosial singkat, serta menghadiri pertemuan atau acara yang tidak melibatkan pekerjaan atau penerimaan bayaran di Indonesia."
        },
        sponsor: {
            title: "Sponsor Statement / Pernyataan Sponsor",
            text: "No local sponsor is required for this visa category, subject to eligibility requirements.\n\nUntuk kategori visa ini tidak diperlukan sponsor lokal, sesuai dengan persyaratan kelayakan."
        },
        period: {
            title: "Period of Stay / Masa Tinggal",
            text: "The initial stay permit is valid for up to 30 days and may be extended one time in accordance with prevailing immigration regulations.\n\nMasa tinggal awal berlaku hingga 30 hari dan dapat diperpanjang satu kali sesuai ketentuan imigrasi yang berlaku."
        },
        pricing: {
            title: "Visa Fees / Biaya Visa",
            note: "Standard visa fees and service charges for B1 VOA. Processing starts upon payment confirmation.",
            options: [
                {
                    title: "Standard Processing",
                    rows: [
                        { label: "Visa Fee (e-VOA)", value: "Rp. 500,000" },
                        { label: "Verification Fee", value: "Rp. 250,000" },
                        { label: "TOTAL", value: "Rp. 750,000", isTotal: true }
                    ]
                },
                {
                    title: "Priority Support (Fast-Track)",
                    rows: [
                        { label: "Visa Fee (e-VOA)", value: "Rp. 500,000" },
                        { label: "Priority Service Fee", value: "Rp. 500,000" },
                        { label: "TOTAL", value: "Rp. 1,000,000", isTotal: true }
                    ]
                }
            ]
        },
        requirements: {
            title: "Submission Requirements",
            items: [
                "Passport valid for at least 6 months from the date of arrival",
                "Return ticket or onward ticket to another country",
                "Proof of payment (if applying online/e-VOA)",
                "Covid-19 vaccination certificate (subject to current regulations)"
            ],
            note: "Ensure your passport has at least one blank page for the visa sticker/stamp."
        },
        special: {
            title: "Special Note",
            text: "This visa is only available to citizens of countries on the official VOA eligibility list. If your country is not on the list, you must apply for a B211A / C1 Visa before traveling."
        },
        provisions: {
            title: "Other Provisions",
            text: "This visa cannot be converted into a Limited Stay Permit (KITAS). It is strictly a visitor visa. Overstaying your visa will incur a daily fine of IDR 1,000,000 per day. Extensions should be processed at least 7 days before the initial 30-day period expires."
        },
        processing: {
            title: "Processing Time / Waktu Pemrosesan",
            text: "Processing is subject to immigration review and system availability. Timelines may vary depending on applicant eligibility and submission method.\n\nProses bergantung pada peninjauan imigrasi dan ketersediaan sistem. Waktu pemrosesan dapat berbeda tergantung kelayakan pemohon dan metode pengajuan."
        },
        cta: {
            title: "Apply for B1 Visa",
            subtitle: "Proceed with your B1 Visa application."
        }
    },
    "C1": {
        id: "C1",
        badge: "C1 Visit Visa (Single-Entry Visit Visa)",
        type: "Single Entry",
        intro: "The C1 Visit Visa is a single-entry visit permit issued to eligible foreign nationals for non-commercial purposes such as social visits, family visits, and other lawful short-term activities that do not involve employment or remuneration in Indonesia.",
        description: {
            title: "What is C1 Visit Visa?",
            text: "The C1 Visit Visa is a single-entry visit permit issued to eligible foreign nationals for non-commercial purposes such as social visits, family visits, and other lawful short-term activities that do not involve employment or remuneration in Indonesia.\n\nVisa Kunjungan C1 adalah izin kunjungan satu kali masuk bagi warga negara asing yang memenuhi syarat, untuk tujuan non-komersial seperti kunjungan sosial, kunjungan keluarga, dan aktivitas jangka pendek lainnya yang sah tanpa melibatkan pekerjaan atau penerimaan bayaran di Indonesia."
        },
        allowed: {
            title: "Allowed Activities / Aktivitas yang Diizinkan",
            text: "Allowed: social visit, family visit, non-commercial activities\nNot allowed: employment, paid activity, business operations\n\nDiizinkan: kunjungan sosial, keluarga, aktivitas non-komersial\nDilarang: bekerja, menerima bayaran, aktivitas usaha"
        },
        sponsor: {
            title: "Sponsor Requirements",
            text: "No Guarantor Required - With the new E-Visa system, you can apply for the C1 visa directly without a local sponsor for tourism purposes, provided you have proof of funds."
        },
        period: {
            title: "Period of Stay / Masa Tinggal",
            text: "The initial stay permit is valid for up to 60 days and may be extended in accordance with prevailing immigration regulations.\n\nMasa tinggal awal berlaku hingga 60 hari dan dapat diperpanjang sesuai ketentuan imigrasi yang berlaku."
        },
        pricing: {
            title: "Visa Fees / Biaya Visa",
            note: "Select the processing speed that fits your travel plan.",
            options: [
                {
                    title: "Standard (7-10 Days)",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 700,000" },
                        { label: "Service Fee", value: "Rp. 1,000,000" },
                        { label: "TOTAL", value: "Rp. 1,700,000", isTotal: true }
                    ]
                },
                {
                    title: "Express (3-5 Days)",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 700,000" },
                        { label: "Express Fee", value: "Rp. 2,500,000" },
                        { label: "TOTAL", value: "Rp. 3,200,000", isTotal: true }
                    ]
                },
                {
                    title: "VIP (48 Hours)",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 700,000" },
                        { label: "VIP Service Fee", value: "Rp. 5,000,000" },
                        { label: "TOTAL", value: "Rp. 5,700,000", isTotal: true }
                    ]
                }
            ]
        },
        requirements: {
            title: "Submission Requirements",
            items: [
                "Passport valid for at least 6 months",
                "Recent color photograph (passport size)",
                "Proof of funds (Bank statement showing min. USD $2,000)",
                "Return ticket or onward ticket",
                "Travel itinerary or proof of accommodation"
            ],
            note: "All documents must be clear color scans."
        },
        special: {
            title: "Offshore vs. Onshore",
            text: "This visa can be applied for 'Offshore' (while you are outside Indonesia) to enter the country, or 'Onshore' (while you are already in Indonesia) to extend your stay without leaving."
        },
        provisions: {
            title: "Other Provisions",
            text: "This is a single-entry visa; if you leave Indonesia, the visa becomes invalid. You are prohibited from working or receiving a salary from Indonesian sources."
        },
        processing: {
            title: "Processing Time / Waktu Pemrosesan",
            text: "Processing timelines are estimates and may vary based on eligibility, documentation, and regulatory conditions.\n\nEstimasi waktu proses dapat berbeda tergantung kelayakan, kelengkapan dokumen, dan ketentuan yang berlaku."
        },
        cta: {
            title: "Apply for C1 Visit Visa",
            subtitle: "Proceed with your C1 Visit Visa application."
        }
    },
    "C2": {
        id: "C2",
        badge: "C2 Business Visa (Single-Entry Business Visit Visa)",
        type: "Single Entry",
        intro: "The C2 Business Visa is a single-entry visit permit for foreign nationals conducting non-remunerated business activities in Indonesia, such as attending meetings, discussions, negotiations, or market exploration.",
        description: {
            title: "What is C2 Business Visa?",
            text: "The C2 Business Visa is a single-entry visit permit for foreign nationals conducting non-remunerated business activities in Indonesia, such as attending meetings, discussions, negotiations, or market exploration.\n\nVisa Bisnis C2 adalah izin kunjungan satu kali masuk bagi warga negara asing untuk melakukan aktivitas bisnis tanpa bayaran di Indonesia, seperti menghadiri pertemuan, diskusi, negosiasi, atau eksplorasi pasar."
        },
        allowed: {
            title: "Allowed Activities / Aktivitas yang Diizinkan",
            text: "This visa does not permit employment, operational roles, or income-generating activities in Indonesia.\n\nVisa ini tidak mengizinkan pekerjaan, peran operasional, atau aktivitas yang menghasilkan pendapatan di Indonesia."
        },
        sponsor: {
            title: "Sponsor Requirements",
            text: "Guarantor Required - You typically need an Indonesian company to act as your sponsor/guarantor."
        },
        period: {
            title: "Period of Stay / Masa Tinggal",
            text: "The stay permit is valid for up to 60 days.\n\nIzin tinggal berlaku hingga 60 hari."
        },
        pricing: {
            title: "Visa Fees / Biaya Visa",
            note: "Service and government fees for C2 Business Visa.",
            options: [
                {
                    title: "Standard Processing",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 1,500,000" },
                        { label: "Service Fee", value: "Rp. 1,000,000" },
                        { label: "TOTAL", value: "Rp. 2,500,000", isTotal: true }
                    ]
                },
                {
                    title: "Priority Processing",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 1,500,000" },
                        { label: "Priority Service Fee", value: "Rp. 2,500,000" },
                        { label: "TOTAL", value: "Rp. 4,000,000", isTotal: true }
                    ]
                }
            ]
        },
        requirements: {
            title: "Submission Requirements",
            items: [
                "Passport valid for at least 6 months",
                "Sponsorship letter from Indonesian company",
                "Invitation letter from Indonesian company",
                "Copy of company's business license (NIB/SIUP)",
                "Applicant's bank statement (min. USD $2,000)",
                "Return ticket"
            ],
            note: "The sponsor company must be registered in the Immigration system."
        },
        special: {
            title: "Business vs. Work Visa",
            text: "It is crucial to distinguish between C2 (Business Visitor) and a Work Visa (KITAS E23/etc). C2 allows usually short-term, non-income generating business activities. If you will be working hands-on or receiving a salary in Indonesia, you need a Work KITAS."
        },
        provisions: {
            title: "Other Provisions",
            text: "Strictly prohibits employment relations with Indonesian companies. Violation of visa terms can lead to deportation and blacklisting."
        },
        processing: {
            title: "Processing Time / Waktu Pemrosesan",
            text: "Processing timelines are estimates and may vary based on eligibility, documentation, and regulatory conditions.\n\nEstimasi waktu proses dapat berbeda tergantung kelayakan, kelengkapan dokumen, dan ketentuan yang berlaku."
        },
        cta: {
            title: "Apply for C2 Business Visa",
            subtitle: "Proceed with your C2 Business Visa application."
        }
    },
    "C12": {
        id: "C12",
        badge: "C12 Pre-Investment Visa",
        type: "Single Entry",
        intro: "The C12 Pre-Investment Visa is a visit visa intended for foreign nationals who plan to explore investment opportunities in Indonesia, including business feasibility assessment, preliminary discussions, and preparatory activities prior to formal company establishment or investment.",
        description: {
            title: "What is C12 Pre-Investment Visa?",
            text: "The C12 Pre-Investment Visa is a visit visa intended for foreign nationals who plan to explore investment opportunities in Indonesia, including business feasibility assessment, preliminary discussions, and preparatory activities prior to formal company establishment or investment.\n\nVisa Pra-Investasi C12 adalah visa kunjungan bagi warga negara asing yang berencana menjajaki peluang investasi di Indonesia, termasuk studi kelayakan bisnis, diskusi awal, dan aktivitas persiapan sebelum pendirian perusahaan atau realisasi investasi."
        },
        allowed: {
            title: "Allowed Activities / Aktivitas yang Diizinkan",
            text: "This visa does not grant the right to work, manage daily operations, or engage in revenue-generating activities.\n\nVisa ini tidak memberikan hak untuk bekerja, mengelola operasional harian, atau melakukan aktivitas yang menghasilkan pendapatan."
        },
        sponsor: {
            title: "Sponsor Requirements",
            text: "No Sponsor Required - This is the key advantage of the C12 visa. You can apply independently using your proof of funds."
        },
        period: {
            title: "Period of Stay / Masa Tinggal",
            text: "The stay period follows the duration approved by immigration authorities and is subject to applicable regulations.\n\nMasa tinggal mengikuti durasi yang disetujui oleh otoritas imigrasi dan tunduk pada regulasi yang berlaku."
        },
        pricing: {
            title: "Visa Fees / Biaya Visa",
            note: "Standard processing fees for C12 Pre-Investment Visa.",
            options: [
                {
                    title: "60 Days Stay",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 0" },
                        { label: "Service Fee", value: "Rp. 2,500,000" },
                        { label: "TOTAL", value: "Rp. 2,500,000", isTotal: true }
                    ]
                },
                {
                    title: "180 Days Stay",
                    rows: [
                        { label: "Visa Fee", value: "Rp. 0" },
                        { label: "Service Fee", value: "Rp. 5,000,000" },
                        { label: "TOTAL", value: "Rp. 5,000,000", isTotal: true }
                    ]
                }
            ]
        },
        requirements: {
            title: "Submission Requirements",
            items: [
                "Passport valid for at least 6 months (12 months recommended)",
                "Proof of funds (Bank statement min. USD $5,000)",
                "Proposal or statement of intent for investment/pre-investment activities",
                "Recent color photograph",
                "Health insurance (recommended)"
            ],
            note: "The bank statement requirement (USD 5,000) is higher than tourist visas to demonstrate financial capability for investment purposes."
        },
        special: {
            title: "Pathway to KITAS",
            text: "This visa is excellent for the 'setup phase'. Once you have established your company (PT PMA), you can then proceed to apply for an Investor KITAS (E28A) for long-term residency."
        },
        provisions: {
            title: "Other Provisions",
            text: "Single entry only. Prohibited from engaging in manual labor or retail trade. Designed specifically for the preparation of investment activities."
        },
        processing: {
            title: "Processing Time / Waktu Pemrosesan",
            text: "Processing timelines are estimates and may vary based on eligibility, documentation, and regulatory conditions.\n\nEstimasi waktu proses dapat berbeda tergantung kelayakan, kelengkapan dokumen, dan ketentuan yang berlaku."
        },
        cta: {
            title: "Apply for C12 Pre-Investment Visa",
            subtitle: "Proceed with your C12 Pre-Investment Visa application."
        }
    }
};
