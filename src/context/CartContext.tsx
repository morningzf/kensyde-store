"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { numericPrice, type Product } from "@/data/products";

export type CartItem = {
  sku: string;
  slug: string;
  name: string;
  price: number | null;
  color: string;
  capacity: string;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number, options?: { color?: string; capacity?: string }) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  removeItem: (sku: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "kensyde-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = useCallback<CartContextValue["addItem"]>((product, quantity = 1, options) => {
    setItems((current) => {
      const key = `${product.sku}-${options?.color || product.color}-${options?.capacity || product.capacity}`;
      const existing = current.find((item) => item.sku === key);

      if (existing) {
        return current.map((item) =>
          item.sku === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [
        ...current,
        {
          sku: key,
          slug: product.slug,
          name: product.name,
          price: product.price,
          color: options?.color || product.color,
          capacity: options?.capacity || product.capacity,
          image: product.image,
          quantity
        }
      ];
    });
  }, []);

  const updateQuantity = useCallback((sku: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) => (item.sku === sku ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((sku: string) => {
    setItems((current) => current.filter((item) => item.sku !== sku));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + numericPrice(item.price) * item.quantity, 0);

    return { items, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart };
  }, [addItem, clearCart, items, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
