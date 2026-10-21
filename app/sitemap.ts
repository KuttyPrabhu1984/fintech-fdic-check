import type { MetadataRoute } from 'next';
import { apps, guides } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/guides/`, changeFrequency: 'monthly', priority: 0.5 },
    ...apps.map((a) => ({ url: `${SITE_URL}/apps/${a.slug}/`, lastModified: a.lastVerified, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...guides.map((g) => ({ url: `${SITE_URL}/guides/${g.slug}/`, lastModified: g.lastVerified, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
