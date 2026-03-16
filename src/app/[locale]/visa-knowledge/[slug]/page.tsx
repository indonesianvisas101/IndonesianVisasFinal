import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ShieldCheck, Info, FileText, HelpCircle, CheckCircle2 } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug } = await params;
  const db = prisma as any;
  const page = await db['knowledgePage'].findUnique({
    where: { slug }
  });

  if (!page) return {};

  const meta = page.metadata as any;
  const schema = meta?.schema;

  return {
    title: page.title,
    description: meta?.description || page.title,
    openGraph: {
      title: page.title,
      description: meta?.description || page.title,
      type: 'article',
    },
    // Schema.org structured data injection
    other: {
      'script:ld+json:article': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": page.title,
        "description": meta?.description,
        "datePublished": page.createdAt,
        "dateModified": page.updatedAt,
        "author": {
          "@type": "Organization",
          "name": "Indonesian Visas AI Organization"
        }
      }),
      ...(schema?.faq ? {
        'script:ld+json:faq': JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": schema.faq.map((item: any) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        })
      } : {})
    }
  };
}

export default async function KnowledgePage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const db = prisma as any;
  const page = await db['knowledgePage'].findUnique({
    where: { slug }
  });

  if (!page || !page.published) {
    notFound();
  }

  const sections = page.content as any[];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 pt-20">
      {/* 1. Hero / Title Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-4 mb-12">
           <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
             Official Knowledge Hub
           </span>
           <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
             {page.title}
           </h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium">
             Last Updated: {new Date(page.updatedAt).toLocaleDateString()} | Author: AI Immigration Analyst
           </p>
        </div>

        {/* 2. Structured Sections */}
        <div className="space-y-16">
          {sections.map((section, idx) => {
            if (section.type === 'disclaimer') {
              return (
                <section key={idx} className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-8 rounded-2xl">
                  <div className="flex gap-4">
                    <ShieldCheck className="w-8 h-8 text-red-600 shrink-0" />
                    <div>
                      <h2 className="text-xl font-bold text-red-900 dark:text-white mb-2">{section.title}</h2>
                      <div className="text-red-800 dark:text-red-200 leading-relaxed font-medium prose dark:prose-invert max-w-none">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </section>
              );
            }

            if (section.type === 'faq') {
              return (
                <section key={idx} className="space-y-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <HelpCircle className="w-8 h-8 text-primary" /> {section.title}
                  </h2>
                  <div className="grid gap-4">
                    {(section.content as any[]).map((item: any, qIdx: number) => (
                      <div key={qIdx} className="p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{item.question}</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            return (
              <section key={idx} className="space-y-6">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 lowercase">
                  <span className="text-primary opacity-30">#</span> {section.title}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed text-slate-700 dark:text-slate-300">
                  {section.type === 'list' && Array.isArray(section.content) ? (
                    <ul className="grid gap-3 list-none p-0">
                      {section.content.map((item: any, lIdx: number) => (
                        <li key={lIdx} className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: section.content as string }} />
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* 3. Global Call to Action */}
        <div className="mt-24 p-12 bg-primary rounded-[3rem] text-center text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-125 duration-700" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-black">Need Expert Assistance?</h2>
            <p className="text-xl text-primary-foreground/90 max-w-xl mx-auto font-medium">
              Don't navigate Indonesian immigration alone. Our team of experts is ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <a href={`/${locale}/apply`} className="px-10 py-4 bg-white text-primary rounded-full font-black text-lg hover:scale-105 transition-transform">
                 Apply Now
               </a>
               <a href={`/${locale}/services`} className="px-10 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-black text-lg hover:bg-white/10 transition-colors">
                 View Services
               </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
