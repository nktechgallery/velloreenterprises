'use client';

import { useState } from 'react';

const defaultFaqs = [
  {
    q: 'What types of fire safety equipment do you supply?',
    a: 'We supply a comprehensive range including fire extinguishers (CO2, ABC, foam, water), fire alarm systems, hydrant networks, suppression systems, fire stop solutions, and safety gear. All products are sourced from certified manufacturers.',
  },
  {
    q: 'Do you provide installation services?',
    a: 'Yes. We offer end-to-end installation for fire alarm systems, hydrant networks, suppression systems, and all related fire safety infrastructure. Our team handles site survey, design, installation, testing, and handover.',
  },
  {
    q: 'What is covered under your AMC plans?',
    a: 'Our Annual Maintenance Contracts cover scheduled inspections, equipment testing, refilling and pressure testing of extinguishers, compliance documentation, priority emergency support, and detailed service reports.',
  },
  {
    q: 'Which areas do you serve?',
    a: 'We primarily serve Vellore, Kangeyanallur, and surrounding areas in Tamil Nadu. For larger projects, we extend coverage across Tamil Nadu with dedicated project teams.',
  },
  {
    q: 'How do I get a quote?',
    a: 'You can request a quote through our contact form, WhatsApp, or by calling us directly. We typically respond within two business hours with a detailed proposal based on your requirements.',
  },
  {
    q: 'Do you offer 24/7 emergency support?',
    a: 'Yes. Our emergency support line is available 24/7 for urgent fire safety requirements, equipment failures, and emergency refilling services. Call us or reach out on WhatsApp for immediate assistance.',
  },
];

export default function FAQAccordion({ faqs = defaultFaqs }) {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="space-y-3" role="region" aria-label="Frequently asked questions">
      {faqs.map((faq, i) => (
        <div
          key={faq.q}
          className="faq-item"
          data-open={openIndex === i}
        >
          <button
            className="faq-trigger"
            onClick={() => toggle(i)}
            aria-expanded={openIndex === i}
            aria-controls={`faq-content-${i}`}
            id={`faq-trigger-${i}`}
          >
            <span>{faq.q}</span>
            <span className="faq-icon" aria-hidden="true">+</span>
          </button>
          <div
            className="faq-content"
            id={`faq-content-${i}`}
            role="region"
            aria-labelledby={`faq-trigger-${i}`}
          >
            <div className="faq-content-inner">{faq.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
