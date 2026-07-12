'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export function trackEvent(name, parameters = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event:name, ...parameters });
  window.gtag?.('event', name, parameters);
}

export default function SiteAnalytics() {
  const [consented,setConsented]=useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  useEffect(()=>{const update=()=>setConsented(localStorage.getItem('ve-cookie-consent')==='accepted');update();window.addEventListener('ve-consent-updated',update);return()=>window.removeEventListener('ve-consent-updated',update);},[]);
  useEffect(() => {
    const click = (event) => {
      const link = event.target.closest?.('a,button'); if (!link) return;
      const href = link.getAttribute('href') || '';
      if (href.startsWith('tel:')) trackEvent('phone_click',{ href });
      else if (href.includes('wa.me')) trackEvent('whatsapp_click',{ href });
      else if (href.includes('/products/')) trackEvent('product_click',{ href });
      else if (link.matches('.btn,.nav-consultation')) trackEvent('cta_click',{ label:link.textContent?.trim(), href });
    };
    document.addEventListener('click',click); return()=>document.removeEventListener('click',click);
  },[]);
  return <>
    {consented && gaId && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive"/><Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script></>}
    {consented && gtmId && <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=1;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${gtmId}');`}</Script>}
    {consented && clarityId && <Script id="clarity" strategy="lazyOnload">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script','${clarityId}');`}</Script>}
  </>;
}
