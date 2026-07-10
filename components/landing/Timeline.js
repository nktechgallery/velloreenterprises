'use client';

import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

const milestones = [
  {
    year: '2014',
    title: 'Foundation',
    description: 'Started operations in Vellore with a mission to deliver reliable fire safety products and services to local businesses.',
  },
  {
    year: '2016',
    title: 'Service Expansion',
    description: 'Expanded into AMC contracts, refilling services, and hydrant system installation for commercial facilities.',
  },
  {
    year: '2019',
    title: 'Industrial Growth',
    description: 'Became a trusted supplier for factories, hospitals, schools, and government facilities across Tamil Nadu.',
  },
  {
    year: '2022',
    title: 'Digital Transformation',
    description: 'Launched real-time product catalog, online inquiries, and digital AMC management for faster customer response.',
  },
  {
    year: 'Today',
    title: 'Complete Protection Partner',
    description: 'End-to-end fire safety partner offering supply, installation, maintenance, audits, and 24/7 emergency support.',
  },
];

export default function Timeline() {
  const [active, setActive] = useState(0);
  const [ref, inView] = useReveal();

  return (
    <div ref={ref} className={`reveal ${inView ? 'is-visible' : ''}`}>
      {/* Desktop horizontal timeline */}
      <div className="hidden md:block">
        <div className="relative mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent" />
          <div className="flex justify-between relative z-10">
            {milestones.map((m, i) => (
              <button
                key={m.year}
                onClick={() => setActive(i)}
                className="group flex flex-col items-center gap-3"
                aria-label={`View ${m.year} milestone`}
              >
                <span className={`font-condensed text-sm font-bold tracking-[0.16em] transition-colors ${
                  active === i ? 'text-[#f5d76e]' : 'text-white/40 group-hover:text-white/60'
                }`}>
                  {m.year}
                </span>
                <span className={`w-4 h-4 rounded-full border-[3px] transition-all duration-300 ${
                  active === i
                    ? 'bg-[#f5d76e] border-[#c9a227] shadow-[0_0_24px_rgba(201,162,39,0.5)] scale-125'
                    : 'bg-[#1a1a1a] border-white/20 group-hover:border-white/40'
                }`} />
              </button>
            ))}
          </div>
        </div>
        <div className="glass-panel p-8 min-h-[180px] transition-all duration-500">
          <p className="eyebrow">{milestones[active].year}</p>
          <h3 className="font-display text-3xl font-bold mt-1">{milestones[active].title}</h3>
          <p className="mt-4 text-lg leading-8 text-white/60 max-w-3xl">{milestones[active].description}</p>
        </div>
      </div>

      {/* Mobile vertical timeline */}
      <div className="md:hidden timeline-line pl-12 space-y-8">
        {milestones.map((m, i) => (
          <div key={m.year} className="relative flex gap-5">
            <div className={`absolute left-[-30px] top-1 timeline-dot ${active === i ? 'timeline-dot-active' : ''}`} />
            <button
              onClick={() => setActive(i)}
              className={`text-left rounded-2xl border p-5 w-full transition-all ${
                active === i
                  ? 'border-[#c9a227]/60 bg-[#c9a227]/8'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <span className="font-condensed text-xs font-bold tracking-[0.2em] text-[#f5d76e]">{m.year}</span>
              <h3 className="font-display text-xl font-bold mt-2">{m.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">{m.description}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
