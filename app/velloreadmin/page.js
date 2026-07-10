'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, isAdmin } from '@/lib/firebase';
import { Button } from '@/components/ui';

import AdminLayout from '@/components/admin/AdminLayout';
import DashboardTab from '@/components/admin/DashboardTab';
import ProductsTab from '@/components/admin/ProductsTab';
import CategoriesTab from '@/components/admin/CategoriesTab';
import InquiriesTab from '@/components/admin/InquiriesTab';
import AMCTab from '@/components/admin/AMCTab';
import SettingsTab from '@/components/admin/SettingsTab';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  useEffect(() => {
    setOffline(!window.navigator.onLine);
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const isAuthorized = await isAdmin(u.email);
        if (isAuthorized) {
          setUser(u);
          setError('');
        } else {
          setUser(null);
          setError('Unauthorized: Your email is not whitelisted for admin access.');
          await signOut(auth);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    router.push(`/velloreadmin?tab=${tab}`);
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050505]">
        <div className="text-center">
          <span className="mx-auto block h-12 w-12 animate-spin rounded-full border-2 border-[#c9a227] border-t-transparent" />
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/45 font-condensed font-bold">Verifying access</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050505] p-4">
        <div className="glass-panel w-full max-w-md p-8 text-center sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#f5d76e] to-[#8b6914] font-condensed text-2xl font-black text-black shadow-[0_0_40px_rgba(201,162,39,0.3)]">
            VE
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">Admin Portal</h1>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Sign in with your whitelisted Google account to access the enterprise dashboard.
          </p>
          {error && (
            <div className="mt-6 rounded-xl border border-[#f04418]/30 bg-[#f04418]/10 p-4 text-sm text-[#ffb199]">
              {error}
            </div>
          )}
          <button onClick={login} className="btn w-full mt-8 bg-white text-black hover:bg-gray-100 font-bold border-0 shadow-lg shadow-white/10">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
          <Button href="/" variant="ghost" className="mt-4 w-full">Return to website</Button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout 
      user={user} 
      onLogout={() => signOut(auth)} 
      offline={offline}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'products' && <ProductsTab />}
      {activeTab === 'categories' && <CategoriesTab />}
      {activeTab === 'inquiries' && <InquiriesTab />}
      {activeTab === 'amc' && <AMCTab />}
      {activeTab === 'settings' && <SettingsTab />}
    </AdminLayout>
  );
}
