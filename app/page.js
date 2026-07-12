'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { COMPANY, INDUSTRIES, SERVICES } from '@/lib/constants';
import { Button, MetricCard, Section } from '@/components/ui';
import { useFirestoreProducts } from '@/hooks/useFirestoreProducts';
import { useReveal } from '@/hooks/useReveal';
import { optimizedImageUrl } from '@/lib/imageUrl';
import PassMethod from '@/components/PassMethod';
import JsonLd from '@/components/JsonLd';
import { faqSchema as buildFaqSchema } from '@/lib/seo';

/* Dynamic imports — only loaded when scrolled into view */
const AnimatedCounter = dynamic(() => import('@/components/landing/AnimatedCounter'));
const Timeline = dynamic(() => import('@/components/landing/Timeline'));
const CategoryShowcase = dynamic(() => import('@/components/landing/CategoryShowcase'));
const TestimonialCarousel = dynamic(() => import('@/components/landing/TestimonialCarousel'));
const FAQAccordion = dynamic(() => import('@/components/landing/FAQAccordion'));

const stats = [
  { end: 500, suffix: '+', label: 'Clients protected', detail: 'Industrial, commercial, and residential' },
  { end: 4, suffix: '+', label: 'Years expertise', detail: 'Fire safety consultation and service' },
  { end: 24, suffix: '/7', label: 'Emergency support', detail: 'Rapid response phone and WhatsApp' },
  { end: 100, suffix: '%', label: 'Compliance focus', detail: 'Products aligned to BIS standards' },
];
const homeFaqSchema = buildFaqSchema([
  ['What types of fire safety equipment do you supply?','We supply fire extinguishers, alarm systems, hydrant equipment, suppression systems, fire-stop products, and safety gear from established manufacturers.'],
  ['Do you provide fire safety installation and maintenance?','Yes. Vellore Enterprises supports equipment supply, installation coordination, testing, scheduled maintenance, documentation, and annual maintenance contracts.'],
  ['Which areas does Vellore Enterprises serve?','We serve Vellore, Kangeyanallur, nearby cities, and larger projects across Tamil Nadu.'],
]);

const whyChooseUs = [
  {
    icon: '🛡️',
    title: 'Certified Products',
    desc: 'Every product we supply is sourced from certified manufacturers and meets recognized Indian and international standards.',
  },
  {
    icon: '⚡',
    title: 'Rapid Response',
    desc: '24/7 emergency support with same-day response for critical equipment needs and urgent servicing requirements.',
  },
  {
    icon: '📋',
    title: 'Complete Documentation',
    desc: 'Detailed inspection reports, compliance certificates, AMC logs, and audit-ready documentation for every installation.',
  },
  {
    icon: '🔧',
    title: 'End-to-End Service',
    desc: 'From initial site survey through installation, training, and long-term AMC — we manage the entire fire safety lifecycle.',
  },
  {
    icon: '🏭',
    title: 'Industry Expertise',
    desc: 'Specialized solutions for factories, hospitals, schools, hotels, warehouses, and commercial complexes.',
  },
  {
    icon: '💰',
    title: 'Transparent Pricing',
    desc: 'Clear quotations, no hidden charges, and flexible AMC plans tailored to your facility size and risk profile.',
  },
];

const certifications = [
  'BIS Certified', 'ISO 9001', 'IS 15683', 'IS 2190', 'NFPA Compliant', 'TAC Approved',
];

const processSteps = [
  { step: '01', title: 'Survey', desc: 'On-site walkthrough, risk mapping, equipment inventory, and requirement capture.', icon: '🔍' },
  { step: '02', title: 'Design', desc: 'Equipment selection, placement strategy, coverage analysis, and compliance planning.', icon: '📐' },
  { step: '03', title: 'Deploy', desc: 'Product supply, professional installation, system testing, and team training.', icon: '🚀' },
  { step: '04', title: 'Maintain', desc: 'Scheduled AMC visits, refilling, documentation, and emergency response support.', icon: '🔧' },
];

const amcPlans = [
  { title: 'Essential', price: 'Custom', target: 'Small offices, shops, and residential', features: ['Annual inspection', 'Basic compliance report', 'Refilling coordination', 'Phone support'] },
  { title: 'Professional', price: 'Custom', target: 'Commercial buildings and institutions', features: ['Quarterly servicing', 'Full compliance documentation', 'Priority emergency support', 'Equipment testing', 'Detailed reports'], featured: true },
  { title: 'Enterprise', price: 'Custom', target: 'Factories, campuses, multi-site', features: ['Custom visit schedule', 'Asset lifecycle register', 'Emergency response planning', 'Dedicated account manager', '24/7 priority line', 'Regulatory liaison'] },
];

