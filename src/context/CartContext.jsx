import React, { createContext, useContext, useMemo, useReducer, useEffect } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    case "ADD": {
      const { id, qty = 1 } = action;
      const next = { ...state.items };
      next[id] = (next[id] || 0) + qty;
      return { ...state, items: next, isOpen: true };
    }
    case "SET_QTY": {
      const { id, qty } = action;
      const next = { ...state.items };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return { ...state, items: next };
    }
    case "REMOVE": {
      const next = { ...state.items };
      delete next[action.id];
      return { ...state, items: next };
    }
    case "CLEAR":
      return { ...state, items: {} };
    default:
      return state;
  }
}

const STORAGE_KEY = "fashion_spa_cart_v1";

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { isOpen: false, items: {} });

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw);
        if (items && typeof items === "object") {
          dispatch({ type: "CLEAR" });
          // restore via SET_QTY to validate
          Object.entries(items).forEach(([id, qty]) => {
            if (Number.isFinite(qty) && qty > 0) dispatch({ type: "SET_QTY", id, qty });
          });
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const api = useMemo(() => {
    const count = Object.values(state.items).reduce((s, n) => s + n, 0);
    return {
      isOpen: state.isOpen,
      items: state.items,
      count,
      open: () => dispatch({ type: "OPEN" }),
      close: () => dispatch({ type: "CLOSE" }),
      toggle: () => dispatch({ type: "TOGGLE" }),
      add: (id, qty = 1) => dispatch({ type: "ADD", id, qty }),
      setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.isOpen, state.items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
