import { COMPANY } from '@/lib/constants';

export default async function sitemap() {
  return [
    '',
    '/about',
    '/contact',
    '/products',
    '/amc',
  ].map((route) => ({
    url: `${COMPANY.domain}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/products' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
