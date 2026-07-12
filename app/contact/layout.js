import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
export const metadata=pageMetadata({title:'Contact a Fire Safety Specialist in Vellore',description:'Contact Vellore Enterprises for fire equipment, site surveys, installation, AMC quotations, and emergency product support in Vellore, Tamil Nadu.',path:'/contact',keywords:['fire safety contact Vellore','fire equipment quotation','Vellore Enterprises phone']});
export default function ContactLayout({children}){return <><JsonLd data={breadcrumbSchema([{name:'Home',path:'/'},{name:'Contact',path:'/contact'}])}/>{children}</>;}
