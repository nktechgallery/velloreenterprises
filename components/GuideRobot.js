'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const guides = {
  '/': [
    { text:'Do you want to try our products?', label:'Explore products', href:'/products' },
    { text:'See the fire-safety solutions available for different facilities.', label:'View product range', selector:'.product-media' },
    { text:'Need scheduled maintenance? Compare the available AMC options.', label:'View AMC plans', href:'/amc' },
  ],
  '/products': [
    { text:'Search by product name, code, purpose, or equipment category.', label:'Try search', selector:'input[placeholder*="Search products"]' },
    { text:'Use categories to narrow the catalog to the equipment you need.', label:'View filters', selector:'aside' },
    { text:'Open a product for specifications, compliance details, and related equipment.', label:'View first product', selector:'.catalog-product-card a' },
    { text:'Add products to your inquiry cart to prepare a quotation.', label:'Find Add to cart', selector:'.catalog-card-actions .btn-primary' },
  ],
  '/amc': [
    { text:'Compare maintenance plans for your facility and fire-protection systems.', label:'View plans', selector:'.card-premium' },
    { text:'Tell us about your site to receive a tailored AMC scope.', label:'Open AMC form', selector:'#amc-form' },
  ],
  '/contact': [
    { text:'Choose a quick contact method or send your requirements to our specialists.', label:'Contact the team', selector:'form' },
    { text:'Find our Vellore office and get driving directions.', label:'View map', selector:'iframe[title*="map"]' },
  ],
  '/about': [
    { text:'Learn about our experience, service approach, and industries served.', label:'Our capabilities', selector:'.section-shell' },
    { text:'Ready to discuss a site? Contact our fire-safety team.', label:'Get consultation', href:'/contact' },
  ],
  '/fire-safety-guide': [
    { text:'Start with the extinguisher comparison for a quick overview.', label:'Compare types', selector:'#extinguishers' },
    { text:'Review direct answers to common fire-safety questions.', label:'Read FAQs', selector:'#faq' },
  ],
  '/locations/vellore': [
    { text:'See the services available across Vellore and nearby areas.', label:'View coverage', selector:'.knowledge-content section' },
    { text:'Use the map for our office location and directions.', label:'Open map', selector:'.location-map' },
  ],
};

function RobotIcon() {
  return <svg className="guide-robot-svg" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8v7"/><circle cx="32" cy="6" r="3"/><rect x="12" y="16" width="40" height="32" rx="13"/><circle cx="25" cy="31" r="4"/><circle cx="39" cy="31" r="4"/><path d="M24 40c5 3 11 3 16 0M12 28H7v11h6M52 28h5v11h-6M23 49v8M41 49v8"/></svg>;
}

export default function GuideRobot() {
  const pathname = usePathname();
  const router = useRouter();
  const [open,setOpen] = useState(true);
  const [step,setStep] = useState(0);
  const [scrolled,setScrolled] = useState(false);
  const routeKey = useMemo(() => pathname.startsWith('/products/') ? '/products' : pathname, [pathname]);
  const steps = guides[routeKey] || [{ text:'Do you want to try our products?', label:'Explore products', href:'/products' }];
  const current = steps[Math.min(step,steps.length-1)];

  useEffect(() => { setStep(0); setOpen(true); }, [pathname]);
  useEffect(() => { const update=()=>setScrolled(window.scrollY>120); update(); window.addEventListener('scroll',update,{passive:true}); return()=>window.removeEventListener('scroll',update); },[]);
  useEffect(() => { const visible=()=>{ if(document.visibilityState==='visible') setOpen(true); }; document.addEventListener('visibilitychange',visible); return()=>document.removeEventListener('visibilitychange',visible); },[]);

  const act = () => {
    if(current.href){router.push(current.href);return;}
    const element=document.querySelector(current.selector);
    if(!element)return;
    element.scrollIntoView({behavior:'smooth',block:'center'});
    element.classList.add('guide-target-highlight');
    const focusable=element.matches('button,a,input,select,textarea')?element:element.querySelector('button,a,input,select,textarea');
    window.setTimeout(()=>focusable?.focus({preventScroll:true}),450);
    window.setTimeout(()=>element.classList.remove('guide-target-highlight'),2400);
  };
  const next = () => setStep((value)=>(value+1)%steps.length);

  return <aside className={`guide-robot-root ${open?'is-open':'is-minimized'} ${scrolled?'is-scrolled':''}`} aria-label="Interactive website guide">
    {open && <div className="guide-robot-dialog" role="status" aria-live="polite">
      <div className="guide-dialog-top"><span>VE GUIDE</span><button onClick={()=>setOpen(false)} aria-label="Minimize website guide">×</button></div>
      <p>{current.text}</p>
      <div className="guide-dialog-actions"><button className="guide-primary-action" onClick={act}>{current.label}</button><button onClick={next}>Next <span aria-hidden="true">→</span></button></div>
      <div className="guide-progress" aria-label={`Guide step ${step+1} of ${steps.length}`}>{steps.map((_,index)=><span key={index} className={index===step?'active':''}/>)}</div>
    </div>}
    <button className="guide-robot-button" onClick={()=>setOpen((value)=>!value)} aria-expanded={open} aria-label={open?'Minimize website guide':'Open website guide'}><RobotIcon/><span className="guide-online-dot"/></button>
  </aside>;
}
