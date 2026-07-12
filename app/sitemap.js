import { COMPANY } from '@/lib/constants';
import { productSlug } from '@/lib/constants';

export const revalidate = 3600;

async function productRoutes() {
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!project || !key) return [];
  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/products?pageSize=500&key=${key}`, { next:{ revalidate:3600 } });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.documents || []).map((document) => {
      const fields=document.fields || {}; const id=document.name?.split('/').pop();
      const product={ id, slug:fields.slug?.stringValue, name:fields.name?.stringValue, code:fields.code?.stringValue };
      return { url:`${COMPANY.domain}/products/${productSlug(product)}`, lastModified:document.updateTime || new Date().toISOString(), changeFrequency:'weekly', priority:.7, images:fields.image?.stringValue ? [fields.image.stringValue] : undefined };
    });
  } catch { return []; }
}

export default async function sitemap() {
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/products',
    '/amc',
    '/fire-safety-guide',
    '/locations/vellore',
  ].map((route) => ({
    url: `${COMPANY.domain}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/products' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
  return [...staticRoutes, ...(await productRoutes())];
}
