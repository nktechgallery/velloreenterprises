import { COMPANY } from '@/lib/constants';
export const revalidate=3600;
function escape(value=''){return value.replace(/[<>&'\"]/g,(char)=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[char]));}
export async function GET(){
  const project=process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;const key=process.env.NEXT_PUBLIC_FIREBASE_API_KEY;let images=[];
  try{if(project&&key){const response=await fetch(`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/products?pageSize=500&key=${key}`,{next:{revalidate:3600}});const data=response.ok?await response.json():{};images=(data.documents||[]).map((document)=>{const f=document.fields||{};return{url:f.image?.stringValue,title:f.name?.stringValue||'Fire safety product'}}).filter((item)=>item.url);}}catch{}
  const body=images.map((item)=>`<url><loc>${COMPANY.domain}/products</loc><image:image><image:loc>${escape(item.url)}</image:loc><image:title>${escape(item.title)}</image:title></image:image></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${body}</urlset>`,{headers:{'Content-Type':'application/xml','Cache-Control':'public, s-maxage=3600, stale-while-revalidate=86400'}});
}
