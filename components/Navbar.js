'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'AMC Request', href: '/amc' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[rgba(201,162,39,0.15)] shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" aria-label="Vellore Enterprises Home">
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227] to-[#8B6914] rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />
                <svg viewBox="0 0 40 40" className="relative z-10 w-10 h-10" fill="none" aria-hidden="true">
                  <circle cx="20" cy="20" r="20" fill="url(#logoGrad)" />
                  <path d="M20 8 C20 8 14 14 14 20 C14 23.3 16.7 26 20 26 C23.3 26 26 23.3 26 20 C26 14 20 8 20 8Z" fill="white" opacity="0.9"/>
                  <path d="M20 14 C20 14 17 17 17 20 C17 21.7 18.3 23 20 23 C21.7 23 23 21.7 23 20 C23 17 20 14 20 14Z" fill="#FF6600"/>
                  <defs>
                    <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                      <stop offset="0%" stopColor="#C9A227"/>
                      <stop offset="100%" stopColor="#8B6914"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-condensed font-800 text-lg tracking-widest text-white group-hover:text-[#C9A227] transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, letterSpacing: '0.15em' }}>
                  VELLORE
                </span>
                <span className="text-[9px] tracking-[0.35em] text-[#C9A227] font-medium" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  ENTERPRISES
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium tracking-wider transition-all duration-300 relative group ${
                    pathname === link.href
                      ? 'text-[#C9A227]'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
                >
                  {link.label.toUpperCase()}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-[#C9A227] transition-all duration-300 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-400 hover:text-[#C9A227] transition-colors"
                aria-label={`Shopping cart, ${totalItems} items`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A227] text-black text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* CTA button */}
              <a
                href="tel:+918072264972"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-black text-sm font-bold rounded-none hover:from-[#F5D76E] hover:to-[#C9A227] transition-all duration-300 btn-shimmer"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                CALL NOW
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                aria-expanded={menuOpen}
                aria-label="Toggle mobile menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                  <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-all duration-400 overflow-hidden mobile-menu-backdrop bg-[#0a0a0a]/98 border-b border-[rgba(201,162,39,0.15)] ${
            menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-sm font-medium tracking-widest transition-all duration-200 border-l-2 ${
                  pathname === link.href
                    ? 'text-[#C9A227] border-[#C9A227] bg-[rgba(201,162,39,0.05)]'
                    : 'text-gray-300 border-transparent hover:text-white hover:border-[#C9A227] hover:bg-[rgba(201,162,39,0.03)]'
                }`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.15em' }}
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
            <div className="pt-4 border-t border-[rgba(201,162,39,0.1)]">
              <a
                href="tel:+918072264972"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-black font-bold text-sm tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                📞 +91 80722 64972
              </a>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
