import Link from 'next/link';

const services = [
  'Fire Extinguishers', 'Fire Alarm Systems', 'Fire Hydrant Systems',
  'Fire Suppression Systems', 'Fire Stop Solutions', 'Fire Safety AMC',
  'Extinguisher Refilling', 'Fire Safety Audits',
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#080808] border-t border-[rgba(201,162,39,0.1)]" role="contentinfo">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#C9A227] to-[#8B6914] rounded-full flex items-center justify-center">
                <span className="text-black text-lg">🔥</span>
              </div>
              <div>
                <div className="text-white font-bold tracking-widest text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.15em' }}>VELLORE</div>
                <div className="text-[#C9A227] text-[8px] tracking-[0.35em]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>ENTERPRISES</div>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your trusted fire safety partner in Vellore, Tamil Nadu. Protecting lives and property through advanced fire protection solutions since our founding.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/vellore_enterprises" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-[rgba(201,162,39,0.2)] flex items-center justify-center text-gray-400 hover:text-[#C9A227] hover:border-[#C9A227] transition-all duration-300"
                aria-label="Vellore Enterprises on Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://wa.me/918072264972" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-[rgba(201,162,39,0.2)] flex items-center justify-center text-gray-400 hover:text-[#25D366] hover:border-[#25D366] transition-all duration-300"
                aria-label="Vellore Enterprises on WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.979 0C5.362 0 0 5.373 0 11.979c0 2.09.546 4.052 1.497 5.762L0 24l6.421-1.685c1.63.891 3.5 1.403 5.558 1.403C18.596 23.718 24 18.345 24 11.739 24 5.133 18.596 0 11.979 0zm0 21.733c-1.795 0-3.47-.48-4.905-1.315l-.352-.208-3.636.953.977-3.536-.228-.362C2.803 15.636 2.267 13.869 2.267 11.979c0-5.37 4.352-9.733 9.712-9.733s9.712 4.363 9.712 9.733-4.352 9.754-9.712 9.754z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-widest mb-6 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Our Services</h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <Link href="/products" className="text-sm text-gray-500 hover:text-[#C9A227] transition-colors flex items-center gap-2 group">
                    <span className="w-3 h-px bg-[rgba(201,162,39,0.3)] group-hover:bg-[#C9A227] group-hover:w-5 transition-all duration-300" aria-hidden="true" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-widest mb-6 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'AMC Request', href: '/amc' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'PASS Method Guide', href: '/#pass-method' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-[#C9A227] transition-colors flex items-center gap-2 group">
                    <span className="w-3 h-px bg-[rgba(201,162,39,0.3)] group-hover:bg-[#C9A227] group-hover:w-5 transition-all duration-300" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-widest mb-6 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Contact Us</h3>
            <address className="not-italic space-y-4">
              <div className="flex gap-3">
                <span className="text-[#C9A227] mt-0.5 flex-shrink-0" aria-hidden="true">📍</span>
                <p className="text-sm text-gray-500 leading-relaxed">
                  164, Vellore Road, Kangeyanallur,<br />Vellore, Tamil Nadu – 632006
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-[#C9A227] flex-shrink-0" aria-hidden="true">📞</span>
                <div className="space-y-1">
                  <a href="tel:+918072264972" className="block text-sm text-gray-500 hover:text-[#C9A227] transition-colors">+91 80722 64972</a>
                  <a href="tel:+919087405584" className="block text-sm text-gray-500 hover:text-[#C9A227] transition-colors">+91 90874 05584</a>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-[#C9A227] flex-shrink-0" aria-hidden="true">✉️</span>
                <a href="mailto:velloreenterprises7@gmail.com" className="text-sm text-gray-500 hover:text-[#C9A227] transition-colors break-all">
                  velloreenterprises7@gmail.com
                </a>
              </div>
              <div className="flex gap-3">
                <span className="text-[#C9A227] flex-shrink-0" aria-hidden="true">🕐</span>
                <div className="text-sm text-gray-500">
                  <p>Mon – Sat: 9:00 AM – 6:00 PM</p>
                  <p className="text-[#C9A227] text-xs mt-1">24/7 Emergency Support</p>
                </div>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(201,162,39,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {currentYear} Vellore Enterprises. All rights reserved. | Fire Safety Company in Vellore, Tamil Nadu
          </p>
          <p className="text-xs text-gray-700">
            Designed for{' '}
            <span className="text-[#C9A227]">Your Safety</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
