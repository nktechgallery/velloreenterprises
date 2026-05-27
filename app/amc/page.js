'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

// metadata moved to layout - client component
const _metadata = {
  title: 'AMC Request | Annual Maintenance Contract',
  description: 'Request Annual Maintenance Contract for your fire safety systems in Vellore, Tamil Nadu. Expert fire system maintenance and inspections.',
};

const systemTypes = [
  'Fire Extinguishers', 'Fire Alarm System', 'Fire Hydrant System',
  'Fire Suppression System', 'Fire Sprinkler System', 'Multiple Systems',
];

const benefits = [
  { icon: '🔧', title: 'Regular Inspections', desc: 'Scheduled maintenance visits to keep systems compliant and functional.' },
  { icon: '⚡', title: 'Priority Service', desc: 'AMC clients get priority response for emergency calls and breakdowns.' },
  { icon: '📋', title: 'Compliance Reports', desc: 'Detailed maintenance reports for insurance and regulatory compliance.' },
  { icon: '💰', title: 'Cost Savings', desc: 'Prevent costly replacements through proactive maintenance care.' },
  { icon: '🛡️', title: 'System Reliability', desc: 'Ensure your fire systems perform flawlessly when it matters most.' },
  { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock helpline for AMC clients across Tamil Nadu.' },
];

export default function AmcPage() {
  const [form, setForm] = useState({
    companyName: '', contactPerson: '', phone: '', email: '',
    location: '', systemType: '', details: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.phone || !form.systemType) {
      toast.error('Please fill in required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'amc_requests'), { ...form, status: 'new', createdAt: serverTimestamp() });
      setSubmitted(true);
      toast.success('AMC request submitted successfully! We will contact you shortly.');
    } catch {
      // If Firebase not configured, send via WhatsApp
      const msg = `Hello Vellore Enterprises,\n\n*AMC Request*\n\nCompany: ${form.companyName}\nContact: ${form.contactPerson}\nPhone: ${form.phone}\nEmail: ${form.email}\nLocation: ${form.location}\nSystem Type: ${form.systemType}\nDetails: ${form.details}\n\nPlease get in touch regarding AMC services.`;
      window.open(`https://wa.me/918072264972?text=${encodeURIComponent(msg)}`, '_blank');
      setSubmitted(true);
      toast.success('Redirecting to WhatsApp...');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-16 bg-[#0d0d0d] border-b border-[rgba(201,162,39,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.4em] text-[#C9A227] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Annual Maintenance Contract
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Fire Safety <span className="text-gold-gradient">AMC Services</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Keep your fire safety systems in peak condition with our comprehensive Annual Maintenance Contracts. Serving Vellore and Tamil Nadu.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                Why Choose Our <span className="text-gold-gradient">AMC?</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {benefits.map(b => (
                  <div key={b.title} className="p-5 border border-[rgba(201,162,39,0.1)] hover:border-[rgba(201,162,39,0.3)] transition-colors">
                    <div className="text-2xl mb-3" aria-hidden="true">{b.icon}</div>
                    <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}>{b.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>

              {/* Pricing note */}
              <div className="p-6 border border-[rgba(201,162,39,0.2)] bg-[rgba(201,162,39,0.03)]">
                <h3 className="text-[#C9A227] font-bold text-sm mb-3 uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Customised AMC Packages
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Our AMC pricing is customised based on your system type, number of units, and service frequency. Contact us for a tailored quote.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {['Monthly Visits', 'Quarterly Visits', 'Half-Yearly Visits', 'Annual Visits'].map(t => (
                    <span key={t} className="px-3 py-1 border border-[rgba(201,162,39,0.2)] text-xs text-gray-400">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 border border-[rgba(201,162,39,0.2)] bg-[rgba(201,162,39,0.03)]">
                  <div className="text-6xl mb-6" aria-hidden="true">✅</div>
                  <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Request Submitted!</h2>
                  <p className="text-gray-400 mb-6">Our team will contact you within 24 hours to discuss your AMC requirements.</p>
                  <a href="tel:+918072264972" className="px-6 py-3 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-black font-bold tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    CALL: +91 80722 64972
                  </a>
                </div>
              ) : (
                <div className="border border-[rgba(201,162,39,0.15)] p-8 bg-[#111]">
                  <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Request AMC Quote</h2>
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="companyName" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          Company Name <span className="text-[#C9A227]" aria-label="required">*</span>
                        </label>
                        <input id="companyName" name="companyName" type="text" required value={form.companyName} onChange={handleChange}
                          className="input-premium w-full px-4 py-3 text-sm" placeholder="Your company name" />
                      </div>
                      <div>
                        <label htmlFor="contactPerson" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          Contact Person
                        </label>
                        <input id="contactPerson" name="contactPerson" type="text" value={form.contactPerson} onChange={handleChange}
                          className="input-premium w-full px-4 py-3 text-sm" placeholder="Your name" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          Phone <span className="text-[#C9A227]" aria-label="required">*</span>
                        </label>
                        <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange}
                          className="input-premium w-full px-4 py-3 text-sm" placeholder="+91 XXXXX XXXXX" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          Email Address
                        </label>
                        <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                          className="input-premium w-full px-4 py-3 text-sm" placeholder="your@email.com" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Location / Address
                      </label>
                      <input id="location" name="location" type="text" value={form.location} onChange={handleChange}
                        className="input-premium w-full px-4 py-3 text-sm" placeholder="Your premises location" />
                    </div>
                    <div>
                      <label htmlFor="systemType" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Type of Fire System <span className="text-[#C9A227]" aria-label="required">*</span>
                      </label>
                      <select id="systemType" name="systemType" required value={form.systemType} onChange={handleChange}
                        className="input-premium w-full px-4 py-3 text-sm bg-[#0a0a0a]">
                        <option value="">Select system type</option>
                        {systemTypes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="details" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        AMC Requirements & Details
                      </label>
                      <textarea id="details" name="details" rows={4} value={form.details} onChange={handleChange}
                        className="input-premium w-full px-4 py-3 text-sm resize-none" placeholder="Number of units, specific requirements, current system status..." />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-black font-bold tracking-widest hover:from-[#F5D76E] hover:to-[#C9A227] transition-all duration-300 btn-shimmer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.15em' }}>
                      {submitting ? 'SUBMITTING...' : 'SUBMIT AMC REQUEST'}
                    </button>
                    <p className="text-xs text-gray-600 text-center">
                      Or call us directly: <a href="tel:+918072264972" className="text-[#C9A227] hover:underline">+91 80722 64972</a>
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
