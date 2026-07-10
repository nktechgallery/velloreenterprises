import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
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
        const q = query(collection(db, 'activity_logs'));
        const snapshot = await getDocs(q);
        if (cancelled) return;
        const logsData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp))
          .slice(0, limitCount);
        setLogs(logsData);
      } catch (error) {
        if (!cancelled) console.error('Error fetching activity logs:', error);
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
