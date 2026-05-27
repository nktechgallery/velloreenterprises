'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

// metadata moved to layout - client component
const _metadata = {
  title: 'Fire Safety Products',
  description: 'Browse our complete range of fire safety products – extinguishers, alarm systems, hydrant systems and more in Vellore, Tamil Nadu.',
};

const categories = ['All', 'Fire Extinguishers', 'Fire Alarms', 'Hydrant Systems', 'Suppression Systems', 'Fire Stop', 'Safety Gear'];

const defaultProducts = [
  { id: '1', name: 'ABC Dry Powder Extinguisher', code: 'VE-ABC-01', category: 'Fire Extinguishers', description: 'Multi-purpose ABC dry powder fire extinguisher suitable for Class A, B, and C fires. Ideal for offices, factories, and homes.', features: ['Class A, B, C fires', 'BIS Certified', 'Available: 1kg, 2kg, 4kg, 6kg, 9kg', 'Pressure gauge included'], image: null, slug: 'abc-dry-powder-extinguisher', featured: true },
  { id: '2', name: 'CO₂ Fire Extinguisher', code: 'VE-CO2-01', category: 'Fire Extinguishers', description: 'Carbon dioxide extinguisher for electrical and flammable liquid fires. No residue, safe for electronics and server rooms.', features: ['Class B & Electrical fires', 'No residue', 'Available: 2kg, 4.5kg, 6.5kg', 'Horn nozzle included'], image: null, slug: 'co2-fire-extinguisher', featured: true },
  { id: '3', name: 'AFFF Foam Extinguisher', code: 'VE-FOAM-01', category: 'Fire Extinguishers', description: 'Aqueous film-forming foam extinguisher for Class A and B fires including flammable liquids like petrol and diesel.', features: ['Class A & B fires', 'Film-forming foam', 'Available: 6L, 9L', 'High discharge rate'], image: null, slug: 'afff-foam-extinguisher', featured: false },
  { id: '4', name: 'Fire Stop Spray (500ml)', code: 'VE-FS-01', category: 'Fire Stop', description: 'Portable compact fire extinguishing spray. Quick and effective for small fires in kitchens, cars, and offices.', features: ['500ml capacity', 'Wood, Paper, Electrical fires', 'Simple spray operation', 'No maintenance needed'], image: null, slug: 'fire-stop-spray', featured: true },
  { id: '5', name: 'Fire Blaster Ball (500ml)', code: 'VE-FB-01', category: 'Fire Stop', description: 'Revolutionary throwable fire extinguisher. Simply toss into fire and it automatically activates to suppress flames.', features: ['Throwable design', 'Auto-activation', '500ml dry powder', 'Ideal for all environments'], image: null, slug: 'fire-blaster-ball', featured: true },
  { id: '6', name: 'Addressable Fire Alarm System', code: 'VE-FA-01', category: 'Fire Alarms', description: 'Intelligent addressable fire alarm system with control panel, smoke detectors, heat detectors, and manual call points.', features: ['Addressable zones', 'LCD control panel', 'Battery backup', 'Installation included'], image: null, slug: 'addressable-fire-alarm-system', featured: true },
  { id: '7', name: 'Fire Hydrant System Complete', code: 'VE-FH-01', category: 'Hydrant Systems', description: 'Complete fire hydrant system including hoses, nozzles, valves, hydrant box, and fire pump. Ideal for large premises.', features: ['Complete system', 'Hoses & nozzles', 'Fire pump included', 'Design & installation'], image: null, slug: 'fire-hydrant-system', featured: false },
  { id: '8', name: 'Flame Master Aerosol (500g)', code: 'VE-FM-01', category: 'Fire Stop', description: 'Compact fire extinguishing aerosol for rapid fire suppression. Ideal for homes, cars, and offices with no maintenance required.', features: ['500g compact size', 'Rapid suppression', 'No maintenance', 'All fire classes'], image: null, slug: 'flame-master-aerosol', featured: false },
];