function FeaturedProducts() {
  const { products, loading } = useFirestoreProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const display = featured.length ? featured : products.slice(0, 4);
  const [ref, inView] = useReveal();

  if (loading || display.length === 0) return null;

  return (
    <Section
      eyebrow="Live catalog"
      title="Featured protection equipment"
      description="Products are synchronized in real-time from the admin dashboard through Firestore."
      className="bg-[#070707]"
    >
      <div ref={ref} className={`container-wide grid gap-5 sm:grid-cols-2 lg:grid-cols-4 reveal ${inView ? 'is-visible' : ''}`}>
        {display.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug || product.id}`}
            className="card-premium p-6 group"
          >
            {product.image && (
              <div className="product-media mb-4 rounded-2xl overflow-hidden h-40">
                <Image src={optimizedImageUrl(product.image, 400)} alt={`${product.name} — ${product.category || 'fire safety equipment'}`} className="w-full h-full object-cover" loading="lazy" width={400} height={160} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
              </div>
            )}
            <p className="eyebrow mb-2">{product.category || 'Product'}</p>
            <h3 className="font-display text-xl font-bold group-hover:text-[#f5d76e] transition-colors">{product.name}</h3>
            {product.price && <p className="mt-2 font-bold text-[#f5d76e]">INR {product.price}</p>}
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">{product.description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#f5d76e]">
              View details
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
          </Link>
        ))}
      </div>
      <div className="container-pro text-center mt-10">
        <Button href="/products" variant="secondary">View all products</Button>
      </div>
    </Section>
  );
}

function RevealCard({ children, className = '', delay = 0 }) {
  const [ref, inView] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeFaqSchema} />
      {/* ════════ Enterprise Hero ════════ */}
      <section className="hero-shell">
        <div className="orbital-bg" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} style={{ left: `${8 + i * 11}%`, top: `${8 + (i % 4) * 18}%`, animationDelay: `${i * 0.5}s` }} />
          ))}
        </div>
        <div className="container-wide hero-grid">
          <div className="relative z-10">
            <p className="eyebrow">Vellore's trusted fire safety partner</p>
            <h1 className="heading-xl max-w-5xl">
              Fire protection with <span className="text-gold-gradient">enterprise</span> discipline.
            </h1>
            <p className="lead-copy mt-6 max-w-2xl">
              Certified products, responsive service, and complete fire safety lifecycle support for facilities across Vellore and Tamil Nadu.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/products" variant="primary">Explore products</Button>
              <Button href="/amc" variant="secondary">Request AMC</Button>
              <Button href={`tel:${COMPANY.phoneHref}`} variant="secondary">{COMPANY.phoneDisplay}</Button>
            </div>
            <div className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {['BIS Certified', 'Site Survey', 'AMC Reports', '24/7 Support'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center text-xs font-semibold text-white/62">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 overflow-hidden rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(201,162,39,.22),transparent_44%),linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03))] p-5 shadow-[0_30px_120px_rgba(0,0,0,.42)]">
            <div className="hero-visual">
              <div className="hero-device">
                <span className="hero-device-ring" />
                <span className="hero-device-core" />
                <span className="hero-device-label">VE</span>
              </div>
              <div className="hero-facts">
                <div><strong>Fast response</strong><span>24/7 support channel</span></div>
                <div><strong>Certified supply</strong><span>Products and AMC</span></div>
                <div><strong>Clear workflow</strong><span>Survey to maintenance</span></div>
              </div>
            </div>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs text-white/55 backdrop-blur-xl">
              Premium fire safety platform
            </div>
          </div>
        </div>
      </section>

      {/* ════════ Animated KPI Counters ════════ */}
      <section className="border-y border-white/10 bg-white/[0.025] py-6">
        <div className="container-wide grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
              detail={stat.detail}
            />
          ))}
        </div>
      </section>

      {/* ════════ Trusted Industries ════════ */}
      <Section
        eyebrow="Trusted by"
        title="Serving high-responsibility environments"
        description="Our products and services protect people and assets across Tamil Nadu's most critical facilities."
      >
        <div className="container-pro grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((industry, i) => (
            <RevealCard key={industry} delay={i * 60} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center group hover:border-[#c9a227]/40 hover:bg-[#c9a227]/5 transition-all">
              <p className="font-semibold text-white/72 group-hover:text-[#f5d76e] transition-colors">{industry}</p>
            </RevealCard>
          ))}
        </div>
      </Section>

      {/* ════════ Product Categories ════════ */}
      <Section
        eyebrow="Product range"
        title="Complete fire safety categories"
        description="Browse our full range of certified fire protection products, each category backed by industry-leading brands."
        className="bg-[#070707]"
      >
        <div className="container-pro">
          <CategoryShowcase />
        </div>
      </Section>

      {/* ════════ Why Choose Us ════════ */}
      <Section
        eyebrow="Advantages"
        title="Why facilities choose Vellore Enterprises"
        description="We combine local availability with professional processes: assessment, product selection, installation, documentation, and maintenance."
      >
        <div className="container-wide grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item, i) => (
            <RevealCard key={item.title} delay={i * 80} className="card-premium p-7">
              <span className="mb-5 inline-grid h-14 w-14 place-items-center rounded-2xl bg-[#c9a227]/12 text-2xl">
                {item.icon}
              </span>
              <h3 className="font-display text-2xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/55">{item.desc}</p>
            </RevealCard>
          ))}
        </div>
      </Section>

      {/* ════════ Company Timeline ════════ */}
      <Section
        eyebrow="Our journey"
        title="Building trust since 2014"
        description="From a local fire safety supplier to a complete protection partner for facilities across Tamil Nadu."
        className="bg-[#070707]"
      >
        <div className="container-pro">
          <Timeline />
        </div>
      </Section>

      {/* ════════ Certifications ════════ */}
      <section className="border-y border-white/10 bg-white/[0.025] py-12">
        <div className="container-pro">
          <p className="eyebrow text-center">Certifications and compliance</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {certifications.map((cert) => (
              <div key={cert} className="badge badge-gold text-sm px-5 py-2">
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Fire Protection Process ════════ */}
      <Section
        eyebrow="Delivery model"
        title="A clear path from risk to readiness"
        description="Our systematic four-step process ensures complete coverage from initial assessment to long-term maintenance."
      >
        <div className="container-pro grid gap-5 md:grid-cols-4">
          {processSteps.map((item, i) => (
            <RevealCard key={item.step} delay={i * 100} className="glass-panel p-6 text-center">
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <span className="font-condensed text-4xl font-black text-[#f5d76e]">{item.step}</span>
              <h3 className="mt-4 font-display text-2xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">{item.desc}</p>
            </RevealCard>
          ))}
        </div>
      </Section>

      {/* ════════ Featured Products ════════ */}
      <FeaturedProducts />

      {/* ════════ AMC Plans Preview ════════ */}
      <Section
        eyebrow="Annual maintenance"
        title="AMC plans for every facility"
        description="Preventive maintenance keeps your fire safety systems inspection-ready and compliant year-round."
      >
        <div className="container-pro grid gap-5 md:grid-cols-3">
          {amcPlans.map((plan, i) => (
            <RevealCard
              key={plan.title}
              delay={i * 100}
              className={`card-premium p-7 relative ${plan.featured ? 'border-[#c9a227]/60 shadow-[0_0_60px_rgba(201,162,39,0.15)]' : ''}`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-6 badge badge-gold">Most Popular</span>
              )}
              <h3 className="font-display text-3xl font-bold">{plan.title}</h3>
              <p className="mt-2 text-sm text-white/50">{plan.target}</p>
              <p className="mt-4 font-condensed text-2xl font-bold text-[#f5d76e]">{plan.price}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-white/65">
                    <svg className="w-5 h-5 text-[#c9a227] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Button href="/amc" variant={plan.featured ? 'primary' : 'secondary'} className="w-full mt-7">
                Request quote
              </Button>
            </RevealCard>
          ))}
        </div>
      </Section>

      {/* ════════ PASS Method ════════ */}
      <PassMethod />

      {/* ════════ Testimonials ════════ */}
      <Section
        eyebrow="Client confidence"
        title="What our clients say"
        description="Hear from facility managers, safety officers, and operations heads who trust Vellore Enterprises."
      >
        <div className="container-pro">
          <TestimonialCarousel />
        </div>
      </Section>

      {/* ════════ FAQ ════════ */}
      <Section
        eyebrow="Questions"
        title="Frequently asked questions"
        description="Common questions about our products, services, and support."
        className="bg-[#070707]"
      >
        <div className="container-narrow">
          <FAQAccordion />
        </div>
      </Section>

      {/* ════════ Emergency CTA ════════ */}
      <section className="py-6 bg-gradient-to-r from-[#9f1d0b]/20 via-[#f04418]/15 to-[#9f1d0b]/20 border-y border-[#f04418]/20">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🚨</span>
            <div>
              <p className="font-display text-lg font-bold">Fire safety emergency?</p>
              <p className="text-sm text-white/60">Call our 24/7 emergency line for immediate assistance</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button href={`tel:${COMPANY.phoneHref}`} variant="primary" className="btn-sm">
              Call {COMPANY.phoneDisplay}
            </Button>
            <Button href="/contact" variant="secondary" className="btn-sm">Contact us</Button>
          </div>
        </div>
      </section>

      {/* ════════ Contact CTA ════════ */}
      <section className="section-shell">
        <div className="container-pro glass-panel p-8 text-center md:p-12">
          <p className="eyebrow">Get started</p>
          <h2 className="heading-lg">Ready to secure your facility?</h2>
          <p className="section-copy mx-auto mt-5 max-w-2xl">
            Talk to our team for certified equipment, site surveys, installation, AMC, and 24/7 emergency support across Vellore and Tamil Nadu.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={`tel:${COMPANY.phoneHref}`} variant="primary">Call {COMPANY.phoneDisplay}</Button>
            <Button href="/contact" variant="secondary">Send message</Button>
          </div>
        </div>
      </section>
    </>
  );
}
