'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { COMPANY, PRODUCT_CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';
import CartDrawer from './CartDrawer';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products', hasMega: true },
  { label: 'AMC', href: '/amc' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function BrandMark() {
  return (
    <span className="flex items-center gap-3">
      <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5d76e] via-[#c9a227] to-[#8b6914] text-black shadow-[0_0_34px_rgba(201,162,39,.25)]">
        <span className="absolute inset-px rounded-[15px] bg-[radial-gradient(circle_at_30%_20%,#fff5bc,transparent_38%),linear-gradient(135deg,#c9a227,#7f1809)]" />
        <span className="relative font-condensed text-sm font-black tracking-wider">VE</span>
      </span>
      <span className="leading-none">
        <span className="block font-condensed text-lg font-black tracking-[0.18em] text-white">VELLORE</span>
        <span className="block font-condensed text-[10px] font-semibold tracking-[0.34em] text-[#f5d76e]">ENTERPRISES</span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const megaTimeout = useRef(null);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 16);
    if (y > 200) {
      setHidden(y > lastScrollY.current && y > 100);
    } else {
      setHidden(false);
    }
    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const openMega = () => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  };

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled || menuOpen
            ? 'border-b border-white/10 bg-[#050505]/88 shadow-[0_18px_70px_rgba(0,0,0,.45)] backdrop-blur-2xl'
            : 'bg-transparent'
        }`}
        aria-label="Primary navigation"
      >
        <div className="container-wide">
          <div className="flex h-[76px] items-center justify-between gap-4">
            <Link href="/" aria-label={`${COMPANY.name} home`} className="shrink-0">
              <BrandMark />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1 lg:flex">
              {navLinks.map((link) => {
                const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={link.hasMega ? openMega : undefined}
                    onMouseLeave={link.hasMega ? closeMega : undefined}
                  >
                    <Link
                      href={link.href}
                      className={`relative rounded-full px-4 py-2 font-condensed text-sm font-bold tracking-[0.12em] transition flex items-center gap-1 ${
                        active ? 'bg-white/10 text-[#f5d76e]' : 'text-white/68 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      {link.label.toUpperCase()}
                      {link.hasMega && (
                        <svg className={`w-3 h-3 transition-transform ${megaOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search trigger */}
              <button
                type="button"
                onClick={() => {
                  const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
                  window.dispatchEvent(event);
                }}
                className="hidden sm:grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-[#c9a227]/50 hover:text-[#f5d76e]"
                aria-label="Open search (Ctrl+K)"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              {/* Cart */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/75 transition hover:border-[#c9a227]/50 hover:text-[#f5d76e]"
                aria-label={`Open inquiry cart, ${totalItems} items`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 4h2l2.2 10.4a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.5L21 7H6.2M10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#f5d76e] px-1 text-xs font-black text-black">
                    {totalItems}
                  </span>
                )}
              </button>

              <a href={`tel:${COMPANY.phoneHref}`} className="btn btn-primary btn-sm hidden sm:inline-flex">
                Call now
              </a>

              {/* Mobile Toggle */}
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white lg:hidden"
                aria-expanded={menuOpen}
                aria-label="Toggle mobile navigation"
              >
                <span className="relative h-4 w-5">
                  <span className={`absolute left-0 top-0 h-px w-5 bg-current transition ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                  <span className={`absolute left-0 top-2 h-px w-5 bg-current transition ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`absolute left-0 top-4 h-px w-5 bg-current transition ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <div
          className={`mega-menu ${megaOpen ? 'mega-menu-open' : ''}`}
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div className="container-wide py-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <p className="eyebrow mb-4">Product categories</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${encodeURIComponent(cat)}`}
                      className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-[#c9a227]/40 hover:bg-[#c9a227]/5 group"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c9a227]/12 font-condensed font-bold text-[#f5d76e] text-sm shrink-0">
                        {CATEGORY_ICONS[cat] || cat.slice(0, 2)}
                      </span>
                      <span className="font-semibold text-sm text-white/70 group-hover:text-[#f5d76e] transition-colors">
                        {cat}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="glass-panel p-5">
                <p className="eyebrow mb-3">Quick actions</p>
                <div className="space-y-2">
                  <Link href="/products" className="block rounded-xl p-3 text-sm text-white/60 hover:bg-white/[0.04] hover:text-[#f5d76e] transition">
                    View all products
                  </Link>
                  <Link href="/amc" className="block rounded-xl p-3 text-sm text-white/60 hover:bg-white/[0.04] hover:text-[#f5d76e] transition">
                    Request AMC quote
                  </Link>
                  <Link href="/contact" className="block rounded-xl p-3 text-sm text-white/60 hover:bg-white/[0.04] hover:text-[#f5d76e] transition">
                    Contact our team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden ${menuOpen ? 'block' : 'hidden'}`}>
          <div className="container-wide pb-5">
            <div className="glass-panel p-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-2xl px-4 py-3 font-condensed text-sm font-bold tracking-[0.16em] ${
                    pathname === link.href ? 'bg-white/10 text-[#f5d76e]' : 'text-white/72'
                  }`}
                >
                  {link.label.toUpperCase()}
                </Link>
              ))}
              {/* Mobile category links */}
              <div className="mt-2 border-t border-white/10 pt-2">
                <p className="px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/30 font-condensed font-bold">Categories</p>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="block rounded-2xl px-4 py-2 text-sm text-white/55 hover:text-[#f5d76e]"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
              <a href={`tel:${COMPANY.phoneHref}`} className="btn btn-primary mt-2 w-full">
                {COMPANY.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
