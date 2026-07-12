'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import toast from 'react-hot-toast';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, savedItems, removeItem, updateQuantity, totalItems, clearCart, proceedToWhatsApp, saveForLater, moveToCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const drawerRef = useRef(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('cart-is-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('cart-is-open');
      setShowCheckout(false);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('cart-is-open');
    };
  }, [isOpen]);

  const subtotal = items.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    return acc + price * item.quantity;
  }, 0);

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <>
      {isOpen && (
        <button
          className="cart-glass-backdrop fixed inset-0 z-[70] cursor-default"
          onClick={onClose}
          aria-label="Close cart backdrop"
        />
      )}
      <aside
        ref={drawerRef}
        className={`cart-glass-drawer fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-[480px] flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Inquiry cart"
      >
        {/* Header */}
        <div className="cart-glass-header flex items-center justify-between p-6">
          <div>
            <p className="eyebrow mb-1">Inquiry cart</p>
            <h2 className="font-display text-2xl font-bold">
              {totalItems} selected item{totalItems === 1 ? '' : 's'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="cart-close-button grid h-11 w-11 place-items-center rounded-full transition"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="empty-orb">0</div>
                <h3 className="font-display text-2xl font-bold">No products selected</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/55">
                  Add products to build a WhatsApp inquiry with quantities and product details.
                </p>
                <Button href="/products" variant="secondary" className="mt-6" onClick={onClose}>
                  Browse products
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.id} className="cart-glass-item rounded-3xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-[#111824]">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {item.code && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#b80035]">{item.code}</span>
                        )}
                        {item.price && (
                          <span className="text-xs text-[#667085]">INR {item.price}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {saveForLater && (
                        <button
                          onClick={() => saveForLater(item.id)}
                          className="text-xs text-[#667085] transition hover:text-[#b80035] px-2 py-1 rounded"
                          aria-label={`Save ${item.name} for later`}
                        >
                          Save
                        </button>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-[#667085] transition hover:text-[#b80035] px-2 py-1 rounded"
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="cart-quantity inline-flex items-center rounded-full p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="grid h-8 w-8 place-items-center rounded-full text-[#b80035] hover:bg-white transition"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="grid h-8 w-8 place-items-center rounded-full text-[#b80035] hover:bg-white transition"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    {item.price && (
                      <span className="text-sm font-bold text-[#b80035]">
                        INR {(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </article>
              ))}

              {/* Order Notes */}
              <div className="mt-4">
                <label htmlFor="cart-notes" className="admin-label">Order notes</label>
                <textarea
                  id="cart-notes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="input-premium resize-none text-sm"
                  rows={2}
                  placeholder="Special instructions, delivery preferences..."
                />
              </div>
            </div>
          )}

          {/* Saved for Later */}
          {savedItems && savedItems.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="eyebrow mb-3">Saved for later</p>
              <div className="space-y-3">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/70">{item.name}</p>
                    </div>
                    <button
                      onClick={() => moveToCart(item.id)}
                      className="text-xs font-bold text-[#f5d76e] shrink-0 px-3"
                    >
                      Move to cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with pricing */}
        {items.length > 0 && (
          <div className="cart-glass-footer p-6 space-y-4">
            {/* Price breakdown */}
            {subtotal > 0 && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/55">
                  <span>Subtotal</span>
                  <span>INR {subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-white/55">
                  <span>GST (18%)</span>
                  <span>INR {gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-2 border-t border-white/10">
                  <span>Estimated Total</span>
                  <span className="text-[#f5d76e]">INR {total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            <Button variant="whatsapp" onClick={() => setShowCheckout(true)} className="w-full">
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              Proceed to WhatsApp checkout
            </Button>
            
            <button
              onClick={async () => {
                if (generatingPdf) return;
                setGeneratingPdf(true);
                try {
                  const { generatePdfQuote } = await import('@/lib/generatePdfQuote');
                  await generatePdfQuote(items, subtotal, gst, total, orderNotes);
                  toast.success('PDF quotation downloaded.');
                } catch (error) {
                  console.error('[PDF quote]', error);
                  toast.error('Unable to generate the PDF quotation.');
                } finally {
                  setGeneratingPdf(false);
                }
              }}
              disabled={generatingPdf}
              className="cart-pdf-button w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {generatingPdf ? 'Generating PDF…' : 'Download PDF Quote'}
            </button>

            <button
              onClick={clearCart}
              className="w-full rounded-full py-2 mt-2 text-sm text-[#667085] transition hover:text-[#b80035]"
            >
              Clear all items
            </button>
          </div>
        )}
      </aside>

      {showCheckout && (
        <CheckoutForm onClose={() => { setShowCheckout(false); onClose(); }} />
      )}
    </>
  );
}
