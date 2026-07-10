import { COMPANY } from '@/lib/constants';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/velloreadmin'],
    },
    sitemap: `${COMPANY.domain}/sitemap.xml`,
  };
}
