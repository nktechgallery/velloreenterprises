'use client';

import Link from 'next/link';
import { PRODUCT_CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';
import { useReveal } from '@/hooks/useReveal';

const categoryDescriptions = {
  'Fire Extinguishers': 'CO2, ABC, foam, water, and clean agent units for every fire class',
  'Fire Alarms': 'Smoke detectors, panels, call points, and addressable systems',
  'Hydrant Systems': 'Hoses, nozzles, valves, pumps, and full hydrant networks',
  'Suppression Systems': 'Automatic gas, foam, and water mist suppression systems',
  'Fire Stop': 'Sealants, wraps, pillows, and penetration firestop solutions',
  'Safety Gear': 'PPE, helmets, boots, gloves, and fire proximity suits',
};

export default function CategoryShowcase() {
  const [ref, inView] = useReveal();

  return (
    <div ref={ref} className={`reveal ${inView ? 'is-visible' : ''}`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCT_CATEGORIES.map((category, index) => (
          <Link
            key={category}
            href={`/products?category=${encodeURIComponent(category)}`}
            className="category-card group"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="relative z-10">
              <div className="category-icon mx-auto">
                {CATEGORY_ICONS[category] || category.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="font-display text-xl font-bold mt-2 group-hover:text-[#f5d76e] transition-colors">
                {category}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/50 group-hover:text-white/65 transition-colors">
                {categoryDescriptions[category] || 'Certified fire safety products'}
              </p>
              <span className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-[#f5d76e] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Browse products
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
