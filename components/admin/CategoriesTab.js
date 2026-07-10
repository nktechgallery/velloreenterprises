'use client';

import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFirestoreCategories } from '@/hooks/useFirestoreCategories';
import { logActivity } from '@/lib/logActivity';
import toast from 'react-hot-toast';

const initialCategory = {
  name: '',
  slug: '',
  icon: '',
  description: '',
  visible: true,
};

export default function CategoriesTab() {
  const { categories, loading, refreshCategories } = useFirestoreCategories();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialCategory);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exclude defaults from direct editing, they need to be migrated to Firestore first
  const customCategories = categories.filter(c => !c.isDefault);
  const defaultCategories = categories.filter(c => c.isDefault);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    if (!name) return toast.error('Name is required');

    setIsSubmitting(true);
    const toastId = toast.loading(editingId ? 'Updating category...' : 'Adding category...');

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const categoryData = {
        ...formData,
        name,
        slug: formData.slug || slug,
        updatedAt: new Date().toISOString(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), categoryData);
        await logActivity('CATEGORY_UPDATED', `Updated category: ${formData.name}`);
        toast.success('Category updated', { id: toastId });
      } else {
        categoryData.order = categories.length;
        categoryData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'categories'), categoryData);
        await logActivity('CATEGORY_CREATED', `Added new category: ${formData.name}`, { categoryId: docRef.id });
        toast.success('Category added', { id: toastId });
      }

      refreshCategories();
      window.dispatchEvent(new Event('vellore-categories-changed'));
      setFormData(initialCategory);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error saving category', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    if (category.isDefault) {
      toast('Default categories cannot be edited directly. Add custom ones instead.', { icon: 'ℹ️' });
      return;
    }
    setEditingId(category.id);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      icon: category.icon || '',
      description: category.description || '',
      visible: category.visible !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This won't delete its products, but they may lose their categorization.`)) return;
    
    const toastId = toast.loading('Deleting category...');
    try {
      await deleteDoc(doc(db, 'categories', id));
      await logActivity('CATEGORY_DELETED', `Deleted category: ${name}`, { categoryId: id });
      refreshCategories();
      window.dispatchEvent(new Event('vellore-categories-changed'));
      toast.success('Category deleted', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Error deleting category', { id: toastId });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialCategory);
  };

  const migrateDefaults = async () => {
    if (!window.confirm('This will copy the default hardcoded categories into Firestore so you can edit them. Proceed?')) return;
    
    setIsSubmitting(true);
    const toastId = toast.loading('Migrating categories...');
    try {
      const batch = writeBatch(db);
      defaultCategories.forEach((cat, i) => {
        const ref = doc(collection(db, 'categories'));
        batch.set(ref, {
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          description: cat.description || '',
          visible: true,
          order: i,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      refreshCategories();
      window.dispatchEvent(new Event('vellore-categories-changed'));
      toast.success('Categories migrated successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Migration failed', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Editor */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 lg:p-8">
        <h2 className="font-display text-2xl font-bold mb-6">
          {editingId ? 'Edit Category' : 'Add New Category'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="admin-label">Category Name <span className="text-[#f5d76e]">*</span></label>
            <input 
              value={formData.name} 
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} 
              className="admin-input" 
              placeholder="e.g., Fire Safety Signs"
              required 
            />
          </div>

          <div>
            <label className="admin-label">URL Slug</label>
            <input 
              value={formData.slug} 
              onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} 
              className="admin-input" 
              placeholder="Auto-generated if empty" 
            />
          </div>

          <div>
            <label className="admin-label">Emoji Icon</label>
            <input 
              value={formData.icon} 
              onChange={e => setFormData(p => ({ ...p, icon: e.target.value }))} 
              className="admin-input" 
              placeholder="e.g., 🪧" 
              maxLength={4}
            />
          </div>

          <div>
            <label className="admin-label">Visibility</label>
            <label className="flex items-center gap-3 mt-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.visible}
                onChange={e => setFormData(p => ({ ...p, visible: e.target.checked }))}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#c9a227] focus:ring-[#c9a227]"
              />
              <span className="text-sm text-white/70">Show in navigation and filters</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="admin-label">Description</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} 
              className="admin-input resize-y" 
              rows={2}
              placeholder="Short description for SEO and catalog headers" 
            />
          </div>

          <div className="md:col-span-2 flex gap-3 pt-4 border-t border-white/10">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary min-w-[140px]">
              {isSubmitting ? 'Saving...' : (editingId ? 'Update Category' : 'Add Category')}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category List */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="font-display text-2xl font-bold">Manage Categories</h2>
          {customCategories.length === 0 && defaultCategories.length > 0 && (
            <button onClick={migrateDefaults} disabled={isSubmitting} className="btn btn-secondary btn-sm">
              Migrate Defaults to Database
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-line h-16 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <div 
                key={cat.id} 
                className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                  cat.isDefault ? 'border-white/5 bg-transparent opacity-70' : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-white/5 grid place-items-center text-lg">{cat.icon || '🏷️'}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{cat.name}</h3>
                      {cat.isDefault && <span className="badge badge-gold text-[10px]">Default</span>}
                      {!cat.visible && <span className="badge text-[10px] bg-white/10 text-white/50">Hidden</span>}
                    </div>
                    <p className="text-xs text-white/40 mt-1">/{cat.slug}</p>
                  </div>
                </div>
                
                {!cat.isDefault && (
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">✏️</button>
                    <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition">🗑️</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
