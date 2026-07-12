import Link from 'next/link';
export const metadata={title:'Offline',robots:{index:false,follow:false}};
export default function OfflinePage(){return <main className="section-shell"><div className="container-narrow glass-panel p-8 text-center"><p className="eyebrow">Connection unavailable</p><h1 className="heading-md">You are currently offline.</h1><p className="section-copy mt-4">Previously visited pages may remain available. Reconnect to load live products, send forms, or continue support chat.</p><Link href="/" className="btn btn-primary mt-7">Try homepage</Link></div></main>;}
