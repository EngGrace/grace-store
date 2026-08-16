"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  qty: number;
  maxQty: number; // available stock
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: { _id: string; name: string; price: number; image: string; description: string; quantity: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("grace_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("grace_cart", JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = (product: { _id: string; name: string; price: number; image: string; description: string; quantity: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        // Don't exceed available stock
        if (existing.qty >= product.quantity) return prev;
        return prev.map(i =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        qty: 1,
        maxQty: product.quantity,
      }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) {
      removeItem(id);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i._id === id ? { ...i, qty: Math.min(qty, i.maxQty) } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
