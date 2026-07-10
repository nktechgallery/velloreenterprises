import './globals.css';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
// import ErrorBoundary from '@/components/ErrorBoundary';
import dynamic from 'next/dynamic';
import { COMPANY, SERVICES } from '@/lib/constants';

import CommandPalette from '@/components/CommandPalette';

export const metadata = {
  metadataBase: new URL(COMPANY.domain),
  title: {
    default: `${COMPANY.name} | Fire Safety Solutions in Vellore`,
    template: `%s | ${COMPANY.name}`,
  },
  description:
    'Premium fire safety solutions in Vellore and Tamil Nadu: fire extinguishers, alarm systems, hydrants, suppression systems, AMC services, audits, and emergency support.',
  keywords: [
    'fire safety company in Vellore',
    'fire extinguisher supplier Vellore',
    'fire alarm system installation Vellore',
    'fire AMC services Tamil Nadu',
    'fire equipment dealers Vellore',
    'fire suppression systems Tamil Nadu',
    'fire hydrant system Vellore',
    'fire safety audit Vellore',
  ],
  authors: [{ name: COMPANY.name }],
  creator: COMPANY.name,
  publisher: COMPANY.name,
  alternates: { canonical: COMPANY.domain },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: COMPANY.domain,
    siteName: COMPANY.name,
    title: `${COMPANY.name} | Premium Fire Safety Solutions`,
    description: 'Certified fire protection equipment, installations, AMC and audits for modern facilities across Tamil Nadu.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: `${COMPANY.name} fire safety solutions` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${COMPANY.name} | Fire Safety Solutions`,
    description: 'Fire protection products, AMC and emergency support in Vellore, Tamil Nadu.',
    images: ['/og-image.jpg'],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: COMPANY.name,
  description: 'Fire safety and fire protection solutions company in Vellore, Tamil Nadu.',
  url: COMPANY.domain,
  telephone: COMPANY.phoneHref,
  email: COMPANY.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.addressLine,
    addressLocality: 'Vellore',
    addressRegion: 'Tamil Nadu',
    postalCode: '632006',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 12.9165, longitude: 79.1325 },
  openingHours: 'Mo-Sa 09:00-18:00',
  priceRange: 'INR',
  image: `${COMPANY.domain}/og-image.jpg`,
  sameAs: [COMPANY.instagram],
  makesOffer: SERVICES.map((service) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service } })),
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What types of fire safety equipment do you supply?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We supply fire extinguishers (CO2, ABC, foam, water), fire alarm systems, hydrant networks, suppression systems, fire stop solutions, and safety gear from certified manufacturers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide installation services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We offer end-to-end installation for fire alarm systems, hydrant networks, suppression systems, and all related fire safety infrastructure.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas do you serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We primarily serve Vellore, Kangeyanallur, and surrounding areas in Tamil Nadu. For larger projects, we extend coverage across Tamil Nadu.',
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050505" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="noise-layer">
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <CartProvider>
          <div className="layout-boundary">
            <main id="main-content">{children}</main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3600,
              style: {
                background: 'rgba(12,12,12,0.92)',
                color: '#f8f5ea',
                border: '1px solid rgba(201,162,39,0.28)',
                borderRadius: '16px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
                backdropFilter: 'blur(18px)',
              },
              success: { iconTheme: { primary: '#C9A227', secondary: '#050505' } },
              error: { iconTheme: { primary: '#F04418', secondary: '#050505' } },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
