'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { COMPANY, buildWhatsAppUrl } from '@/lib/constants';
import { Button } from '@/components/ui';

const initial = {
  name: '',
  phone: '',
  address: '',
  notes: '',
};

export default function CheckoutForm({ onClose }) {
  const { items, totalItems, clearCart } = useCart();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const update = (e) => setForm((v) => ({ ...v, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const generateOrderNumber = () => {
    const now = new Date();
    return `VE-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const orderNumber = generateOrderNumber();
    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });

    let msg = `🔥 *VELLORE ENTERPRISES*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📋 *ORDER INQUIRY*\n`;
    msg += `Order No: *${orderNumber}*\n`;
    msg += `Date: ${timestamp}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `👤 *CUSTOMER DETAILS*\n`;
    msg += `Name: ${form.name}\n`;
    msg += `Phone: ${form.phone}\n`;
    if (form.address) msg += `Address: ${form.address}\n`;
    msg += `\n━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `📦 *PRODUCTS (${totalItems} items)*\n\n`;

    let subtotal = 0;
    items.forEach((item, idx) => {
      const price = parseFloat(item.price) || 0;
      const lineTotal = price * item.quantity;
      subtotal += lineTotal;

      msg += `${idx + 1}. *${item.name}*\n`;
      if (item.code) msg += `   Code: ${item.code}\n`;
      msg += `   Qty: ${item.quantity}\n`;
      if (price > 0) {
        msg += `   Unit Price: ₹${price.toLocaleString('en-IN')}\n`;
        msg += `   Line Total: ₹${lineTotal.toLocaleString('en-IN')}\n`;
      }
      msg += `\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    if (subtotal > 0) {
      const gst = subtotal * 0.18;
      const total = subtotal + gst;
      msg += `💰 *PRICE SUMMARY*\n`;
      msg += `Subtotal: ₹${subtotal.toLocaleString('en-IN')}\n`;
      msg += `GST (18%): ₹${gst.toLocaleString('en-IN')}\n`;
      msg += `*Total: ₹${total.toLocaleString('en-IN')}*\n`;
    } else {
      msg += `💰 *Pricing on request*\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (form.notes) {
      msg += `📝 *DELIVERY NOTES*\n${form.notes}\n\n`;
    }

    msg += `🏢 *${COMPANY.name}*\n`;
    msg += `${COMPANY.addressLine}, ${COMPANY.cityLine}\n`;
    msg += `${COMPANY.phoneDisplay}\n`;
    msg += `${COMPANY.email}\n`;

    window.open(buildWhatsAppUrl(msg), '_blank');
    clearCart();
    onClose?.();
  };

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/72 p-4 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="glass-panel max-h-[92dvh] w-full max-w-lg overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <p className="eyebrow mb-1">Step 2 of 2</p>
            <h2 className="font-display text-2xl font-bold">Your Details</h2>
          </div>
          <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/70" aria-label="Close checkout">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm text-white/50 mb-2">{totalItems} product{totalItems === 1 ? '' : 's'} selected</p>
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between items-center py-1">
                <span className="text-sm truncate max-w-[200px]">{item.name}</span>
                <span className="text-xs text-white/40">x{item.quantity}</span>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-xs text-white/35 mt-1">+{items.length - 3} more items</p>
            )}
          </div>

          <div>
            <label htmlFor="checkout-name" className="admin-label">Name <span className="text-[#f5d76e]">*</span></label>
            <input id="checkout-name" name="name" value={form.name} onChange={update} className="input-premium" placeholder="Your full name" aria-invalid={Boolean(errors.name)} />
            {errors.name && <p className="mt-2 text-sm text-[#ffb199]">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="checkout-phone" className="admin-label">Phone <span className="text-[#f5d76e]">*</span></label>
            <input id="checkout-phone" name="phone" type="tel" value={form.phone} onChange={update} className="input-premium" placeholder="Your phone number" aria-invalid={Boolean(errors.phone)} />
            {errors.phone && <p className="mt-2 text-sm text-[#ffb199]">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="checkout-address" className="admin-label">Delivery Address</label>
            <textarea id="checkout-address" name="address" rows={3} value={form.address} onChange={update} className="input-premium resize-none" placeholder="Your delivery address (optional)" />
          </div>

          <div>
            <label htmlFor="checkout-notes" className="admin-label">Order Notes</label>
            <textarea id="checkout-notes" name="notes" rows={2} value={form.notes} onChange={update} className="input-premium resize-none" placeholder="Special instructions (optional)" />
          </div>

          <Button type="submit" variant="whatsapp" className="w-full">
            <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            Send Order on WhatsApp
          </Button>

          <p className="text-xs text-center text-white/35">
            Your order details will be sent to our WhatsApp for confirmation and pricing
          </p>
        </form>
      </div>
    </div>
  );
}
