'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('ve-cart');
      if (saved) dispatch({ type: 'RESTORE', payload: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem('ve-cart', JSON.stringify(state)); } catch {}
  }, [state]);

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);

  const proceedToWhatsApp = () => {
    if (state.items.length === 0) return;
    const phone = '918072264972';
    let msg = 'Hello Vellore Enterprises,\n\nI would like to inquire about the following products:\n\n';
    state.items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}*\n`;
      if (item.code) msg += `   Code: ${item.code}\n`;
      msg += `   Qty: ${item.quantity}\n`;
      if (item.description) msg += `   ${item.description.substring(0, 80)}...\n`;
      if (item.slug) msg += `   Link: https://www.velloreenterprises.in/products/${item.slug}\n`;
      msg += '\n';
    });
    msg += 'Please share pricing and availability. Thank you!';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <CartContext.Provider value={{ items: state.items, totalItems, addItem, removeItem, updateQuantity, clearCart, proceedToWhatsApp }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
