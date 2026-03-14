import { SeoPageData } from './types';

import { trustData } from './trust';
import { expatguidesData } from './expatguides';
import { businessindonesiaData } from './businessindonesia';
import { visaprocessData } from './visaprocess';
import { immigrationsystemData } from './immigrationsystem';

const allData: Record<string, SeoPageData> = {
    ...trustData,
    ...expatguidesData,
    ...businessindonesiaData,
    ...visaprocessData,
    ...immigrationsystemData
};

export const seoPageSlugs = Object.keys(allData);

export const getSeoPageData = (slug: string): SeoPageData => {
    return allData[slug] || {
        slug,
        title: 'Not Found',
        description: 'Page not found.',
        sections: [],
        updatedAt: new Date().toISOString()
    };
};
