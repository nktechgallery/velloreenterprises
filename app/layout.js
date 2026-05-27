import './globals.css';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export const metadata = {
  metadataBase: new URL('https://www.velloreenterprises.in'),
  title: {
    default: 'Vellore Enterprises | Fire Safety Solutions in Vellore, Tamil Nadu',
    template: '%s | Vellore Enterprises',
  },
  description: 'Vellore Enterprises – Your trusted fire safety partner in Vellore. Expert fire extinguisher supply, fire alarm systems, fire hydrant systems, AMC services & fire safety audits. Call +91 80722 64972.',
  keywords: [
    'fire safety company in Vellore',
    'fire extinguisher supplier Vellore',
    'fire alarm system installation Vellore',
    'fire AMC services Tamil Nadu',
    'fire equipment dealers Vellore',
    'fire suppression systems Tamil Nadu',
    'fire hydrant system Vellore',
    'fire safety audit Vellore',
    'Vellore Enterprises fire safety',
  ],
  authors: [{ name: 'Vellore Enterprises' }],
  creator: 'Vellore Enterprises',
  publisher: 'Vellore Enterprises',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.velloreenterprises.in',
    siteName: 'Vellore Enterprises',
    title: 'Vellore Enterprises | Premium Fire Safety Solutions',
    description: 'Your trusted fire safety partner in Vellore, Tamil Nadu. Fire extinguishers, alarm systems, hydrant systems, AMC services and more.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Vellore Enterprises Fire Safety' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vellore Enterprises | Fire Safety Solutions',
    description: 'Your trusted fire safety partner in Vellore, Tamil Nadu.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.velloreenterprises.in' },
  verification: { google: 'your-google-verification-code' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Vellore Enterprises',
              description: 'Fire safety and fire protection solutions company in Vellore, Tamil Nadu.',
              url: 'https://www.velloreenterprises.in',
              telephone: '+918072264972',
              email: 'velloreenterprises7@gmail.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '164, Vellore Road, Kangeyanallur',
                addressLocality: 'Vellore',
                addressRegion: 'Tamil Nadu',
                postalCode: '632006',
                addressCountry: 'IN',
              },
              geo: { '@type': 'GeoCoordinates', latitude: 12.9165, longitude: 79.1325 },
              openingHours: 'Mo-Sa 09:00-18:00',
              priceRange: '₹₹',
              image: 'https://www.velloreenterprises.in/og-image.jpg',
              sameAs: ['https://www.instagram.com/vellore_enterprises'],
            }),
          }}
        />
      </head>
      <body className="bg-dark-900 text-white antialiased">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1a1a1a', color: '#f5f5f5', border: '1px solid rgba(201,162,39,0.3)' },
              success: { iconTheme: { primary: '#C9A227', secondary: '#0a0a0a' } },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
