import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title:'Fire Safety Products & Equipment in Vellore', description:'Browse BIS-aligned fire extinguishers, alarms, hydrant equipment, suppression systems, fire-stop products, and safety gear supplied across Vellore and Tamil Nadu.', path:'/products', keywords:['fire safety products Vellore','fire extinguisher price Vellore','fire alarm supplier Tamil Nadu','BIS fire equipment'] });
export default function ProductsLayout({children}) { return <><JsonLd data={breadcrumbSchema([{name:'Home',path:'/'},{name:'Products',path:'/products'}])}/>{children}</>; }
