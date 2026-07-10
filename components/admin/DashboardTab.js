'use client';

import { useFirestoreProducts } from '@/hooks/useFirestoreProducts';
import { useFirestoreCategories } from '@/hooks/useFirestoreCategories';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { timeAgo } from '@/lib/dateUtils';

export default function DashboardTab() {
  const { products, loading: productsLoading } = useFirestoreProducts();
  const { categories, loading: categoriesLoading } = useFirestoreCategories();
  const { logs, loading: logsLoading } = useActivityLogs(10);

  const totalProducts = products.length;
  const featuredProducts = products.filter(p => p.featured).length;
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.visible).length;

  // Render method remains the same for the top section...
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold">Dashboard</h2>
          <p className="text-white/55 mt-1">Enterprise overview and quick metrics.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-stat-card">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/45 font-condensed">Total Products</p>
          <p className="mt-2 font-display text-4xl font-bold">{productsLoading ? '-' : totalProducts}</p>
          <p className="mt-2 text-xs text-[#f5d76e]">{featuredProducts} featured</p>
        </div>
        <div className="admin-stat-card">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/45 font-condensed">Categories</p>
          <p className="mt-2 font-display text-4xl font-bold">{categoriesLoading ? '-' : totalCategories}</p>
          <p className="mt-2 text-xs text-[#25d366]">{activeCategories} active</p>
        </div>
        <div className="admin-stat-card">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/45 font-condensed">Inquiries</p>
          <p className="mt-2 font-display text-4xl font-bold">-</p>
          <p className="mt-2 text-xs text-white/35">Building in Phase 2</p>
        </div>
        <div className="admin-stat-card">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/45 font-condensed">AMC Requests</p>
          <p className="mt-2 font-display text-4xl font-bold">-</p>
          <p className="mt-2 text-xs text-white/35">Building in Phase 2</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
        <h3 className="font-display text-xl font-bold mb-6">Recent Activity</h3>
        
        {logsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-line h-12 rounded-xl" />)}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-white/5 border-dashed rounded-2xl">
            <span className="text-2xl opacity-50 mb-2">📋</span>
            <p className="text-sm text-white/50">No recent activity logged yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-black/40 text-[#c9a227]">
                  {log.action === 'PRODUCT_CREATED' ? '📦' : 
                   log.action === 'PRODUCT_UPDATED' ? '✏️' :
                   log.action === 'PRODUCT_DELETED' ? '🗑️' :
                   log.action === 'QUOTE_DOWNLOADED' ? '📄' : '⚡'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{log.details}</p>
                  <p className="text-xs text-white/40 mt-0.5">{log.action}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-white/50">
                    {timeAgo(log.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
