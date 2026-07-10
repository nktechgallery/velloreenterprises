'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PRODUCT_CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';

const DEFAULT_CATEGORIES = PRODUCT_CATEGORIES.map((name, i) => ({
  id: `default-${i}`,
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  icon: CATEGORY_ICONS[name] || name.slice(0, 2).toUpperCase(),
  banner: '',
  description: '',
  seoTitle: '',
  seoDescription: '',
  parent: '',
  order: i,
  visible: true,
  isDefault: true,
}));

function slugFor(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mergeCategories(docs) {
  const customCategories = docs.map((category, index) => ({
    ...category,
    name: String(category.name || '').trim(),
    slug: category.slug || slugFor(category.name),
    order: Number.isFinite(Number(category.order)) ? Number(category.order) : DEFAULT_CATEGORIES.length + index,
    isDefault: false,
  })).filter((category) => category.name);

  const customNames = new Set(customCategories.map((category) => category.name.toLowerCase()));
  const defaults = DEFAULT_CATEGORIES.filter((category) => !customNames.has(category.name.toLowerCase()));

  return [...defaults, ...customCategories]
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0) || a.name.localeCompare(b.name));
}

export function useFirestoreCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshCategories = () => setRefreshKey((value) => value + 1);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setLoading(true);
      try {
        const q = query(collection(db, 'categories'));
        const snapshot = await getDocs(q);
        if (cancelled) return;
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCategories(mergeCategories(docs));
        setError('');
      } catch (err) {
        if (cancelled) return;
        console.error('[useFirestoreCategories]', err);
        setCategories(DEFAULT_CATEGORIES);
        setError(err?.message || 'Unable to load categories');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    const handleFocus = () => refreshCategories();
    const handleCategoriesChanged = () => refreshCategories();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('vellore-categories-changed', handleCategoriesChanged);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('vellore-categories-changed', handleCategoriesChanged);
    };
  }, []);

  const visibleCategories = useMemo(
    () => categories.filter((c) => c.visible !== false),
    [categories]
  );

  const categoryNames = useMemo(
    () => visibleCategories.map((c) => c.name),
    [visibleCategories]
  );

  return useMemo(
    () => ({ categories, visibleCategories, categoryNames, loading, error, refreshCategories }),
    [categories, visibleCategories, categoryNames, loading, error]
  );
}
