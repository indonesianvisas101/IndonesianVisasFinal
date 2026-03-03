import React from "react";
import VisaCatalog from "@/components/visa/VisaCatalog";

import PageWrapper from "@/components/layout/PageWrapper";
import SectionWrapper from "@/components/layout/SectionWrapper";

export default function ApplyPage() {
    return (
        <PageWrapper className="transition-colors duration-300">
            {/* Main Hero / Catalog Section */}
            <SectionWrapper id="apply-intro" className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

                <div className="text-center mb-16 pt-8">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20 backdrop-blur-sm">
                        Visa Services
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
                        Apply For A Visa
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Choose from our most valid visa options. Real-time processing, secure payment, and 99% approval rate.
                    </p>
                </div>

                {/* Catalog handles listing popular visas first */}
                <VisaCatalog />
            </SectionWrapper>

            <SectionWrapper id="custom-solution" fullWidth noBottomMargin className="relative py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-[2rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
                        {/* Gradient Accents */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white">
                                Need a Custom Visa Solution?
                            </h2>
                            <p className="mb-10 text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                                If you don't see what you're looking for, or need a complex KITAS arrangement, our specialists are here to help.
                            </p>

                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-slate-900 transition-all duration-200 bg-white rounded-xl hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-slate-900"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        </PageWrapper>
    );
}
