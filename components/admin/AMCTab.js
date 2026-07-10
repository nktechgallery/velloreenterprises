'use client';

import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFirestoreAMC } from '@/hooks/useFirestoreAMC';
import { logActivity } from '@/lib/logActivity';
import toast from 'react-hot-toast';
import { timeAgo } from '@/lib/dateUtils';

export default function AMCTab() {
  const { amcRequests, loading, refreshAMC } = useFirestoreAMC();
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'scheduled', 'completed'
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = amcRequests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const handleUpdateStatus = async (id, newStatus) => {
    const toastId = toast.loading('Updating status...');
    try {
      await updateDoc(doc(db, 'amc_requests', id), { status: newStatus, updatedAt: new Date().toISOString() });
      await logActivity('AMC_UPDATED', `Updated AMC request status to ${newStatus}`, { requestId: id });
      refreshAMC();
      toast.success('Status updated', { id: toastId });
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status', { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this AMC request?')) return;
    const toastId = toast.loading('Deleting request...');
    try {
      await deleteDoc(doc(db, 'amc_requests', id));
      await logActivity('AMC_DELETED', 'Deleted an AMC request', { requestId: id });
      refreshAMC();
      toast.success('Request deleted', { id: toastId });
      setSelectedRequest(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete request', { id: toastId });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="badge bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Pending</span>;
      case 'scheduled': return <span className="badge bg-blue-500/10 text-blue-400 border-blue-500/20">Scheduled</span>;
      case 'completed': return <span className="badge bg-green-500/10 text-green-400 border-green-500/20">Completed</span>;
      default: return <span className="badge bg-gray-500/10 text-gray-400 border-gray-500/20">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold">AMC Management</h2>
          <p className="text-white/55 mt-1">Manage annual maintenance contracts and service requests.</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-white/[0.04] rounded-xl border border-white/10">
          {['all', 'pending', 'scheduled', 'completed'].map(f => (
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
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <span className="text-4xl opacity-50 mb-4">🔧</span>
              <p className="text-white/50">No AMC requests found for this filter.</p>
            </div>
          ) : (
            <div className="overflow-y-auto p-4 space-y-3">
              {filteredRequests.map(req => (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedRequest?.id === req.id 
                      ? 'border-[#c9a227] bg-[#c9a227]/10' 
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{req.company || req.name || 'Unknown Facility'}</span>
                    {getStatusBadge(req.status || 'pending')}
                  </div>
                  <div className="text-sm text-white/50 truncate mb-2">{req.systemType || 'General Maintenance'}</div>
                  <div className="text-xs text-white/40 flex justify-between">
                    <span>{req.city || 'Unknown Location'}</span>
                    <span>{timeAgo(req.createdAt, '')}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail View */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden h-[70vh] flex flex-col">
          {selectedRequest ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-xl font-bold">{selectedRequest.company || selectedRequest.name}</h3>
                  <div className="flex gap-2">
                    <select
                      value={selectedRequest.status || 'pending'}
                      onChange={(e) => handleUpdateStatus(selectedRequest.id, e.target.value)}
                      className="admin-input select-premium !py-1 !text-xs !bg-black/40"
                    >
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button onClick={() => handleDelete(selectedRequest.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition" aria-label="Delete request">🗑️</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/40 uppercase tracking-widest text-[10px]">Contact Person</p>
                    <p>{selectedRequest.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase tracking-widest text-[10px]">Phone</p>
                    <a href={`tel:${selectedRequest.phone}`} className="text-[#f5d76e] hover:underline">{selectedRequest.phone || '-'}</a>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase tracking-widest text-[10px]">Location</p>
                    <p>{selectedRequest.city || '-'}</p>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase tracking-widest text-[10px]">System Type</p>
                    <p>{selectedRequest.systemType || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-white/40 uppercase tracking-widest text-[10px] mb-2">Requirements / Notes</p>
                <div className="p-4 rounded-xl bg-black/40 text-sm whitespace-pre-wrap leading-relaxed border border-white/5 min-h-[100px]">
                  {selectedRequest.requirements || 'No specific requirements noted.'}
                </div>
                
                <div className="mt-8 border-t border-white/10 pt-6">
                  <button className="w-full btn btn-secondary flex justify-center gap-2 items-center" onClick={() => window.open(`mailto:${selectedRequest.email}`)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email Customer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <span className="text-4xl opacity-20 mb-4">📝</span>
              <p className="text-white/40">Select a request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
