'use client';

import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFirestoreInquiries } from '@/hooks/useFirestoreInquiries';
import { logActivity } from '@/lib/logActivity';
import toast from 'react-hot-toast';
import { timeAgo } from '@/lib/dateUtils';

export default function InquiriesTab() {
  const { inquiries, loading, refreshInquiries } = useFirestoreInquiries();
  const [filter, setFilter] = useState('all'); // 'all', 'new', 'in_progress', 'completed'
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const filteredInquiries = inquiries.filter(inq => {
    if (filter === 'all') return true;
    return inq.status === filter;
  });

  const handleUpdateStatus = async (id, newStatus) => {
    const toastId = toast.loading('Updating status...');
    try {
      await updateDoc(doc(db, 'inquiries', id), { status: newStatus, updatedAt: new Date().toISOString() });
      await logActivity('INQUIRY_UPDATED', `Updated inquiry status to ${newStatus}`, { inquiryId: id });
      refreshInquiries();
      toast.success('Status updated', { id: toastId });
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status', { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    const toastId = toast.loading('Deleting inquiry...');
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      await logActivity('INQUIRY_DELETED', 'Deleted an inquiry record', { inquiryId: id });
      refreshInquiries();
      toast.success('Inquiry deleted', { id: toastId });
      setSelectedInquiry(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete inquiry', { id: toastId });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new': return <span className="badge bg-blue-500/10 text-blue-400 border-blue-500/20">New</span>;
      case 'in_progress': return <span className="badge bg-yellow-500/10 text-yellow-400 border-yellow-500/20">In Progress</span>;
      case 'completed': return <span className="badge bg-green-500/10 text-green-400 border-green-500/20">Completed</span>;
      default: return <span className="badge bg-gray-500/10 text-gray-400 border-gray-500/20">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold">Inquiries & CRM</h2>
          <p className="text-white/55 mt-1">Manage customer contact requests, quotes, and leads.</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-white/[0.04] rounded-xl border border-white/10">
          {['all', 'new', 'in_progress', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                filter === f ? 'bg-white/10 text-white shadow-sm font-semibold' : 'text-white/50 hover:text-white'
              }`}
            >
              {f.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        
        {/* List View */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col h-[70vh]">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-line h-20 rounded-2xl" />)}
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <span className="text-4xl opacity-50 mb-4">📬</span>
              <p className="text-white/50">No inquiries found for this filter.</p>
            </div>
          ) : (
            <div className="overflow-y-auto p-4 space-y-3">
              {filteredInquiries.map(inq => (
                <button
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedInquiry?.id === inq.id 
                      ? 'border-[#c9a227] bg-[#c9a227]/10' 
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{inq.name || 'Unknown Contact'}</span>
                    {getStatusBadge(inq.status || 'new')}
                  </div>
                  <div className="text-sm text-white/50 truncate mb-2">{inq.message || inq.type || 'No message provided'}</div>
                  <div className="text-xs text-white/40">
                    {timeAgo(inq.createdAt)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail View */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden h-[70vh] flex flex-col">
          {selectedInquiry ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-xl font-bold">{selectedInquiry.name}</h3>
                  <div className="flex gap-2">
                    <select
                      value={selectedInquiry.status || 'new'}
                      onChange={(e) => handleUpdateStatus(selectedInquiry.id, e.target.value)}
                      className="admin-input select-premium !py-1 !text-xs !bg-black/40"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button onClick={() => handleDelete(selectedInquiry.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition" aria-label="Delete inquiry">🗑️</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/40 uppercase tracking-widest text-[10px]">Email</p>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-[#f5d76e] hover:underline">{selectedInquiry.email || '-'}</a>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase tracking-widest text-[10px]">Phone</p>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-[#f5d76e] hover:underline">{selectedInquiry.phone || '-'}</a>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase tracking-widest text-[10px]">Company</p>
                    <p>{selectedInquiry.company || '-'}</p>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase tracking-widest text-[10px]">Type</p>
                    <p>{selectedInquiry.type || 'General'}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-white/40 uppercase tracking-widest text-[10px] mb-2">Message</p>
                <div className="p-4 rounded-xl bg-black/40 text-sm whitespace-pre-wrap leading-relaxed border border-white/5">
                  {selectedInquiry.message || 'No message content.'}
                </div>

                {selectedInquiry.cartItems && selectedInquiry.cartItems.length > 0 && (
                  <div className="mt-6">
                    <p className="text-white/40 uppercase tracking-widest text-[10px] mb-2">Requested Items</p>
                    <div className="space-y-2">
                      {selectedInquiry.cartItems.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm flex justify-between">
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-[#f5d76e]">Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <span className="text-4xl opacity-20 mb-4">🗂️</span>
              <p className="text-white/40">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
