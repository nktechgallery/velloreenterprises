'use client';

import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { productSlug } from '@/lib/constants';
import { useFirestoreProducts } from '@/hooks/useFirestoreProducts';
import { useFirestoreCategories } from '@/hooks/useFirestoreCategories';
import { logActivity } from '@/lib/logActivity';
import toast from 'react-hot-toast';

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dkrd0zooe';
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '332133135685411';
const STALE_SIGNATURE_PATTERN = /stale request|more than 1 hour ago|signature is stale/i;
const initialProduct = { name: '', category: '', description: '', code: '', price: '', stock: 0, image: '', featured: false, slug: '', status: 'active' };

function isStaleSignatureError(message) {
  return STALE_SIGNATURE_PATTERN.test(String(message || ''));
}

async function getCloudinarySignature() {
  const signRes = await fetch(`/api/cloudinary-sign?ts=${Date.now()}`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    body: JSON.stringify({ requestedAt: new Date().toISOString() }),
  });
  const signData = await signRes.json().catch(() => ({}));
  if (!signRes.ok) {
    throw new Error(signData?.error || 'Cloudinary signing unavailable');
  }
  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - Number(signData.timestamp || 0));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) {
    throw new Error('Cloudinary upload signature is stale. Sync your computer clock, restart the dev server, and try again.');
  }
  return signData;
}

async function uploadToCloudinaryOnce(file) {
  const signData = await getCloudinarySignature();
  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('api_key', CLOUDINARY_API_KEY);
  uploadData.append('timestamp', String(signData.timestamp));
  uploadData.append('signature', signData.signature);
  uploadData.append('folder', signData.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: 'POST',
    body: uploadData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message || 'Cloudinary upload failed');
  }
  return data.secure_url;
}

async function uploadToCloudinary(file) {
  try {
    return await uploadToCloudinaryOnce(file);
  } catch (err) {
    if (!isStaleSignatureError(err?.message)) throw err;
    return uploadToCloudinaryOnce(file);
  }
}

