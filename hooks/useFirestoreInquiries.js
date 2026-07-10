import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { timestampValue } from '@/lib/dateUtils';

export function useFirestoreInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshInquiries = () => setRefreshKey((value) => value + 1);

  useEffect(() => {
    let cancelled = false;

    async function loadInquiries() {
      setLoading(true);
      try {
        const q = query(collection(db, 'inquiries'));
        const snapshot = await getDocs(q);
        if (cancelled) return;
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => timestampValue(b.createdAt || b.updatedAt) - timestampValue(a.createdAt || a.updatedAt));
        setInquiries(data);
      } catch (error) {
        if (!cancelled) console.error('Error fetching inquiries:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInquiries();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { inquiries, loading, refreshInquiries };
}
