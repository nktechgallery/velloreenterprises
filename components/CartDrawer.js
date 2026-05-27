'use client';
import { useCart } from '@/context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, totalItems, clearCart, proceedToWhatsApp } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[#111] border-l border-[rgba(201,162,39,0.2)] z-[70] flex flex-col transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(201,162,39,0.15)]">
          <div>
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}>
              INQUIRY CART
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 transition-colors" aria-label="Close cart">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-gray-400 text-sm">Your inquiry cart is empty.</p>
              <p className="text-gray-600 text-xs mt-1">Browse our products and add items to inquire.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-[#1a1a1a] border border-[rgba(201,162,39,0.1)] rounded">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                  {item.code && <p className="text-xs text-[#C9A227] mt-0.5">Code: {item.code}</p>}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-[rgba(201,162,39,0.3)] rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-[#C9A227] hover:bg-[rgba(201,162,39,0.1)] transition-colors text-sm"
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="px-3 text-sm text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-[#C9A227] hover:bg-[rgba(201,162,39,0.1)] transition-colors text-sm"
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors ml-auto"
                      aria-label={`Remove ${item.name} from cart`}
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[rgba(201,162,39,0.15)] space-y-3">
            <button
              onClick={proceedToWhatsApp}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm tracking-wider transition-all duration-300 btn-shimmer"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M11.979 0C5.362 0 0 5.373 0 11.979c0 2.09.546 4.052 1.497 5.762L0 24l6.421-1.685c1.63.891 3.5 1.403 5.558 1.403C18.596 23.718 24 18.345 24 11.739 24 5.133 18.596 0 11.979 0zm0 21.733c-1.795 0-3.47-.48-4.905-1.315l-.352-.208-3.636.953.977-3.536-.228-.362C2.803 15.636 2.267 13.869 2.267 11.979c0-5.37 4.352-9.733 9.712-9.733s9.712 4.363 9.712 9.733-4.352 9.754-9.712 9.754z"/>
              </svg>
              SEND INQUIRY ON WHATSAPP
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear all items
            </button>
          </div>
        )}
      </div>
    </>
  );
}