export default function ProductsTab() {
  const { products, loading, refreshProducts } = useFirestoreProducts();
  const { categories, categoryNames, refreshCategories } = useFirestoreCategories();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialProduct);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const id = toast.loading('Uploading image...');
    
    try {
      const imageUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      toast.success('Image uploaded', { id });
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err?.message || 'Failed to upload image', { id });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error('Name and Category are required');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(editingId ? 'Updating product...' : 'Adding product...');

    try {
      const trimmedName = formData.name.trim();
      const trimmedCategory = formData.category.trim();
      const productData = {
        ...formData,
        name: trimmedName,
        category: trimmedCategory,
        code: formData.code.trim(),
        description: formData.description.trim(),
        price: String(formData.price || '').trim(),
        image: String(formData.image || '').trim(),
        slug: formData.slug || productSlug({ name: trimmedName, code: formData.code }),
        status: formData.status || 'active',
        stock: parseInt(formData.stock) || 0,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
        await logActivity('PRODUCT_UPDATED', `Updated product: ${formData.name}`);
        toast.success('Product updated successfully', { id: toastId });
      } else {
        productData.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, 'products'), productData);
        await logActivity('PRODUCT_CREATED', `Added new product: ${formData.name}`, { productId: docRef.id });
        toast.success('Product added successfully', { id: toastId });
      }

      refreshProducts();
      window.dispatchEvent(new Event('vellore-products-changed'));
      setFormData(initialProduct);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error saving product', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) {
      toast.error('Category name is required');
      return;
    }
    if (categoryNames.some((category) => category.toLowerCase() === name.toLowerCase())) {
      setFormData((current) => ({ ...current, category: name }));
      setNewCategory('');
      toast.success('Category selected');
      return;
    }

    setAddingCategory(true);
    const toastId = toast.loading('Adding category...');
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const docRef = await addDoc(collection(db, 'categories'), {
        name,
        slug,
        icon: name.slice(0, 2).toUpperCase(),
        description: '',
        visible: true,
        order: categories.length,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await logActivity('CATEGORY_CREATED', `Added new category: ${name}`, { categoryId: docRef.id });
      refreshCategories();
      window.dispatchEvent(new Event('vellore-categories-changed'));
      setFormData((current) => ({ ...current, category: name }));
      setNewCategory('');
      toast.success('Category added and selected', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Error adding category', { id: toastId });
    } finally {
      setAddingCategory(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      description: product.description || '',
      code: product.code || '',
      price: product.price || '',
      stock: product.stock || 0,
      image: product.image || '',
      featured: product.featured || false,
      slug: product.slug || '',
      status: product.status || 'active',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    const toastId = toast.loading('Deleting product...');
    try {
      await deleteDoc(doc(db, 'products', id));
      await logActivity('PRODUCT_DELETED', `Deleted product: ${name}`, { productId: id });
      refreshProducts();
      window.dispatchEvent(new Event('vellore-products-changed'));
      toast.success('Product deleted', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Error deleting product', { id: toastId });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialProduct);
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Product Editor */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 lg:p-8">
        <h2 className="font-display text-2xl font-bold mb-6">
          {editingId ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="admin-label">Product Name <span className="text-[#f5d76e]">*</span></label>
            <input 
              value={formData.name} 
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} 
              className="admin-input" 
              placeholder="e.g., 9KG ABC Fire Extinguisher"
              required 
            />
          </div>

          <div>
            <label className="admin-label">Category <span className="text-[#f5d76e]">*</span></label>
            <select 
              value={formData.category} 
              onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} 
              className="admin-input select-premium bg-black/20"
              required
            >
              <option value="">Select Category</option>
              {categoryNames.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                className="admin-input"
                placeholder="Add custom category"
              />
              <button
                type="button"
                onClick={handleQuickAddCategory}
                disabled={addingCategory}
                className="btn btn-secondary"
              >
                {addingCategory ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>

          <div>
            <label className="admin-label">Product Code (SKU)</label>
            <input 
              value={formData.code} 
              onChange={e => setFormData(p => ({ ...p, code: e.target.value }))} 
              className="admin-input" 
              placeholder="e.g., VE-ABC-09" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="admin-label">Description</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} 
              className="admin-input resize-y" 
              rows={4}
              placeholder="Detailed product specifications..." 
            />
          </div>

          <div>
            <label className="admin-label">Price (INR)</label>
            <input 
              type="number" 
              value={formData.price} 
              onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} 
              className="admin-input" 
              placeholder="e.g., 2500" 
            />
          </div>

          <div>
            <label className="admin-label">Stock Quantity</label>
            <input 
              type="number" 
              value={formData.stock} 
              onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))} 
              className="admin-input" 
              placeholder="e.g., 50" 
              min="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="admin-label">Featured Product</label>
            <label className="flex items-center gap-3 mt-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.featured}
                onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#c9a227] focus:ring-[#c9a227] focus:ring-offset-black"
              />
              <span className="text-sm text-white/70">Show on homepage</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="admin-label">Product Image</label>
            <div className="mt-2 flex items-center gap-6">
              {formData.image ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, image: '' }))}
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-red-500/80 text-white backdrop-blur-sm"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-xl border border-dashed border-white/20 bg-white/[0.02]">
                  <span className="text-2xl opacity-30">📷</span>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-white/50 file:mr-4 file:rounded-full file:border-0 file:bg-[#c9a227]/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#f5d76e] hover:file:bg-[#c9a227]/30 transition"
                />
                <p className="mt-2 text-xs text-white/40">Supported: JPG, PNG, WebP (Max 5MB)</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex gap-3 pt-4 border-t border-white/10">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1 sm:flex-none min-w-[140px]">
              {isSubmitting ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn btn-secondary flex-1 sm:flex-none">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="font-display text-2xl font-bold">Catalog ({products.length})</h2>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="admin-input !pl-10"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-orb">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search terms or add a new product.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map(product => (
              <div key={product.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col transition hover:border-white/20">
                <div className="flex gap-4 flex-1">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 shrink-0 grid place-items-center text-xl">📦</div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold truncate text-white/90">{product.name}</h3>
                    <p className="text-xs text-[#f5d76e] mt-1 uppercase tracking-wider">{product.category}</p>
                    <p className="text-xs text-white/40 mt-1 truncate">{product.code || 'No SKU'}</p>
                    {product.price && <p className="text-sm font-semibold mt-1">₹{product.price}</p>}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div>
                    {product.featured && <span className="badge badge-gold">Featured</span>}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition"
                      aria-label="Edit product"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                      aria-label="Delete product"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
