'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ExperienceLayer({ children }) {
  const pathname = usePathname();
  const [online, setOnline] = useState(true);
  const [consent, setConsent] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    setConsent(localStorage.getItem('ve-cookie-consent') === 'accepted');
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </motion.div>
      </AnimatePresence>
      {!online && <div className="offline-banner" role="status">You are offline. Saved cart items remain available.</div>}
      {!consent && (
        <motion.aside className="cookie-banner" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} role="dialog" aria-label="Cookie preferences">
          <div><strong>Your privacy matters.</strong><p>We only use essential storage to restore your cart and preferences.</p></div>
          <button className="btn btn-primary btn-sm" onClick={() => { localStorage.setItem('ve-cookie-consent', 'accepted'); setConsent(true); window.dispatchEvent(new Event('ve-consent-updated')); }}>Accept</button>
        </motion.aside>
      )}
    </>
  );
}
