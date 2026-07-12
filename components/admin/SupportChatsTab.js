'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, doc, getDocs, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SupportChatsTab({ user }) {
  const [chats, setChats] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'support_chats')));
      const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort((a,b) => (b.updatedAt?.toMillis?.() || 0) - (a.updatedAt?.toMillis?.() || 0));
      setChats(rows); setSelectedId((current) => current || rows[0]?.id || '');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); const timer = setInterval(load, 15000); return () => clearInterval(timer); }, [load]);
  const selected = useMemo(() => chats.find((chat) => chat.id === selectedId), [chats, selectedId]);
  const send = async (event) => {
    event.preventDefault(); if (!selected || !reply.trim()) return;
    const message = { id: crypto.randomUUID(), role: 'admin', text: reply.trim(), createdAt: Date.now(), author: user.email };
    await updateDoc(doc(db, 'support_chats', selected.id), { messages: [...(selected.messages || []), message], status: 'active', assignedTo: user.email, updatedAt: serverTimestamp(), lastMessage: message.text });
    setReply(''); await load();
  };
  return <div className="admin-chat-page">
    <div className="admin-page-heading"><div><p className="eyebrow">Customer support</p><h1>Live conversations</h1><p>Review automated conversations and join customers who need assistance.</p></div><button className="btn btn-secondary btn-sm" onClick={load}>Refresh</button></div>
    <div className="admin-chat-workspace">
      <aside className="admin-chat-list">
        {loading && <p className="admin-chat-placeholder">Loading conversations…</p>}
        {!loading && chats.length === 0 && <p className="admin-chat-placeholder">No support conversations yet.</p>}
        {chats.map((chat) => <button key={chat.id} onClick={() => setSelectedId(chat.id)} className={selectedId === chat.id ? 'active' : ''}><div><strong>Visitor {chat.id.slice(0,6)}</strong><span className={`chat-status chat-status-${chat.status || 'bot'}`}>{chat.status || 'bot'}</span></div><p>{chat.lastMessage || 'Conversation started'}</p></button>)}
      </aside>
      <section className="admin-chat-thread">
        {!selected ? <div className="admin-chat-placeholder">Select a conversation to view messages.</div> : <>
          <header><div><strong>Visitor {selected.id.slice(0,8)}</strong><p>{selected.assignedTo ? `Assigned to ${selected.assignedTo}` : 'Handled by assistant'}</p></div><span className={`chat-status chat-status-${selected.status || 'bot'}`}>{selected.status || 'bot'}</span></header>
          <div className="admin-chat-messages">{(selected.messages || []).map((message) => <div key={message.id} className={`admin-chat-message admin-chat-message-${message.role}`}><span>{message.text}</span><small>{message.role === 'customer' ? 'Customer' : message.role === 'admin' ? 'Admin' : 'VE Assistant'}</small></div>)}</div>
          <form onSubmit={send}><input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Reply as support team…" maxLength={600}/><button className="btn btn-primary" type="submit">Send reply</button></form>
        </>}
      </section>
    </div>
  </div>;
}
