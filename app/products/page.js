'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui';
import { useCart } from '@/context/CartContext';
import { useFirestoreCategories } from '@/hooks/useFirestoreCategories';
import { useFirestoreProducts } from '@/hooks/useFirestoreProducts';
import { COMPANY, buildWhatsAppUrl, productSlug } from '@/lib/constants';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { products, loading: productsLoading, error: productsError } = useFirestoreProducts();
  const { categoryNames, loading: categoriesLoading } = useFirestoreCategories();
  const { addItem, totalItems, proceedToWhatsApp } = useCart();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All');
  const [viewMode, setViewMode] = useState('grid');
  const [priceSort, setPriceSort] = useState('none');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'All') {
      result = result.filter((product) => product.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((product) =>
        product.name?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.code?.toLowerCase().includes(q)
      );
    }

    if (priceSort === 'asc') {
      result = [...result].sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
    } else if (priceSort === 'desc') {
      result = [...result].sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
    }

    return result;
  }, [products, activeCategory, search, priceSort]);

  const loading = productsLoading || categoriesLoading;

  const addProductToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      code: product.code,
      category: product.category,
      description: product.description,
      price: product.price,
      image: product.image,
      slug: productSlug(product),
    });
    toast.success(`${product.name} added to cart`);
  };

  const buyNow = (product) => {
    const message = [
      `Hello ${COMPANY.name},`,
      '',
      'I want to buy / inquire about this product:',
      '',
      `Product: ${product.name}`,
      product.code ? `Code: ${product.code}` : '',
      product.category ? `Category: ${product.category}` : '',
      product.price ? `Price: INR ${product.price}` : 'Price: Please share pricing',
      `Link: ${COMPANY.domain}/products/${productSlug(product) || product.id}`,
      '',
      'Please confirm availability and next steps.',
    ].filter(Boolean).join('\n');

    window.open(buildWhatsAppUrl(message), '_blank');
  };

  return (
    <>
      <section className="border-b border-white/10 bg-gradient-to-b from-[#050505] to-[#0a0a0a] pb-16 pt-32">
        <div className="container-pro">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />
          <h1 className="heading-lg mt-6">Product Catalog</h1>
          <p className="lead-copy mt-4 max-w-2xl">
            Browse certified fire safety products, add items to your inquiry cart, and send the final list to WhatsApp.
          </p>
        </div>
      </section>

      <section className="min-h-[60vh] bg-[#050505] py-12">
        <div className="container-wide flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 space-y-8 lg:w-72">
            <div>
              <p className="eyebrow mb-3">Search Catalog</p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, codes..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="input-premium !pl-10"
                />
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-3">Categories</p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeCategory === 'All' ? 'bg-[#c9a227]/10 font-bold text-[#f5d76e]' : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  All Products
                  <span className="float-right rounded-full bg-black/30 px-2 py-0.5 text-xs opacity-50">{products.length}</span>
                </button>
                {categoryNames.map((category) => {
                  const count = products.filter((product) => product.category === category).length;
                  if (count === 0 && !loading) return null;
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        activeCategory === category ? 'bg-[#c9a227]/10 font-bold text-[#f5d76e]' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {category}
                      <span className="float-right rounded-full bg-black/30 px-2 py-0.5 text-xs opacity-50">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-3">Sort by Price</p>
              <select
                value={priceSort}
                onChange={(event) => setPriceSort(event.target.value)}
                className="input-premium select-premium bg-black/20"
              >
                <option value="none">Default relevance</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            <div className="rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/10 p-5">
              <h3 className="font-bold text-[#f5d76e]">Bulk Orders</h3>
              <p className="mt-2 text-sm text-white/70">Need equipment for a large facility? Contact us for specialized enterprise pricing.</p>
              <Button href="/contact" variant="secondary" className="btn-sm mt-4 w-full border-white/10 bg-black/40 hover:bg-black/60">
                Get quote
              </Button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-2xl font-bold">{activeCategory === 'All' ? 'All Products' : activeCategory}</h2>
                <p className="mt-1 text-sm text-white/50">Showing {filteredProducts.length} results</p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded p-2 ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
                  aria-label="Grid view"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded p-2 ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
                  aria-label="List view"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
              </div>
            </div>

            {productsError ? (
              <div className="empty-state py-16">
                <div className="empty-orb">!</div>
                <h3>Products could not load</h3>
                <p>{productsError}</p>
              </div>
            ) : loading ? (
              <div className={viewMode === 'grid' ? 'product-grid' : 'product-grid-list'}>
                {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="skeleton-card" />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state py-16">
                <div className="empty-orb">0</div>
                <h3>No products found</h3>
                <p>No products match your current filters. Try adjusting your search or category selection.</p>
                <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="btn btn-secondary mt-4">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'product-grid' : 'product-grid-list'}>
                {filteredProducts.map((product) => (
                  <article key={product.id} className="product-card card-premium group">
                    <Link href={`/products/${product.slug || product.id}`} className="block">
                      {product.image ? (
                        <div className="product-media overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';
                              event.currentTarget.parentElement?.classList.add('image-load-failed');
                            }}
                          />
                        </div>
                      ) : (
                        <div className="product-media grid place-items-center opacity-40">
                          <span className="text-4xl">IMG</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="eyebrow mb-1">{product.category || 'Product'}</p>
                          <Link href={`/products/${product.slug || product.id}`}>
                            <h3 className="font-display text-xl font-bold transition-colors group-hover:text-[#f5d76e]">{product.name}</h3>
                          </Link>
                        </div>
                        {product.featured && <span className="badge badge-gold shrink-0">Featured</span>}
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs font-mono text-white/40">{product.code || 'NO SKU'}</span>
                        <span className="font-display text-xl font-bold text-[#f5d76e]">
                          {product.price ? `INR ${product.price}` : 'Quote'}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/55">
                        {product.description || 'Certified fire safety product available for inquiry and supply.'}
                      </p>

                      <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
                        <button type="button" onClick={() => addProductToCart(product)} className="btn btn-primary">
                          Add to cart
                        </button>
                        <button type="button" onClick={() => buyNow(product)} className="btn btn-whatsapp">
                          Buy now
                        </button>
                        <Link href={`/products/${product.slug || product.id}`} className="btn btn-secondary sm:col-span-2">
                          View details
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {totalItems > 0 && (
        <div className="fixed bottom-5 left-1/2 z-[60] w-[min(100%-24px,620px)] -translate-x-1/2 rounded-full border border-[#c9a227]/30 bg-[#080808]/95 p-2 shadow-[0_18px_60px_rgba(0,0,0,.55)] backdrop-blur-xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="px-4 text-center text-sm text-white/70 sm:text-left">
              <strong className="text-[#f5d76e]">{totalItems}</strong> item{totalItems === 1 ? '' : 's'} in inquiry cart
            </div>
            <button onClick={proceedToWhatsApp} className="btn btn-whatsapp">
              Send cart on WhatsApp
            </button>
          </div>
        </div>
      )}
    </>
  );
}
