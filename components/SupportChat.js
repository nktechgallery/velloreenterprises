'use client';

import { useEffect, useRef, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { supportBotReply, wantsHuman } from '@/lib/supportBot';

const welcome = { id: 'welcome', role: 'bot', text: 'Hello! How can I help with your fire-safety requirement today?', createdAt: Date.now() };

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    let id = localStorage.getItem('ve-support-session');
    if (!id) { id = crypto.randomUUID(); localStorage.setItem('ve-support-session', id); }
    setSessionId(id);
    getDoc(doc(db, 'support_chats', id)).then((snap) => {
      if (snap.exists() && Array.isArray(snap.data().messages)) setMessages(snap.data().messages);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!open || !sessionId) return;
    const refresh = async () => {
      try {
        const snapshot = await getDoc(doc(db, 'support_chats', sessionId));
        if (snapshot.exists() && Array.isArray(snapshot.data().messages)) setMessages(snapshot.data().messages);
      } catch {}
    };
    const timer = setInterval(refresh, 8000);
    return () => clearInterval(timer);
  }, [open, sessionId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, open]);

  const send = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setSending(true); setInput('');
    const userMessage = { id: crypto.randomUUID(), role: 'customer', text, createdAt: Date.now() };
    const botMessage = { id: crypto.randomUUID(), role: 'bot', text: supportBotReply(text), createdAt: Date.now() + 1 };
    const next = [...messages, userMessage, botMessage];
    setMessages(next);
    try {
      await setDoc(doc(db, 'support_chats', sessionId), {
        sessionId, messages: next, status: wantsHuman(text) ? 'waiting' : 'bot',
        lastMessage: text.slice(0, 160), updatedAt: serverTimestamp(), createdAt: serverTimestamp(),
      }, { merge: true });
    } catch {}
    setSending(false);
  };

  return <div className="support-chat-root">
    {open && <section className="support-chat-panel" aria-label="Customer support chat">
      <header><div><span className="support-status" /> <strong>Safety support</strong><p>AI assistant · Admin handoff available</p></div><button onClick={() => setOpen(false)} aria-label="Close chat">×</button></header>
      <div className="support-chat-messages" aria-live="polite">
        {messages.map((message) => <div key={message.id} className={`support-message support-message-${message.role}`}><span>{message.text}</span><small>{message.role === 'customer' ? 'You' : message.role === 'admin' ? 'Support team' : 'VE Assistant'}</small></div>)}
        <div ref={endRef} />
      </div>
      <div className="support-quick-actions"><button onClick={() => setInput('I need product recommendations')}>Products</button><button onClick={() => setInput('I need an AMC quotation')}>AMC quote</button><button onClick={() => setInput('Connect me with an admin')}>Talk to admin</button></div>
      <form onSubmit={send}><label className="sr-only" htmlFor="support-message">Message</label><input id="support-message" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your requirement…" maxLength={600}/><button type="submit" disabled={!input.trim() || sending} aria-label="Send message">→</button></form>
    </section>}
    <button className="support-chat-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Open support chat"><span>{open ? '×' : '◌'}</span><b>{open ? 'Close' : 'Support'}</b></button>
  </div>;
}
