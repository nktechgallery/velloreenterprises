import { pageMetadata } from '@/lib/seo';
function readable(slug='fire-safety-product'){ return slug.split('-').map((word)=>word.charAt(0).toUpperCase()+word.slice(1)).join(' '); }
export function generateMetadata({params}) { const name=readable(params.slug); return pageMetadata({ title:`${name} — Specifications & Quotation`, description:`View specifications, compliance information, availability, related equipment, and request a quotation for ${name} from Vellore Enterprises.`, path:`/products/${params.slug}`, keywords:[name,`${name} Vellore`,'fire safety equipment quotation'] }); }
export default function ProductLayout({children}){return children;}
