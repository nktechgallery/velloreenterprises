import Link from 'next/link';
import { COMPANY } from '@/lib/constants';

export const metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-card">
        <div className="error-code" aria-hidden="true">404</div>
        <h1 className="font-display text-3xl font-bold mt-2">Page not found</h1>
        <p className="mt-4 text-white/55 leading-7 max-w-md mx-auto">
          The page you are looking for may have been moved, renamed, or is temporarily unavailable.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/products" className="btn btn-secondary">Browse products</Link>
          <a href={`tel:${COMPANY.phoneHref}`} className="btn btn-secondary">
            Call us
          </a>
        </div>
      </div>
    </div>
  );
}
