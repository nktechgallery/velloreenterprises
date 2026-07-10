'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { COMPANY, INDUSTRIES, buildWhatsAppUrl } from '@/lib/constants';
import { Button, Section } from '@/components/ui';

const initial = {
  companyName: '',
  contactPerson: '',
  phone: '',
  email: '',
  location: '',
  systemType: '',
  details: '',
};

const systemTypes = [
  'Fire Extinguishers',
  'Fire Alarm System',
  'Fire Hydrant System',
  'Fire Suppression System',
  'Fire Sprinkler System',
  'Multiple Systems',
];

const packages = [
  ['Essential', 'For small offices, shops, and residential facilities', ['Annual inspection', 'Basic readiness report', 'Refilling coordination']],
  ['Professional', 'For commercial buildings and institutions', ['Quarterly service', 'Compliance documentation', 'Priority support']],
  ['Enterprise', 'For factories, campuses, and multi-system sites', ['Custom visit schedule', 'Asset register', 'Emergency response planning']],
];

const process = [
  ['Request', 'Submit site and system details.'],
  ['Assess', 'We evaluate quantity, location, and risk profile.'],
  ['Plan', 'You receive a tailored AMC scope and service frequency.'],
  ['Maintain', 'Scheduled visits, reports, and priority response begin.'],
];

export default function AmcPage() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const validate = () => {
    const next = {};
    if (!form.companyName.trim()) next.companyName = 'Company name is required';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    if (!form.systemType) next.systemType = 'System type is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'amc_requests'), { ...form, status: 'new', createdAt: serverTimestamp() });
      setSubmitted(true);
      setForm(initial);
      toast.success('AMC request submitted successfully.');
    } catch {
      const message = `Hello Vellore Enterprises,\n\nAMC Request\n\nCompany: ${form.companyName}\nContact: ${form.contactPerson}\nPhone: ${form.phone}\nEmail: ${form.email}\nLocation: ${form.location}\nSystem Type: ${form.systemType}\nDetails: ${form.details}`;
      window.open(buildWhatsAppUrl(message), '_blank');
      setSubmitted(true);
      toast.success('Opening WhatsApp fallback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="hero-shell min-h-[74svh]">
        <div className="container-pro pt-16 text-center">
          <p className="eyebrow">Annual maintenance contracts</p>
          <h1 className="heading-xl">Keep protection systems inspection-ready.</h1>
          <p className="lead-copy mx-auto mt-6 max-w-3xl">AMC programs for extinguishers, alarms, hydrants, sprinklers, suppression systems, and multi-site fire safety operations.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="#amc-form">Request quote</Button>
            <Button href={`tel:${COMPANY.phoneHref}`} variant="secondary">{COMPANY.phoneDisplay}</Button>
          </div>
        </div>
      </section>

      <Section eyebrow="Plans" title="Service models tailored to site risk" description="AMC pricing depends on system type, quantity, visit frequency, location, and documentation requirements.">
        <div className="container-pro grid gap-5 md:grid-cols-3">
          {packages.map(([title, desc, points]) => (
            <div key={title} className="card-premium p-7">
              <h2 className="font-display text-3xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/58">{desc}</p>
              <ul className="mt-6 space-y-3 text-sm text-white/68">
                {points.map((point) => <li key={point} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#c9a227]" />{point}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Process" title="From request to recurring maintenance" className="bg-[#070707]">
        <div className="container-pro grid gap-4 md:grid-cols-4">
          {process.map(([title, text], index) => (
            <div key={title} className="glass-panel p-6">
              <span className="font-condensed text-4xl font-black text-[#f5d76e]">{index + 1}</span>
              <h3 className="mt-6 font-display text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <section id="amc-form" className="section-shell">
        <div className="container-wide grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Who we maintain</p>
            <h2 className="heading-md">AMC coverage for high-responsibility sites.</h2>
            <p className="mt-5 leading-7 text-white/60">We support routine checks, refilling, readiness reports, and service planning for facilities where downtime and non-compliance create real risk.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {INDUSTRIES.map((industry) => <div key={industry} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white/68">{industry}</div>)}
            </div>
          </div>

          <div className="form-panel p-6 md:p-8">
            {submitted ? (
              <div className="grid min-h-[560px] place-items-center text-center">
                <div>
                  <div className="empty-orb">OK</div>
                  <h2 className="font-display text-3xl font-bold">AMC request submitted</h2>
                  <p className="mx-auto mt-3 max-w-md text-white/58">Our team will review your details and contact you with the next step.</p>
                  <Button href={`tel:${COMPANY.phoneHref}`} className="mt-7">Call now</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5" noValidate>
                <div>
                  <p className="eyebrow">Request quote</p>
                  <h2 className="font-display text-3xl font-bold">Tell us about your site</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Company name" name="companyName" value={form.companyName} onChange={update} error={errors.companyName} required />
                  <Field label="Contact person" name="contactPerson" value={form.contactPerson} onChange={update} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={update} error={errors.phone} required />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={update} />
                </div>
                <Field label="Location" name="location" value={form.location} onChange={update} />
                <div>
                  <label htmlFor="systemType" className="admin-label">System type <span className="text-[#f5d76e]">*</span></label>
                  <select id="systemType" name="systemType" value={form.systemType} onChange={update} className="input-premium select-premium" aria-invalid={Boolean(errors.systemType)}>
                    <option value="">Select system type</option>
                    {systemTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                  {errors.systemType && <p className="mt-2 text-sm text-[#ffb199]">{errors.systemType}</p>}
                </div>
                <Field label="AMC requirements" name="details" value={form.details} onChange={update} textarea />
                <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit AMC request'}</Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, value, onChange, error, textarea = false, type = 'text', required = false }) {
  const id = `amc-${name}`;
  return (
    <div>
      <label htmlFor={id} className="admin-label">{label} {required && <span className="text-[#f5d76e]">*</span>}</label>
      {textarea ? (
        <textarea id={id} name={name} rows={5} value={value} onChange={onChange} className="input-premium resize-none" aria-invalid={Boolean(error)} />
      ) : (
        <input id={id} name={name} type={type} value={value} onChange={onChange} className="input-premium" aria-invalid={Boolean(error)} />
      )}
      {error && <p className="mt-2 text-sm text-[#ffb199]">{error}</p>}
    </div>
  );
}
