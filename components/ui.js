'use client';

import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';

export function Section({ eyebrow, title, description, children, className = '', id }) {
  const [ref, inView] = useReveal();
  return (
    <section id={id} ref={ref} className={`section-shell ${className}`}>
      <div className={`section-heading reveal ${inView ? 'is-visible' : ''}`}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2 className="heading-lg">{title}</h2>}
        {description && <p className="section-copy">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function Button({ href, children, variant = 'primary', className = '', ...props }) {
  const classes = `btn btn-${variant} ${className}`;
  if (href) {
    const external = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');
    if (external) {
      return <a href={href} className={classes} {...props}>{children}</a>;
    }
    return <Link href={href} className={classes} {...props}>{children}</Link>;
  }
  return <button className={classes} {...props}>{children}</button>;
}

export function MetricCard({ value, label, detail }) {
  return (
    <div className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
      {detail && <p>{detail}</p>}
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid" aria-label="Loading">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div />
          <span />
          <span />
          <small />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-orb" aria-hidden="true">VE</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
