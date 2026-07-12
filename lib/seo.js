import { COMPANY } from './constants';

export const SITE_NAME = COMPANY.name;
export const SITE_URL = COMPANY.domain.replace(/\/$/, '');
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`;

export function pageMetadata({ title, description, path = '/', keywords = [], noIndex = false }) {
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { type: 'website', locale: 'en_IN', url: canonical, siteName: SITE_NAME, title, description, images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${title} — ${SITE_NAME}` }] },
    twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_OG_IMAGE] },
  };
}

export function breadcrumbSchema(items) {
  return { '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:items.map((item,index)=>({ '@type':'ListItem', position:index+1, name:item.name, item:`${SITE_URL}${item.path}` })) };
}

export function faqSchema(items) {
  return { '@context':'https://schema.org', '@type':'FAQPage', mainEntity:items.map(([question,answer])=>({ '@type':'Question', name:question, acceptedAnswer:{ '@type':'Answer', text:answer } })) };
}

export function serviceSchema({ name, description, path, areaServed = ['Vellore','Tamil Nadu'] }) {
  return { '@context':'https://schema.org', '@type':'Service', name, description, url:`${SITE_URL}${path}`, provider:{ '@id':`${SITE_URL}/#business` }, areaServed:areaServed.map((name)=>({ '@type':'AdministrativeArea', name })) };
}
