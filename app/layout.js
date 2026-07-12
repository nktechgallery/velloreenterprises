import './globals.css';
import ToasterProvider from '@/components/ToasterProvider';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
// import ErrorBoundary from '@/components/ErrorBoundary';
import dynamic from 'next/dynamic';
import { COMPANY, SERVICES } from '@/lib/constants';

import CommandPalette from '@/components/CommandPalette';
import ExperienceLayer from '@/components/ExperienceLayer';
import SupportChat from '@/components/SupportChat';
import SiteAnalytics from '@/components/SiteAnalytics';
import PwaRegistration from '@/components/PwaRegistration';
import GuideRobot from '@/components/GuideRobot';
import JsonLd from '@/components/JsonLd';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], display: 'swap', variable: '--font-outfit' });

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
  applicationName: COMPANY.name,
  category: 'Fire Safety and Protection',
  formatDetection: { email: false, address: false, telephone: false },
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
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${COMPANY.name} fire safety solutions` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${COMPANY.name} | Fire Safety Solutions`,
    description: 'Fire protection products, AMC and emergency support in Vellore, Tamil Nadu.',
    images: ['/opengraph-image'],
  },
  manifest: '/manifest.json',
  icons: { icon: [{ url:'/brand-mark.svg', type:'image/svg+xml' }], apple:'/brand-mark.svg' },
  appleWebApp: { capable:true, title:COMPANY.name, statusBarStyle:'default' },
  verification: { google:process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, other:{ 'msvalidate.01':process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '' } },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${COMPANY.domain}/#business`,
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
  image: `${COMPANY.domain}/opengraph-image`,
  logo: { '@type':'ImageObject', url:`${COMPANY.domain}/brand-mark.svg`, width:512, height:512 },
  contactPoint: [{ '@type':'ContactPoint', telephone:COMPANY.phoneHref, contactType:'sales and customer support', areaServed:'IN', availableLanguage:['English','Tamil'] }],
  areaServed: [{ '@type':'City', name:'Vellore' },{ '@type':'State', name:'Tamil Nadu' }],
  hasMap: 'https://www.google.com/maps?q=Kangeyanallur%20Vellore%20Tamil%20Nadu%20632006',
  sameAs: [COMPANY.instagram],
  makesOffer: SERVICES.map((service) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service } })),
};

const websiteSchema = {
  '@context':'https://schema.org', '@type':'WebSite', '@id':`${COMPANY.domain}/#website`, url:COMPANY.domain, name:COMPANY.name,
  publisher:{ '@id':`${COMPANY.domain}/#business` }, inLanguage:'en-IN',
  potentialAction:{ '@type':'SearchAction', target:{ '@type':'EntryPoint', urlTemplate:`${COMPANY.domain}/products?search={search_term_string}` }, 'query-input':'required name=search_term_string' },
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
    <html lang="en" className={`scroll-smooth ${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f9f9ff" />
        <JsonLd data={[organizationSchema,websiteSchema]} />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <CartProvider>
          <div className="layout-boundary">
            <Navbar />
            <main id="main-content"><ExperienceLayer>{children}</ExperienceLayer></main>
            <Footer />
            <WhatsAppFloat />
            <SupportChat />
            <GuideRobot />
          </div>
          <CommandPalette />
          <ToasterProvider />
          <PwaRegistration />
          <SiteAnalytics />
        </CartProvider>
      </body>
    </html>
  );
}
