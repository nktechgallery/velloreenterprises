'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import PassMethod from '@/components/PassMethod';

const Hero3D = dynamic(() => import('@/components/Hero3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="spinner" role="status" aria-label="Loading 3D model" />
    </div>
  ),
});

const services = [
  { icon: '🧯', title: 'Fire Extinguishers', desc: 'CO₂, ABC Powder, AFFF Foam, Water – complete range for every fire class.', href: '/products' },
  { icon: '🚨', title: 'Fire Alarm Systems', desc: 'Smart detection systems with control panels, smoke detectors & call points.', href: '/products' },
  { icon: '🚒', title: 'Fire Hydrant Systems', desc: 'Complete hydrant equipment including hoses, nozzles, valves and pumps.', href: '/products' },
  { icon: '💨', title: 'Fire Suppression', desc: 'Automatic suppression systems for server rooms, kitchens & industrial use.', href: '/products' },
  { icon: '🔧', title: 'Fire Safety AMC', desc: 'Annual Maintenance Contracts ensuring your systems stay compliant & ready.', href: '/amc' },
  { icon: '🔍', title: 'Fire Safety Audits', desc: 'Comprehensive audits to identify risks and ensure regulatory compliance.', href: '/contact' },
];

const stats = [
  { number: '500+', label: 'Clients Served', suffix: '' },
  { number: '10+', label: 'Years Experience', suffix: '' },
  { number: '24/7', label: 'Emergency Support', suffix: '' },
  { number: '100%', label: 'Safety Compliant', suffix: '' },
];

function StatCard({ stat, index }) {
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true });
  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="stat-counter text-4xl lg:text-5xl text-gold-gradient mb-1">{stat.number}</div>
      <div className="text-xs tracking-[0.25em] text-gray-400 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{stat.label}</div>
    </div>
  );
}

