'use client';

import { useCallback, useEffect, useState } from 'react';

const testimonials = [
  {
    name: 'Manufacturing Facility Manager',
    industry: 'Industrial',
    quote: 'The team handled supply, installation, and safety training without disrupting our production line. Their AMC program keeps all systems inspection-ready year-round.',
  },
  {
    name: 'Commercial Building Operator',
    industry: 'Commercial',
    quote: 'Their compliance documentation and quarterly reporting made our fire safety audits seamless. Response time for emergencies is outstanding.',
  },
  {
    name: 'School Campus Administrator',
    industry: 'Education',
    quote: 'Clear safety recommendations, prompt equipment delivery, and dependable maintenance follow-through. They understand institutional needs perfectly.',
  },
  {
    name: 'Hospital Safety Officer',
    industry: 'Healthcare',
    quote: 'We rely on Vellore Enterprises for all our fire safety needs. Their 24/7 support and certified equipment give us the confidence we need.',
  },
  {
    name: 'Warehouse Operations Head',
    industry: 'Logistics',
    quote: 'From fire extinguishers to a complete hydrant system, they designed and installed everything to specification. Excellent project management.',
  },
];

export default function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Customer testimonials"
      aria-roledescription="carousel"
    >
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
        <div
          className="testimonial-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="testimonial-card"
              role="group"
              aria-roledescription="slide"
              aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
              aria-hidden={active !== i}
            >
              <div className="p-8 md:p-12">
                <svg className="w-10 h-10 text-[#c9a227]/30 mb-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8b6914] grid place-items-center font-condensed font-bold text-black text-sm">
                    {t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-sm text-[#f5d76e]">{t.industry}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-white/10 grid place-items-center text-white/50 hover:text-[#f5d76e] hover:border-[#c9a227]/40 transition"
            aria-label="Previous testimonial"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-white/10 grid place-items-center text-white/50 hover:text-[#f5d76e] hover:border-[#c9a227]/40 transition"
            aria-label="Next testimonial"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="testimonial-dots" role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`testimonial-dot ${active === i ? 'testimonial-dot-active' : ''}`}
              role="tab"
              aria-selected={active === i}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
