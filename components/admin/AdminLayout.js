'use client';

import { useState } from 'react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'categories', label: 'Categories', icon: '🏷️' },
  { id: 'inquiries', label: 'Inquiries', icon: '📩' },
  { id: 'amc', label: 'AMC', icon: '🔧' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({ user, onLogout, offline, children, activeTab, onTabChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#050505]">
      <div className="grid lg:grid-cols-[260px_1fr]">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] p-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#f5d76e] to-[#8b6914] font-condensed font-black text-black text-xs">VE</div>
            <h1 className="font-display text-lg font-bold">Admin</h1>
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`border-b border-white/10 bg-white/[0.03] p-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:block ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#f5d76e] to-[#8b6914] font-condensed font-black text-black">VE</div>
            <div>
              <h1 className="font-display text-xl font-bold">Admin</h1>
              <p className="text-xs uppercase tracking-[0.16em] text-[#f5d76e]">Enterprise dashboard</p>
            </div>
          </div>

          <nav className="space-y-1" aria-label="Admin navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); setSidebarOpen(false); }}
                className={`admin-sidebar-link ${activeTab === tab.id ? 'admin-sidebar-link-active' : ''}`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span className="text-lg" aria-hidden="true">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/40">Signed in as</p>
              <p className="mt-1 break-all text-sm font-semibold">{user.email}</p>
              {offline && <p className="mt-2 text-xs text-[#f5d76e]">⚠ Offline mode</p>}
              <button onClick={onLogout} className="btn btn-secondary btn-sm w-full mt-4">
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="p-4 md:p-8 min-h-screen">
          {children}
        </section>
      </div>
    </main>
  );
}
