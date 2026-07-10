'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { timestampValue } from '@/lib/dateUtils';

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

  const refreshProducts = () => setRefreshKey((value) => value + 1);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'));
        const snapshot = await getDocs(q);
        if (cancelled) return;
        const nextProducts = snapshot.docs
          .map(normalizeProduct)
          .sort((a, b) => timestampValue(b.createdAt || b.updatedAt) - timestampValue(a.createdAt || a.updatedAt));
        setProducts(nextProducts);
        setOffline(false);
        setError('');
      } catch (err) {
        if (cancelled) return;
        setOffline(typeof navigator !== 'undefined' ? !navigator.onLine : false);
        setError(err?.message || 'Unable to load products.');
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
    const handleFocus = () => refreshProducts();
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
