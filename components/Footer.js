import Link from 'next/link';
import { COMPANY, PRODUCT_CATEGORIES, SERVICES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-[#050505] pt-16 lg:pt-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(201,162,39,0.08),transparent_60%)] pointer-events-none" />
      
      <div className="container-wide relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] pb-16 border-b border-white/10">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="flex items-center gap-3">
                <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#f5d76e] to-[#8b6914] text-black">
                  <span className="font-condensed text-xs font-black tracking-wider">VE</span>
                </span>
                <span className="leading-none">
                  <span className="block font-condensed text-base font-black tracking-[0.18em] text-white">VELLORE</span>
                  <span className="block font-condensed text-[9px] font-semibold tracking-[0.34em] text-[#f5d76e]">ENTERPRISES</span>
                </span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              Premium fire safety partner providing certified equipment, installation, and complete AMC lifecycle support for facilities across Tamil Nadu.
            </p>
            <div className="flex gap-3 pt-2">
              <div className="badge badge-gold">BIS Certified</div>
              <div className="badge badge-gold">ISO 9001:2015</div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {COMPANY.instagram && (
                <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 hover:text-[#f5d76e] hover:border-[#c9a227]/40 transition" aria-label="Follow on Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-condensed font-bold uppercase tracking-widest text-[#f5d76e] text-sm mb-6">Equipment</h3>
            <ul className="space-y-3">
              {PRODUCT_CATEGORIES.slice(0, 5).map(cat => (
                <li key={cat}>
                  <Link href={`/products?category=${encodeURIComponent(cat)}`} className="text-sm text-white/55 hover:text-white transition">
                    {cat}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="text-sm font-bold text-[#f5d76e] hover:text-white transition">
                  View all products →
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-condensed font-bold uppercase tracking-widest text-[#f5d76e] text-sm mb-6">Solutions</h3>
            <ul className="space-y-3">
              {SERVICES.map(service => (
                <li key={service}>
                  <span className="text-sm text-white/55">{service}</span>
                </li>
              ))}
              <li>
                <Link href="/amc" className="text-sm text-white/55 hover:text-white transition">AMC Contracts</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-condensed font-bold uppercase tracking-widest text-[#f5d76e] text-sm mb-6">Reach Us</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-white/55">
                <svg className="w-5 h-5 text-[#c9a227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{COMPANY.addressLine}, {COMPANY.cityLine}, {COMPANY.state} - 632006</span>
              </li>
              <li>
                <a href={`tel:${COMPANY.phoneHref}`} className="flex gap-3 text-sm text-white/55 hover:text-white transition">
                  <svg className="w-5 h-5 text-[#c9a227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {COMPANY.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`} className="flex gap-3 text-sm text-white/55 hover:text-white transition">
                  <svg className="w-5 h-5 text-[#c9a227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/velloreadmin" className="hover:text-white transition">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
