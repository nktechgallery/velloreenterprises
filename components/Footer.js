import Link from 'next/link';
import { COMPANY } from '@/lib/constants';

export default function Footer() {
  return <footer className="executive-footer">
    <div className="container-wide footer-grid">
      <div><Link href="/" className="footer-brand">Vellore Enterprises</Link><p>Premium fire safety and maintenance solutions for modern infrastructure.</p></div>
      <div><strong>Solutions</strong><Link href="/products">Fire Extinguishers</Link><Link href="/products">Sprinkler Systems</Link><Link href="/products">Smoke Detectors</Link></div>
      <div><strong>Services</strong><Link href="/amc">Maintenance Services</Link><Link href="/amc">AMC Plans</Link><Link href="/contact">Site Consultation</Link></div>
      <div><strong>Company</strong><Link href="/about">About</Link><Link href="/fire-safety-guide">Fire Safety Guide</Link><Link href="/locations/vellore">Vellore Service Area</Link><Link href="/contact">Contact Support</Link><a href={`tel:${COMPANY.phoneHref}`}>Emergency Support</a></div>
    </div>
    <div className="container-wide footer-bottom">© {new Date().getFullYear()} Vellore Enterprises. All rights reserved.</div>
  </footer>;
}
