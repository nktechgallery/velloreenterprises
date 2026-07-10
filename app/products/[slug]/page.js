'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useFirestoreProducts } from '@/hooks/useFirestoreProducts';
import { productSlug } from '@/lib/constants';
import { Button, Section } from '@/components/ui';
import Breadcrumbs from '@/components/Breadcrumbs';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, loading } = useFirestoreProducts();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const product = useMemo(() => {
    return products.find(p => productSlug(p) === slug || p.id === slug);
  }, [products, slug]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center pt-24 bg-[#050505]">
        <div className="w-12 h-12 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return notFound();

  const handleAdd = () => {
    addItem({ ...product, quantity });
    toast.success('Added to inquiry cart');
    setQuantity(1);
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.code,
    category: product.category,
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      }
    })
  };

  return (
    <article className="pt-24 pb-16 bg-[#050505]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      
      <div className="container-pro">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.category || 'Category', href: `/products?category=${encodeURIComponent(product.category || '')}` },
          { label: product.name }
        ]} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          
          {/* Visual Area */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(201,162,39,.15),rgba(255,255,255,.04)_44%,rgba(255,255,255,.02))] p-4 shadow-[0_24px_80px_rgba(0,0,0,.4)]">
              {!imageLoaded && product.image && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="w-8 h-8 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                  className={`h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center opacity-30">
                  <span className="text-6xl">📷</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <p className="text-xs text-white/50 uppercase tracking-widest font-condensed">Certification</p>
                <p className="font-bold text-[#f5d76e] mt-1">BIS Approved</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <p className="text-xs text-white/50 uppercase tracking-widest font-condensed">Availability</p>
                <p className="font-bold text-[#25d366] mt-1">Ready to deploy</p>
              </div>
            </div>
          </div>

          {/* Details Area */}
          <div className="flex flex-col">
            <div>
              <p className="eyebrow">{product.category}</p>
              <h1 className="font-display text-4xl font-bold lg:text-5xl">{product.name}</h1>
              
              <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-white/10 pb-6">
                <span className="badge badge-gold px-3">SKU: {product.code || 'N/A'}</span>
                {product.price && (
                  <span className="font-display text-2xl font-bold text-[#f5d76e]">₹{product.price}</span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold mb-2">Description</h3>
              <p className="text-white/60 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>

            <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Quantity</span>
                <div className="inline-flex items-center rounded-full border border-white/10 bg-black/40 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="grid h-10 w-10 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition"
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className="min-w-[40px] text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="grid h-10 w-10 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition"
                    aria-label="Increase quantity"
                  >+</button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <button onClick={handleAdd} className="btn btn-primary flex-1">
                  Add to inquiry cart
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="font-bold mb-4">Specifications</h3>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="text-white/50">Category</span>
                  <span className="text-white font-medium">{product.category}</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="text-white/50">Product Code</span>
                  <span className="text-white font-medium">{product.code || '-'}</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="text-white/50">Compliance</span>
                  <span className="text-white font-medium">IS 15683 / BIS</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2 text-sm">
                  <span className="text-white/50">Warranty</span>
                  <span className="text-white font-medium">1 Year standard</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-white/10 pt-16">
            <h2 className="font-display text-3xl font-bold mb-8">Similar Equipment</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map(rp => (
                <Link key={rp.id} href={`/products/${productSlug(rp) || rp.id}`} className="card-premium p-5 group">
                  <div className="product-media rounded-xl overflow-hidden mb-4 h-40">
                    {rp.image ? (
                      <img
                        src={rp.image}
                        alt={rp.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center opacity-30 text-2xl">📷</div>
                    )}
                  </div>
                  <h3 className="font-bold truncate group-hover:text-[#f5d76e] transition-colors">{rp.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-white/50">{rp.code}</span>
                    {rp.price && <span className="text-[#f5d76e] font-semibold text-sm">₹{rp.price}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
