'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { timestampValue } from '@/lib/dateUtils';

/** Minimum ms between refetches triggered by window focus */
const REFETCH_COOLDOWN_MS = 60_000;

function normalizeProduct(document) {
  const data = document.data();
  const image = String(data.image || data.imageUrl || data.photoURL || data.secure_url || '').trim();
  return { id: document.id, ...data, image };
}

export function useFirestoreProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const lastFetchedAt = useRef(0);

  const refreshProducts = () => setRefreshKey((value) => value + 1);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        if (cancelled) return;
        const nextProducts = snapshot.docs.map(normalizeProduct);
        setProducts(nextProducts);
        setOffline(false);
        setError('');
        lastFetchedAt.current = Date.now();
      } catch (err) {
        if (cancelled) return;
        // Fallback: try without orderBy in case index doesn't exist
        try {
          const fallbackQuery = query(collection(db, 'products'));
          const snapshot = await getDocs(fallbackQuery);
          if (cancelled) return;
          const nextProducts = snapshot.docs
            .map(normalizeProduct)
            .sort((a, b) => timestampValue(b.createdAt || b.updatedAt) - timestampValue(a.createdAt || a.updatedAt));
          setProducts(nextProducts);
          setOffline(false);
          setError('');
          lastFetchedAt.current = Date.now();
        } catch (fallbackErr) {
          if (cancelled) return;
          setOffline(typeof navigator !== 'undefined' ? !navigator.onLine : false);
          setError(fallbackErr?.message || 'Unable to load products.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    const handleFocus = () => {
      // Debounce: skip if last fetch was recent
      if (Date.now() - lastFetchedAt.current < REFETCH_COOLDOWN_MS) return;
      refreshProducts();
    };
    const handleProductsChanged = () => refreshProducts();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('vellore-products-changed', handleProductsChanged);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('vellore-products-changed', handleProductsChanged);
    };
  }, []);

  return useMemo(() => ({ products, loading, error, offline, refreshProducts }), [products, loading, error, offline]);
}
