'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestoreProducts } from '@/hooks/useFirestoreProducts';
import { PRODUCT_CATEGORIES, productSlug } from '@/lib/constants';
import Fuse from 'fuse.js';

const pages = [
  { title: 'Home', href: '/', icon: '🏠' },
  { title: 'Products', href: '/products', icon: '📦' },
  { title: 'AMC Services', href: '/amc', icon: '🔧' },
  { title: 'About Us', href: '/about', icon: '🏢' },
  { title: 'Contact', href: '/contact', icon: '📞' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { products } = useFirestoreProducts();
  const router = useRouter();
  const inputRef = useRef(null);

  const toggle = useCallback(() => {
    setOpen((v) => {
      if (!v) {
        setQuery('');
        setActiveIndex(0);
      }
      return !v;
    });
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, toggle]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const searchData = useMemo(() => {
    const data = [];
    
    // Pages
    pages.forEach(p => {
      data.push({
        type: 'page',
        title: p.title,
        subtitle: p.href,
        icon: p.icon,
        href: p.href,
        searchTerms: `${p.title} ${p.href}`
      });
    });

    // Categories
    PRODUCT_CATEGORIES.forEach(c => {
      data.push({
        type: 'category',
        title: c,
        subtitle: 'Product category',
        icon: '🏷️',
        href: `/products?category=${encodeURIComponent(c)}`,
        searchTerms: c
      });
    });

    // Products
    products.forEach(p => {
      data.push({
        type: 'product',
        title: p.name,
        subtitle: p.category || 'Product',
        icon: '🔥',
        href: `/products/${productSlug(p)}`,
        searchTerms: `${p.name} ${p.code || ''} ${p.category || ''} ${p.description || ''}`
      });
    });

    return data;
  }, [products]);

  const fuse = useMemo(() => {
    return new Fuse(searchData, {
      keys: ['searchTerms'],
      threshold: 0.4,
      distance: 100,
    });
  }, [searchData]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const fuseResults = fuse.search(query.trim());
    return fuseResults.slice(0, 8).map(r => r.item);
  }, [query, fuse]);

  const navigate = (href) => {
    setOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      navigate(results[activeIndex].href);
    }
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="command-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="command-panel">
        <div className="flex items-center gap-3 px-5">
          <svg className="w-5 h-5 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            className="command-input !border-0 !pl-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, pages, categories (e.g., 'abc', 'extinguisher')..."
            aria-label="Search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-activedescendant={results[activeIndex] ? `cmd-item-${activeIndex}` : undefined}
          />
          <kbd className="hidden sm:inline-block text-xs text-white/30 bg-white/8 rounded-md px-2 py-1 border border-white/10 shrink-0">
            ESC
          </kbd>
        </div>

        <div className="command-results" role="listbox" aria-label="Search results">
          {results.length === 0 && query.trim().length > 0 && (
            <div className="p-8 text-center text-white/40 text-sm flex flex-col items-center">
              <span className="text-3xl mb-2 opacity-50">🤖</span>
              <p>Our smart search couldn't find anything for "{query}"</p>
              <p className="text-xs mt-1">Try broader terms or check spelling.</p>
            </div>
          )}
          {results.length === 0 && query.trim().length === 0 && (
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-white/30 px-4 mb-2 font-condensed font-bold">Quick Navigation</p>
              {pages.map((p, i) => (
                <button
                  key={p.href}
                  id={`cmd-item-${i}`}
                  className={`command-item ${activeIndex === i ? 'command-item-active' : ''}`}
                  onClick={() => navigate(p.href)}
                  role="option"
                  aria-selected={activeIndex === i}
                >
                  <span className="command-item-icon">{p.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{p.title}</p>
                    <p className="text-xs text-white/35">{p.href}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {results.length > 0 && (
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f5d76e] px-4 mb-2 font-condensed font-bold opacity-70">Smart Results</p>
              {results.map((r, i) => (
                <button
                  key={`${r.type}-${r.title}-${i}`}
                  id={`cmd-item-${i}`}
                  className={`command-item ${activeIndex === i ? 'command-item-active' : ''}`}
                  onClick={() => navigate(r.href)}
                  role="option"
                  aria-selected={activeIndex === i}
                >
                  <span className="command-item-icon">{r.icon}</span>
                  <div className="min-w-0 flex-1 flex flex-col items-start text-left">
                    <p className="font-semibold text-sm truncate w-full">{r.title}</p>
                    <p className="text-xs text-white/35 truncate w-full">{r.subtitle}</p>
                  </div>
                  <span className="ml-auto badge badge-gold text-[10px] shrink-0">{r.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="command-footer">
          <span className="text-xs text-white/30">
            <kbd>↑↓</kbd> navigate
          </span>
          <span className="text-xs text-white/30">
            <kbd>↵</kbd> select
          </span>
          <span className="text-xs text-white/30">
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
