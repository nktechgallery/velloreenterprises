'use client';

import { Button } from '@/components/ui';

export default function GlobalError({ error, reset }) {
  return (
    <div className="error-page">
      <div className="error-card">
        <div className="error-code" aria-hidden="true">500</div>
        <h1 className="font-display text-3xl font-bold mt-4">Something went wrong</h1>
        <p className="mt-4 text-white/55 leading-7">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
          <button onClick={reset} className="btn btn-primary">Try again</button>
          <Button href="/" variant="secondary">Back to home</Button>
        </div>
      </div>
    </div>
  );
}
