'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill in required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_enquiries'), { ...form, status: 'new', createdAt: serverTimestamp() });
      setSubmitted(true);
      toast.success('Message sent! We will contact you shortly.');
    } catch {
      const msg = `Hello Vellore Enterprises,\n\nNew Contact Enquiry:\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nSubject: ${form.subject}\nMessage: ${form.message}`;
      window.open(`https://wa.me/918072264972?text=${encodeURIComponent(msg)}`, '_blank');
      setSubmitted(true);
      toast.success('Redirecting to WhatsApp...');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="pt-28 pb-16 bg-[#0d0d0d] border-b border-[rgba(201,162,39,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.4em] text-[#C9A227] uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Get In Touch
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Contact <span className="text-gold-gradient">Us</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a question or need a fire safety solution? Reach out to us — we respond within 2 hours.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                Let's <span className="text-gold-gradient">Talk</span>
              </h2>
              <div className="space-y-6 mb-10">
                {[
                  { icon: '📍', title: 'Address', lines: ['164, Vellore Road, Kangeyanallur,', 'Vellore, Tamil Nadu – 632006'] },
                  { icon: '📞', title: 'Phone', lines: ['+91 80722 64972', '+91 90874 05584'] },
                  { icon: '✉️', title: 'Email', lines: ['velloreenterprises7@gmail.com'] },
                  { icon: '🕐', title: 'Hours', lines: ['Mon – Sat: 9:00 AM – 6:00 PM', '24/7 Emergency Support Available'] },
                ].map(item => (
                  <div key={item.title} className="flex gap-4 p-5 border border-[rgba(201,162,39,0.1)] hover:border-[rgba(201,162,39,0.3)] transition-colors">
                    <span className="text-2xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
                    <div>
                      <h3 className="text-[#C9A227] font-bold text-sm mb-1 uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.title}</h3>
                      {item.lines.map((l, i) => <p key={i} className="text-gray-400 text-sm">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="https://wa.me/918072264972"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold tracking-wider transition-all duration-300 btn-shimmer"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
              >
                💬 CHAT ON WHATSAPP
              </a>
            </div>

            {/* Form */}
            <div>
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 border border-[rgba(201,162,39,0.2)] bg-[rgba(201,162,39,0.03)]">
                  <div className="text-6xl mb-6" aria-hidden="true">✅</div>
                  <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Message Received!</h2>
                  <p className="text-gray-400 mb-6">Our team will get back to you within 2 hours.</p>
                  <a href="tel:+918072264972" className="px-6 py-3 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-black font-bold tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    CALL: +91 80722 64972
                  </a>
                </div>
              ) : (
                <div className="border border-[rgba(201,162,39,0.15)] p-8 bg-[#111]">
                  <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          Name <span className="text-[#C9A227]">*</span>
                        </label>
                        <input id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                          className="input-premium w-full px-4 py-3 text-sm" placeholder="Your name" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          Phone <span className="text-[#C9A227]">*</span>
                        </label>
                        <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange}
                          className="input-premium w-full px-4 py-3 text-sm" placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Email
                      </label>
                      <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                        className="input-premium w-full px-4 py-3 text-sm" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Subject
                      </label>
                      <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange}
                        className="input-premium w-full px-4 py-3 text-sm" placeholder="How can we help?" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-xs text-gray-400 mb-2 tracking-wider uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Message <span className="text-[#C9A227]">*</span>
                      </label>
                      <textarea id="message" name="message" rows={5} required value={form.message} onChange={handleChange}
                        className="input-premium w-full px-4 py-3 text-sm resize-none" placeholder="Tell us about your fire safety requirements..." />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-black font-bold tracking-widest hover:from-[#F5D76E] hover:to-[#C9A227] transition-all duration-300 btn-shimmer disabled:opacity-50"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.15em' }}>
                      {submitting ? 'SENDING...' : 'SEND MESSAGE'}
                    </button>
                    <p className="text-xs text-gray-600 text-center">
                      Or call us: <a href="tel:+918072264972" className="text-[#C9A227] hover:underline">+91 80722 64972</a>
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
