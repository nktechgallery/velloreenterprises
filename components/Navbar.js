'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { COMPANY } from '@/lib/constants';
import CartDrawer from './CartDrawer';

const links = [['Home','/'],['Products','/products'],['AMC','/amc'],['About','/about'],['Contact','/contact']];
const SearchIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>;
const CartIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 7H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>;

export default function Navbar() {
  const path = usePathname();
  const { totalItems } = useCart();
  const [menu, setMenu] = useState(false);
  const [cart, setCart] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 10); update(); window.addEventListener('scroll', update, { passive:true }); return () => window.removeEventListener('scroll', update); }, []);
  useEffect(() => setMenu(false), [path]);
  const openSearch = () => window.dispatchEvent(new KeyboardEvent('keydown',{ key:'k', ctrlKey:true, bubbles:true }));

  return <>
    <header className={`professional-header ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="container-wide professional-nav" aria-label="Primary navigation">
        <Link href="/" className="professional-brand" aria-label={`${COMPANY.name} home`}>
          <span className="professional-monogram">VE</span>
          <span><strong>Vellore Enterprises</strong><small>Fire & Life Safety</small></span>
        </Link>
        <div className={`professional-links ${menu ? 'is-open' : ''}`}>
          {links.map(([label,href]) => <Link key={href} href={href} className={path === href || (href !== '/' && path.startsWith(href)) ? 'active' : ''}>{label}</Link>)}
          <a className="mobile-contact-link" href={`tel:${COMPANY.phoneHref}`}>Call {COMPANY.phoneDisplay}</a>
        </div>
        <div className="professional-actions">
          <button className="nav-search-button" onClick={openSearch} aria-label="Search products and pages"><SearchIcon/><span>Search</span><kbd>⌘ K</kbd></button>
          <button className="professional-icon-button" onClick={() => setCart(true)} aria-label={`Inquiry cart, ${totalItems} items`}><CartIcon/>{totalItems > 0 && <b>{totalItems}</b>}</button>
          <a href="/contact" className="nav-consultation">Get consultation</a>
          <button className="professional-menu-button" onClick={() => setMenu(v => !v)} aria-expanded={menu} aria-label="Toggle navigation"><span/><span/><span/></button>
        </div>
      </nav>
    </header>
    <CartDrawer isOpen={cart} onClose={() => setCart(false)} />
  </>;
}