function ServiceCard({ service, index }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  return (
    <div
      ref={ref}
      className={`card-premium p-7 group cursor-pointer transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Link href={service.href}>
        <div className="text-3xl mb-4" aria-hidden="true">{service.icon}</div>
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#C9A227] transition-colors"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}>
          {service.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
        <div className="mt-5 flex items-center gap-2 text-[#C9A227] text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          LEARN MORE <span aria-hidden="true">→</span>
        </div>
      </Link>
    </div>
  );
}

export default function HomePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <>
      {/* Hero Section */}
      <section className="hero-bg min-h-screen relative overflow-hidden flex items-center" aria-label="Hero section">
        {/* Animated background particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-[rgba(201,162,39,0.3)] to-transparent"
              style={{
                left: `${10 + i * 12}%`,
                height: `${40 + i * 8}%`,
                top: `${5 + i * 8}%`,
                animationName: 'float',
                animationDuration: `${6 + i * 1.2}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${i * 0.8}s`,
                opacity: 0.3,
              }}
            />
          ))}
          <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse,rgba(201,162,39,0.06)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 left-1/4 w-1/3 h-1/3 bg-[radial-gradient(ellipse,rgba(204,34,0,0.05)_0%,transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:pt-28 lg:pb-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">
            {/* Content */}
            <div ref={heroRef} className={`z-10 transition-all duration-1000 ${heroInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-[rgba(201,162,39,0.3)] bg-[rgba(201,162,39,0.05)] mb-8">
                <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" aria-hidden="true" />
                <span className="text-[#C9A227] text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Vellore's Trusted Fire Safety Partner
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Protecting{' '}
                <em className="text-gold-gradient not-italic">Lives</em>{' '}
                Through Advanced{' '}
                <span className="text-fire-gradient">Fire Safety</span>
              </h1>

              <p className="text-gray-400 text-lg lg:text-xl leading-relaxed mb-8 max-w-xl">
                Complete fire protection solutions for industries, businesses, and homes across Vellore and Tamil Nadu. From extinguishers to full system installations.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-black font-bold text-sm tracking-wider hover:from-[#F5D76E] hover:to-[#C9A227] transition-all duration-300 btn-shimmer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
                >
                  <span aria-hidden="true">🧯</span> ORDER PRODUCTS
                </Link>
                <Link
                  href="/amc"
                  className="inline-flex items-center gap-2 px-7 py-4 border border-[rgba(201,162,39,0.4)] text-[#C9A227] font-bold text-sm tracking-wider hover:bg-[rgba(201,162,39,0.1)] hover:border-[#C9A227] transition-all duration-300"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
                >
                  <span aria-hidden="true">📋</span> REQUEST AMC
                </Link>
                <a
                  href="tel:+918072264972"
                  className="inline-flex items-center gap-2 px-7 py-4 border border-[rgba(255,255,255,0.1)] text-gray-300 font-bold text-sm tracking-wider hover:border-white hover:text-white transition-all duration-300"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
                >
                  <span aria-hidden="true">📞</span> CONTACT US
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-5 text-xs text-gray-500">
                {['IS Certified Products', 'BIS Approved', '24/7 Support', 'Free Site Survey'].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5">
                    <span className="text-[#C9A227]" aria-hidden="true">✓</span> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 3D Model */}
            <div
              className="relative z-10 h-[50vh] sm:h-[60vh] lg:h-[85vh]"
              aria-label="Interactive 3D fire extinguisher - drag to rotate"
            >
              <Hero3D />
              {/* Interaction hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <p className="text-[10px] tracking-[0.2em] text-gray-600 uppercase animate-pulse" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Drag to rotate
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" aria-hidden="true">
          <div className="w-px h-12 bg-gradient-to-b from-[#C9A227] to-transparent animate-pulse" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 bg-[#0d0d0d] border-y border-[rgba(201,162,39,0.1)]" aria-label="Company statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a]" aria-label="Our services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] text-[#C9A227] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              What We Offer
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Complete Fire Safety <span className="text-gold-gradient">Solutions</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From portable extinguishers to complete fire suppression systems – we deliver comprehensive protection for every requirement.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(201,162,39,0.06)]">
            {services.map((s, i) => <ServiceCard key={i} service={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* PASS Method */}
      <PassMethod />

      {/* Why Choose Us */}
      <section className="py-24 lg:py-32 bg-[#0d0d0d]" aria-label="Why choose Vellore Enterprises">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.4em] text-[#C9A227] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Your Safety, Our Priority
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Why Choose <span className="text-gold-gradient">Vellore Enterprises?</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                With years of expertise in fire safety, we deliver reliable, certified fire protection solutions backed by expert service and 24/7 emergency support.
              </p>
              <div className="space-y-4">
                {[
                  { icon: '🏆', title: 'Expert Team', desc: 'Trained and certified fire safety professionals with hands-on experience.' },
                  { icon: '✅', title: 'High-Quality Equipment', desc: 'BIS certified products meeting all Indian and international safety standards.' },
                  { icon: '💰', title: 'Affordable Pricing', desc: 'Competitive pricing without compromising on quality or service.' },
                  { icon: '🚨', title: '24/7 Emergency Support', desc: 'Round-the-clock availability for emergencies and urgent requirements.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 border border-[rgba(201,162,39,0.1)] hover:border-[rgba(201,162,39,0.3)] transition-colors">
                    <span className="text-2xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}>{item.title}</h3>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="relative">
              <div className="border border-[rgba(201,162,39,0.2)] bg-[rgba(201,162,39,0.03)] p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.05)_0%,transparent_70%)]" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="text-5xl mb-6" aria-hidden="true">🛡️</div>
                  <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Get a Free <span className="text-gold-gradient">Site Survey</span>
                  </h3>
                  <p className="text-gray-400 mb-8">
                    Let our experts assess your premises and recommend the right fire safety solutions tailored to your needs.
                  </p>
                  <div className="space-y-4">
                    <a
                      href="tel:+918072264972"
                      className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-black font-bold tracking-wider hover:from-[#F5D76E] hover:to-[#C9A227] transition-all duration-300 btn-shimmer"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
                    >
                      📞 +91 80722 64972
                    </a>
                    <Link
                      href="/contact"
                      className="flex items-center justify-center gap-2 w-full py-4 border border-[rgba(201,162,39,0.3)] text-[#C9A227] font-bold tracking-wider hover:bg-[rgba(201,162,39,0.1)] transition-all duration-300"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
                    >
                      SEND MESSAGE
                    </Link>
                  </div>
                  <p className="text-gray-600 text-xs mt-6">No commitment required • Response within 2 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency CTA Banner */}
      <section className="py-10 bg-gradient-to-r from-[#1a0500] via-[#2a0800] to-[#1a0500] border-y border-[rgba(204,34,0,0.3)]" aria-label="Emergency contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl animate-pulse" aria-hidden="true">🚨</span>
              <div>
                <p className="text-white font-bold text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}>
                  24/7 Emergency Fire Safety Support
                </p>
                <p className="text-gray-400 text-sm">Immediate response for fire safety emergencies across Vellore</p>
              </div>
            </div>
            <a
              href="tel:+918072264972"
              className="flex-shrink-0 px-8 py-4 bg-[#CC2200] hover:bg-[#ee2600] text-white font-bold tracking-wider transition-colors btn-shimmer text-lg"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.15em' }}
            >
              CALL NOW: +91 80722 64972
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
