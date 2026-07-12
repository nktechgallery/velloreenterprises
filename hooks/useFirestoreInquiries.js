import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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
        const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        if (cancelled) return;
        setInquiries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        // Fallback: client-side sort if index doesn't exist
        if (cancelled) return;
        try {
          const fallbackQuery = query(collection(db, 'inquiries'));
          const snapshot = await getDocs(fallbackQuery);
          if (cancelled) return;
          const data = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => timestampValue(b.createdAt || b.updatedAt) - timestampValue(a.createdAt || a.updatedAt));
          setInquiries(data);
        } catch (fallbackErr) {
          if (!cancelled) console.error('Error fetching inquiries:', fallbackErr);
        }
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
