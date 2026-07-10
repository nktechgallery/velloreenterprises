'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { COMPANY, buildWhatsAppUrl } from '@/lib/constants';
import { Button } from '@/components/ui';

const initial = { name: '', phone: '', email: '', subject: '', message: '' };
const faqs = [
  ['How quickly do you respond?', 'Most enquiries receive a response within two business hours. Emergency support is available by phone.'],
  ['Do forms work without Firebase?', 'Yes. If Firestore is unavailable, the form opens a prepared WhatsApp message.'],
  ['Do you visit sites?', 'Yes. We provide site surveys and recommend equipment, installation, and AMC plans.'],
];

export default function ContactPage() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    if (!form.message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_enquiries'), { ...form, status: 'new', createdAt: serverTimestamp() });
      setSubmitted(true);
      setForm(initial);
      toast.success('Message sent. We will contact you shortly.');
    } catch {
      const message = `Hello Vellore Enterprises,\n\nNew contact enquiry:\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nSubject: ${form.subject}\nMessage: ${form.message}`;
      window.open(buildWhatsAppUrl(message), '_blank');
      setSubmitted(true);
      toast.success('Opening WhatsApp fallback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="hero-shell min-h-[70svh]">
        <div className="container-pro pt-16 text-center">
          <p className="eyebrow">Contact</p>
          <h1 className="heading-xl">Talk to a fire safety specialist.</h1>
          <p className="lead-copy mx-auto mt-6 max-w-3xl">Send a message, call directly, or reach us on WhatsApp for products, AMC, site surveys, and emergency fire safety support.</p>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="container-wide grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="space-y-5">
            {[
              ['Address', `${COMPANY.addressLine}, ${COMPANY.cityLine}`],
              ['Phone', `${COMPANY.phoneDisplay} / ${COMPANY.secondaryPhoneDisplay}`],
              ['Email', COMPANY.email],
              ['Hours', `${COMPANY.hours}. Emergency support available.`],
            ].map(([label, value]) => (
              <div key={label} className="card-premium p-6">
                <p className="eyebrow mb-2">{label}</p>
                <p className="text-lg leading-7 text-white/70">{value}</p>
              </div>
            ))}
            <div className="glass-panel overflow-hidden">
              <iframe
                title="Vellore Enterprises map"
                src="https://www.google.com/maps?q=Kangeyanallur%20Vellore%20Tamil%20Nadu%20632006&output=embed"
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="form-panel p-6 md:p-8">
            {submitted ? (
              <div className="grid min-h-[520px] place-items-center text-center">
                <div>
                  <div className="empty-orb">OK</div>
                  <h2 className="font-display text-3xl font-bold">Message received</h2>
                  <p className="mx-auto mt-3 max-w-md text-white/58">Our team will respond soon. For urgent requirements, call directly.</p>
                  <Button href={`tel:${COMPANY.phoneHref}`} className="mt-7">Call now</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5" noValidate>
                <div>
                  <p className="eyebrow">Enquiry form</p>
                  <h2 className="font-display text-3xl font-bold">Send your requirement</h2>
                </div>
                <Field label="Name" name="name" value={form.name} onChange={update} error={errors.name} required />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={update} error={errors.phone} required />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={update} />
                </div>
                <Field label="Subject" name="subject" value={form.subject} onChange={update} />
                <Field label="Message" name="message" value={form.message} onChange={update} error={errors.message} textarea required />
                <Button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send message'}</Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="section-shell bg-[#070707]">
        <div className="container-pro">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2 className="heading-md">Common contact questions</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {faqs.map(([q, a]) => <div key={q} className="card-premium p-6"><h3 className="font-display text-xl font-bold">{q}</h3><p className="mt-3 text-sm leading-6 text-white/58">{a}</p></div>)}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, value, onChange, error, textarea = false, type = 'text', required = false }) {
  const id = `contact-${name}`;
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
