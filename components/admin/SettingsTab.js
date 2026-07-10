'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logActivity } from '@/lib/logActivity';
import toast from 'react-hot-toast';

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dkrd0zooe';
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '332133135685411';

export default function SettingsTab({ user, onLogout }) {
  const [banners, setBanners] = useState({ homeHero: '', promoBanner: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const docRef = doc(db, 'settings', 'banners');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBanners(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const id = toast.loading('Uploading banner...');
    
    try {
      const signRes = await fetch(`/api/cloudinary-sign?ts=${Date.now()}`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      const signData = await signRes.json().catch(() => ({}));
      if (!signRes.ok) {
        throw new Error(signData?.error || 'Cloudinary signing unavailable');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('timestamp', String(signData.timestamp));
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.secure_url) {
        throw new Error(data?.error?.message || 'Cloudinary upload failed');
      }
      setBanners((prev) => ({ ...prev, [field]: data.secure_url }));
      toast.success('Image uploaded', { id });
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err?.message || 'Failed to upload image', { id });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBanners = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving banners...');
    try {
      await setDoc(doc(db, 'settings', 'banners'), banners);
      await logActivity('SETTINGS_UPDATED', 'Updated homepage banners');
      toast.success('Banners saved successfully', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to save banners', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold">Settings & CMS</h2>
          <p className="text-white/55 mt-1">Platform configuration, admin profile, and media management.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {/* Profile */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="font-bold text-lg mb-4">Admin Profile</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1 font-condensed">Email Address</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1 font-condensed">Access Level</p>
              <p className="font-semibold text-[#f5d76e]">Super Admin</p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/10">
              <button onClick={onLogout} className="btn btn-secondary w-full">Sign out</button>
            </div>
          </div>
        </div>

        {/* Media / Banners */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 flex flex-col">
          <h3 className="font-bold text-lg mb-4">Banner CMS</h3>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-24 bg-white/5 rounded-xl"></div>
              <div className="h-24 bg-white/5 rounded-xl"></div>
            </div>
          ) : (
            <div className="space-y-6 flex-1">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-2 font-condensed">Home Hero Image</p>
                {banners.homeHero ? (
                  <div className="relative h-24 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 mb-2">
                    <img src={banners.homeHero} alt="Hero Banner" className="h-full w-full object-cover" />
                    <button onClick={() => setBanners(p => ({ ...p, homeHero: '' }))} className="absolute right-2 top-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center">×</button>
                  </div>
                ) : null}
                <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'homeHero')} disabled={uploading} className="text-sm file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-1 file:text-white" />
              </div>

              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-2 font-condensed">Promo Banner</p>
                {banners.promoBanner ? (
                  <div className="relative h-24 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 mb-2">
                    <img src={banners.promoBanner} alt="Promo Banner" className="h-full w-full object-cover" />
                    <button onClick={() => setBanners(p => ({ ...p, promoBanner: '' }))} className="absolute right-2 top-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center">×</button>
                  </div>
                ) : null}
                <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'promoBanner')} disabled={uploading} className="text-sm file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-1 file:text-white" />
              </div>
            </div>
          )}
          
          <div className="pt-4 mt-6 border-t border-white/10">
            <button onClick={handleSaveBanners} disabled={saving || loading || uploading} className="btn btn-primary w-full">
              {saving ? 'Saving...' : 'Save Banners'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
