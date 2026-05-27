import Link from 'next/link';

export const metadata = {
  title: 'About Us | Vellore Enterprises Fire Safety',
  description: 'Learn about Vellore Enterprises – your trusted fire safety partner in Vellore, Tamil Nadu. Expert team, certified products, and 24/7 support.',
};

const values = [
  { icon: '🎯', title: 'Our Mission', text: 'To provide every home, business, and industry in Vellore and Tamil Nadu with reliable, affordable, and certified fire safety solutions that protect lives and property.' },
  { icon: '🔭', title: 'Our Vision', text: 'To be the most trusted and comprehensive fire safety solutions provider in Tamil Nadu, setting benchmarks in quality, service, and customer satisfaction.' },
  { icon: '💎', title: 'Our Values', text: 'Integrity, reliability, and unwavering commitment to quality. We treat every client\'s safety as our personal responsibility.' },
];

const team_strengths = [
  'Certified Fire Safety Professionals', 'BIS & IS Standard Products', 'Hands-On Installation Teams',
  'Trained Maintenance Engineers', 'Customer-First Approach', 'Transparent Pricing',
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-16 bg-[#0d0d0d] border-b border-[rgba(201,162,39,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.4em] text-[#C9A227] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                About Vellore Enterprises
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your Trusted <span className="text-gold-gradient">Fire Safety</span> Partner
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Vellore Enterprises is a leading fire safety and fire protection solutions company based in Vellore, Tamil Nadu. We provide end-to-end fire safety services – from supply and installation to maintenance and audits.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: '500+', l: 'Happy Clients' }, { n: '10+', l: 'Years of Experience' },
                { n: '1000+', l: 'Systems Installed' }, { n: '24/7', l: 'Emergency Support' },
              ].map(s => (
                <div key={s.l} className="p-6 border border-[rgba(201,162,39,0.15)] bg-[#111] text-center">
                  <div className="text-3xl font-black text-gold-gradient mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.n}</div>
                  <div className="text-xs text-gray-500 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Company <span className="text-gold-gradient">Overview</span>
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Founded with a passion for public safety, Vellore Enterprises has grown into one of Vellore district's most reliable fire safety solution providers. We serve a diverse clientele including factories, hospitals, educational institutions, residential complexes, government buildings, and commercial establishments.
            </p>
            <p className="text-gray-500 leading-relaxed mt-4">
              Our team of certified fire safety professionals brings deep expertise in fire risk assessment, system design, installation, and ongoing maintenance. We are committed to ensuring every client receives solutions that meet the highest standards of safety and compliance.
            </p>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {values.map(v => (
              <div key={v.title} className="p-8 border border-[rgba(201,162,39,0.12)] bg-[#111] text-center">
                <div className="text-4xl mb-4" aria-hidden="true">{v.icon}</div>
                <h3 className="text-xl font-bold text-[#C9A227] mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}>{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Why Choose <span className="text-gold-gradient">Us?</span>
              </h2>
              <div className="space-y-3 mb-8">
                {[
                  { icon: '🏆', t: 'Expert Team & Reliable Service', d: 'Our trained professionals handle every project with precision and care.' },
                  { icon: '✅', t: 'High-Quality Equipment', d: 'We supply only BIS certified, IS standard fire safety products.' },
                  { icon: '💰', t: 'Affordable Pricing', d: 'Competitive rates with no compromise on quality or safety standards.' },
                  { icon: '🚨', t: '24/7 Emergency Support', d: 'Available round the clock for emergencies and urgent service calls.' },
                  { icon: '🔧', t: 'Complete End-to-End Service', d: 'From assessment and design to installation, maintenance, and audits.' },
                  { icon: '📜', t: 'Compliance Assured', d: 'All our installations meet local fire safety regulations and standards.' },
                ].map(item => (
                  <div key={item.t} className="flex gap-4 p-4 hover:bg-[rgba(201,162,39,0.03)] transition-colors">
                    <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{item.icon}</span>
                    <div>
                      <div className="text-white font-semibold text-sm mb-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.t}</div>
                      <div className="text-gray-500 text-xs">{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Safety commitment */}
              <div className="p-8 border border-[rgba(201,162,39,0.2)] bg-[rgba(201,162,39,0.03)]">
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Our Safety <span className="text-gold-gradient">Commitment</span>
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  At Vellore Enterprises, safety is not just our business – it's our commitment to the community. We believe every life deserves the protection of reliable fire safety systems.
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Every product we supply, every system we install, and every service we provide is backed by our unwavering dedication to quality and compliance.
                </p>
              </div>

              {/* Team strengths */}
              <div className="p-8 bg-[#111] border border-[rgba(255,255,255,0.04)]">
                <h3 className="text-lg font-bold text-white mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}>
                  OUR STRENGTHS
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {team_strengths.map(s => (
                    <div key={s} className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] flex-shrink-0" aria-hidden="true" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-black font-bold tracking-widest hover:from-[#F5D76E] hover:to-[#C9A227] transition-all duration-300 btn-shimmer"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.15em' }}
              >
                GET IN TOUCH
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services we cover */}
      <section className="py-16 bg-[#0d0d0d] border-t border-[rgba(201,162,39,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
            What We <span className="text-gold-gradient">Cover</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Fire Extinguishers', 'Fire Alarm Systems', 'Fire Hydrant Systems', 'Fire Suppression Systems', 'Fire Stop Solutions', 'Fire Safety AMC', 'Extinguisher Refilling', 'Fire Safety Audits', 'Fire Safety Training', 'Emergency Safety Solutions', 'Fire Pumps & Panels', 'Sprinkler Systems'].map(s => (
              <span key={s} className="px-4 py-2 border border-[rgba(201,162,39,0.2)] text-sm text-gray-400 hover:text-[#C9A227] hover:border-[#C9A227] transition-colors cursor-default">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
