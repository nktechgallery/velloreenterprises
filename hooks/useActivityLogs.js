import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { timestampValue } from '@/lib/dateUtils';

export function useActivityLogs(limitCount = 20) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshLogs = () => setRefreshKey((value) => value + 1);

  useEffect(() => {
    let cancelled = false;

    async function loadLogs() {
      setLoading(true);
      try {
        // Try server-side ordering + limiting first
        const q = query(
          collection(db, 'activity_logs'),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
        const snapshot = await getDocs(q);
        if (cancelled) return;
        setLogs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        // Fallback: fetch all and sort/slice client-side if index doesn't exist
        if (cancelled) return;
        try {
          const fallbackQuery = query(collection(db, 'activity_logs'));
          const snapshot = await getDocs(fallbackQuery);
          if (cancelled) return;
          const logsData = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp))
            .slice(0, limitCount);
          setLogs(logsData);
        } catch (fallbackErr) {
          if (!cancelled) console.error('Error fetching activity logs:', fallbackErr);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLogs();

    return () => {
      cancelled = true;
    };
  }, [limitCount, refreshKey]);

  return { logs, loading, refreshLogs };
}
