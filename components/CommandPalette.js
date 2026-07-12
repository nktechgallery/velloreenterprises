'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { useFirestoreProducts } from '@/hooks/useFirestoreProducts';
import { PRODUCT_CATEGORIES, productSlug } from '@/lib/constants';

const pages = [
  { title:'Home', href:'/', type:'page', code:'HM', terms:'company overview fire safety solutions' },
  { title:'Products', href:'/products', type:'page', code:'PR', terms:'equipment catalog buy fire safety' },
  { title:'AMC Services', href:'/amc', type:'page', code:'AM', terms:'annual maintenance service refill inspection contract' },
  { title:'About Us', href:'/about', type:'page', code:'AB', terms:'company story experience certification' },
  { title:'Contact', href:'/contact', type:'page', code:'CT', terms:'support phone address quotation consultation' },
];
const groups = [['fire','flame','safety','protection','emergency'],['extinguisher','cylinder','abc','co2','foam','suppression'],['alarm','detector','smoke','sensor','warning'],['amc','maintenance','service','repair','refill','inspection'],['quote','quotation','price','cost','buy','purchase','inquiry'],['office','commercial','company','workplace','business'],['factory','industrial','warehouse','plant']];
function expand(value) { const words=value.toLowerCase().split(/\s+/).filter(Boolean); const result=new Set(words); groups.forEach((group)=>{if(group.some((word)=>words.includes(word)))group.forEach((word)=>result.add(word));}); return [...result].join(' '); }

export default function CommandPalette() {
  const [open,setOpen]=useState(false); const [query,setQuery]=useState(''); const [active,setActive]=useState(0);
  const inputRef=useRef(null); const router=useRouter(); const { products }=useFirestoreProducts();
  useEffect(()=>{ const key=(event)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setOpen(true);}if(event.key==='Escape')setOpen(false);}; window.addEventListener('keydown',key); return()=>window.removeEventListener('keydown',key);},[]);
  useEffect(()=>{if(open){setQuery('');setActive(0);requestAnimationFrame(()=>inputRef.current?.focus());}},[open]);
  const data=useMemo(()=>[
    ...pages.map((item)=>({...item,subtitle:item.href,searchTerms:`${item.title} ${item.terms}`})),
    ...PRODUCT_CATEGORIES.map((title)=>({title,href:`/products?category=${encodeURIComponent(title)}`,type:'category',code:'CAT',subtitle:'Product category',searchTerms:`${title} fire equipment`})),
    ...products.map((product)=>({title:product.name,href:`/products/${productSlug(product)}`,type:'product',code:'EQ',subtitle:product.category||'Equipment',searchTerms:`${product.name} ${product.code||''} ${product.category||''} ${product.description||''}`})),
  ],[products]);
  const fuse=useMemo(()=>new Fuse(data,{keys:['title',{name:'searchTerms',weight:.7}],threshold:.48,distance:180,ignoreLocation:true}),[data]);
  const results=useMemo(()=>query.trim()?fuse.search(expand(query)).slice(0,9).map((result)=>result.item):pages,[query,fuse]);
  const navigate=(href)=>{setOpen(false);router.push(href);};
  const onKeyDown=(event)=>{if(event.key==='ArrowDown'){event.preventDefault();setActive((value)=>Math.min(value+1,results.length-1));}if(event.key==='ArrowUp'){event.preventDefault();setActive((value)=>Math.max(value-1,0));}if(event.key==='Enter'&&results[active])navigate(results[active].href);};
  useEffect(()=>setActive(0),[query]);
  if(!open)return null;
  return <div className="command-overlay" role="dialog" aria-modal="true" aria-label="Semantic search" onMouseDown={(event)=>{if(event.target===event.currentTarget)setOpen(false);}}>
    <div className="command-panel semantic-search-panel">
      <div className="semantic-search-input"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg><input ref={inputRef} value={query} onChange={(event)=>setQuery(event.target.value)} onKeyDown={onKeyDown} placeholder="Search by product, purpose, site, or requirement…" aria-label="Semantic search query"/><kbd>ESC</kbd></div>
      <div className="command-results" role="listbox">
        <p className="semantic-result-label">{query ? 'Semantic results' : 'Quick navigation'}</p>
        {results.length===0?<div className="semantic-empty"><span>VE</span><strong>No close matches</strong><p>Try a purpose such as “office smoke warning” or “annual extinguisher service”.</p></div>:results.map((item,index)=><button key={`${item.type}-${item.href}`} className={`command-item ${active===index?'command-item-active':''}`} onClick={()=>navigate(item.href)} role="option" aria-selected={active===index}><span className="command-item-icon">{item.code}</span><span className="semantic-result-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span><em>{item.type}</em></button>)}
      </div>
      <footer className="command-footer"><span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span></footer>
    </div>
  </div>;
}
