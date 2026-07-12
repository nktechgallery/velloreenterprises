import { COMPANY, INDUSTRIES, SERVICES } from '@/lib/constants';
import { Button, MetricCard, Section } from '@/components/ui';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title:'About Vellore Enterprises — Fire Safety Expertise', description:'Learn about Vellore Enterprises, our fire-protection experience, certified equipment approach, maintenance capabilities, industries served, and Vellore service coverage.', path:'/about', keywords:['about Vellore Enterprises','fire safety expertise Vellore','BIS fire safety products'] });

const values = [
  ['Precision', 'Every recommendation is tied to site risk, compliance needs, and long-term maintainability.'],
  ['Reliability', 'We prioritize equipment readiness, documentation, and fast service response.'],
  ['Clarity', 'Clients receive practical guidance, transparent communication, and clear next steps.'],
];

const milestones = [
  ['Foundation', 'Built to serve Vellore businesses with dependable fire protection products.'],
  ['Expansion', 'Added AMC, refilling, hydrant, alarm, and suppression system capabilities.'],
  ['Digital operations', 'Realtime catalog management, online enquiries, and faster customer response.'],
  ['Today', 'End-to-end fire safety partner for facilities across Tamil Nadu.'],
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{name:'Home',path:'/'},{name:'About',path:'/about'}])} />
      <section className="hero-shell min-h-[76svh]">
        <div className="container-wide grid items-center gap-10 pt-16 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="eyebrow">About {COMPANY.name}</p>
            <h1 className="heading-xl">A fire safety partner built for trust.</h1>
            <p className="lead-copy mt-6 max-w-2xl">We help homes, businesses, institutions, and industrial sites reduce fire risk through certified equipment, practical service, and disciplined maintenance.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact">Talk to our team</Button>
              <Button href="/products" variant="secondary">Explore products</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard value="500+" label="Clients served" detail="Across Vellore and Tamil Nadu" />
            <MetricCard value="1000+" label="Systems supported" detail="Products, installs, and AMC" />
            <MetricCard value="24/7" label="Support" detail="Emergency response channel" />
            <MetricCard value="4+" label="Years" detail="Fire safety service experience" />
          </div>
        </div>
      </section>

      <Section eyebrow="Purpose" title="Safety is the operating system" description="Our mission, vision, and values are built around one practical belief: protection has to work before an emergency, during an emergency, and after every inspection.">
        <div className="container-pro grid gap-5 md:grid-cols-3">
          {values.map(([title, text]) => (
            <div key={title} className="card-premium p-7">
              <h2 className="font-display text-3xl font-bold">{title}</h2>
              <p className="mt-4 leading-7 text-white/58">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="History" title="From product supply to complete protection lifecycle" className="bg-[#070707]">
        <div className="container-pro grid gap-4 md:grid-cols-4">
          {milestones.map(([title, text], index) => (
            <div key={title} className="glass-panel p-6">
              <span className="font-condensed text-4xl font-black text-[#f5d76e]">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-6 font-display text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Coverage" title="Industries and services we support" description="Our team serves facilities where safety, uptime, and compliance have to work together.">
        <div className="container-wide grid gap-6 lg:grid-cols-2">
          <div className="glass-panel p-7">
            <h2 className="font-display text-3xl font-bold">Industries</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {INDUSTRIES.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white/68">{item}</div>)}
            </div>
          </div>
          <div className="glass-panel p-7">
            <h2 className="font-display text-3xl font-bold">Capabilities</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SERVICES.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white/68">{item}</div>)}
            </div>
          </div>
        </div>
      </Section>

      <section className="section-shell bg-[#070707]">
        <div className="container-pro glass-panel p-8 text-center md:p-12">
          <p className="eyebrow">Why choose us</p>
          <h2 className="heading-md">Certified products, accountable service, and clear communication.</h2>
          <p className="section-copy mx-auto mt-4 max-w-2xl">We combine local availability with professional processes: assessment, product selection, installation, documentation, and maintenance.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/amc">Request AMC</Button>
            <Button href={`tel:${COMPANY.phoneHref}`} variant="secondary">{COMPANY.phoneDisplay}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
