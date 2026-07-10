'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';
import { COMPANY, buildWhatsAppUrl, productSlug } from '@/lib/constants';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SAVE_FOR_LATER': {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return state;
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
        savedItems: [...state.savedItems, { ...item, quantity: 1 }],
      };
    }
    case 'MOVE_TO_CART': {
      const saved = state.savedItems.find((i) => i.id === action.payload);
      if (!saved) return state;
      const alreadyInCart = state.items.find((i) => i.id === action.payload);
      return {
        ...state,
        savedItems: state.savedItems.filter((i) => i.id !== action.payload),
        items: alreadyInCart
          ? state.items.map((i) => i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i)
          : [...state.items, { ...saved, quantity: 1 }],
      };
    }
    case 'RESTORE':
      return {
        items: Array.isArray(action.payload?.items) ? action.payload.items : [],
        savedItems: Array.isArray(action.payload?.savedItems) ? action.payload.savedItems : [],
      };
    default:
      return state;
  }
};

const initialState = { items: [], savedItems: [] };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('ve-cart');
      if (saved) dispatch({ type: 'RESTORE', payload: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('ve-cart', JSON.stringify(state));
    } catch {}
  }, [state]);

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const saveForLater = (id) => dispatch({ type: 'SAVE_FOR_LATER', payload: id });
  const moveToCart = (id) => dispatch({ type: 'MOVE_TO_CART', payload: id });

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);

  const proceedToWhatsApp = () => {
    if (state.items.length === 0) return;
    let msg = `Hello ${COMPANY.name},\n\nI would like to inquire about the following products:\n\n`;
    state.items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}*\n`;
      if (item.code) msg += `   Code: ${item.code}\n`;
      msg += `   Qty: ${item.quantity}\n`;
      if (item.price) msg += `   Price: INR ${item.price}\n`;
      if (item.description) msg += `   ${item.description.substring(0, 80)}...\n`;
      msg += `   Link: ${COMPANY.domain}/products/${productSlug(item)}\n`;
      msg += '\n';
    });
    msg += 'Please share pricing and availability. Thank you!';
    window.open(buildWhatsAppUrl(msg), '_blank');
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        savedItems: state.savedItems,
        totalItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        saveForLater,
        moveToCart,
        proceedToWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