function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, code: product.code, description: product.description, slug: product.slug });
    setAdded(true);
    toast.success(`${product.name} added to inquiry cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    const phone = '918072264972';
    const msg = `Hello Vellore Enterprises,\n\nI am interested in the following product:\n\n*Product Name:* ${product.name}\n*Product Code:* ${product.code || 'N/A'}\n*Description:* ${product.description?.substring(0, 100) || ''}\n*Product Link:* https://www.velloreenterprises.in/products/${product.slug}\n\nPlease share pricing and availability.\n\nThank you!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <article className="card-premium flex flex-col group" aria-label={product.name}>
      {/* Image */}
      <div className="product-img-container aspect-square bg-[#1a1a1a] relative">
        {product.image ? (
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="text-5xl" aria-hidden="true">
              {product.category === 'Fire Extinguishers' ? '🧯' :
               product.category === 'Fire Alarms' ? '🚨' :
               product.category === 'Hydrant Systems' ? '💧' : '🔴'}
            </div>
            <span className="text-xs tracking-widest text-gray-600 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {product.category}
            </span>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-[#C9A227] text-black text-[10px] font-bold tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            FEATURED
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-1">
          <span className="text-[10px] tracking-[0.25em] text-[#C9A227] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {product.category}
          </span>
          {product.code && (
            <span className="ml-3 text-[10px] text-gray-600">#{product.code}</span>
          )}
        </div>

        <h2 className="text-lg font-bold text-white mb-2 group-hover:text-[#C9A227] transition-colors leading-tight"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}>
          {product.name}
        </h2>

        <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{product.description}</p>

        {/* Features */}
        {product.features?.length > 0 && (
          <ul className="space-y-1.5 mb-5">
            {product.features.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-1 h-1 rounded-full bg-[#C9A227] flex-shrink-0" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            className={`py-3 text-xs font-bold tracking-wider border transition-all duration-300 ${
              added
                ? 'border-[#C9A227] bg-[rgba(201,162,39,0.2)] text-[#C9A227]'
                : 'border-[rgba(201,162,39,0.3)] text-[#C9A227] hover:bg-[rgba(201,162,39,0.1)] hover:border-[#C9A227]'
            }`}
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
            aria-label={`Add ${product.name} to inquiry cart`}
          >
            {added ? '✓ ADDED' : 'ADD TO CART'}
          </button>
          <button
            onClick={handleBuyNow}
            className="py-3 text-xs font-bold tracking-wider bg-[#25D366] hover:bg-[#20ba5a] text-white transition-all duration-300 btn-shimmer"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
            aria-label={`Inquire about ${product.name} on WhatsApp`}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState(defaultProducts);
  const [filtered, setFiltered] = useState(defaultProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setProducts(data);
        }
      } catch (e) {
        // Use defaults if Firebase not configured
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (search) result = result.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.code?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [products, activeCategory, search]);

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-16 bg-[#0d0d0d] border-b border-[rgba(201,162,39,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.4em] text-[#C9A227] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Our Product Range
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Fire Safety <span className="text-gold-gradient">Products</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Complete range of certified fire safety equipment for residential, commercial, and industrial applications.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[72px] z-30 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[rgba(201,162,39,0.1)] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-premium w-full pl-9 pr-4 py-2 text-sm rounded-none"
                aria-label="Search fire safety products"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Category filters */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium tracking-wider transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-[#C9A227] text-black'
                      : 'border border-[rgba(201,162,39,0.2)] text-gray-400 hover:border-[#C9A227] hover:text-[#C9A227]'
                  }`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 lg:py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
              <p className="text-gray-400">No products found matching your search.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-6">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Inquiry CTA */}
      <section className="py-16 bg-[#0d0d0d] border-t border-[rgba(201,162,39,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Can't find what you need?
          </h2>
          <p className="text-gray-400 mb-6">Contact us directly – we source and supply all types of fire safety equipment.</p>
          <a
            href={`https://wa.me/918072264972?text=${encodeURIComponent('Hello Vellore Enterprises! I need a specific fire safety product. Can you help?')}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold tracking-wider transition-all duration-300 btn-shimmer"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
          >
            💬 CHAT ON WHATSAPP
          </a>
        </div>
      </section>
    </>
  );
}
