import prisma from '@/lib/prisma';

/**
 * Authority Control Layer
 * Manages author entities for E-E-A-T signals.
 */
export const AUTHORITY_CONTROL = {
  /**
   * Gets the default research team author or creates it if missing.
   */
  async getDefaultAuthor() {
    let author = await (prisma as any).knowledgeAuthor.findFirst({
      where: { name: 'Indonesian Visas Research Team' }
    });

    if (!author) {
      author = await (prisma as any).knowledgeAuthor.create({
        data: {
          name: 'Indonesian Visas Research Team',
          title: 'Immigration Research Unit',
          organization: 'PT Indonesian Visas Agency',
          bio: 'Leading experts in Indonesian immigration law and visa procedural transitions.',
          website: 'https://indonesianvisas.com'
        }
      });
    }

    return author;
  }
};

/**
 * Source Reference System
 * Manages official government and news sources for authority verification.
 */
export const SOURCE_REGISTRY = {
  /**
   * Seeds official government sources.
   */
  async seedSourceRegistry() {
    const sources = [
      {
        name: 'Directorate General of Immigration Indonesia',
        url: 'https://www.imigrasi.go.id',
        sourceType: 'government',
        authorityLevel: 'official_government'
      },
      {
        name: 'Indonesian Ministry of Law and Human Rights',
        url: 'https://www.kemenkumham.go.id',
        sourceType: 'government',
        authorityLevel: 'official_government'
      },
      {
        name: 'Indonesia Immigration Portal (Molina)',
        url: 'https://molina.imigrasi.go.id',
        sourceType: 'government',
        authorityLevel: 'official_government'
      }
    ];

    for (const s of sources) {
      await (prisma as any).immigrationSource.upsert({
        where: { url: s.url },
        update: s,
        create: s
      });
    }
  },

  /**
   * Retrieves high-authority sources for a specific category.
   */
  async getOfficialSources() {
    return await (prisma as any).immigrationSource.findMany({
      where: { authorityLevel: 'official_government' }
    });
  }
};
