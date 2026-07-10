import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { timestampValue } from '@/lib/dateUtils';

export function useFirestoreAMC() {
  const [amcRequests, setAmcRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshAMC = () => setRefreshKey((value) => value + 1);

  useEffect(() => {
    let cancelled = false;

    async function loadAMC() {
      setLoading(true);
      try {
        const q = query(collection(db, 'amc_requests'));
        const snapshot = await getDocs(q);
        if (cancelled) return;
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => timestampValue(b.createdAt || b.updatedAt) - timestampValue(a.createdAt || a.updatedAt));
        setAmcRequests(data);
      } catch (error) {
        if (!cancelled) console.error('Error fetching AMC requests:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAMC();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { amcRequests, loading, refreshAMC };
}
