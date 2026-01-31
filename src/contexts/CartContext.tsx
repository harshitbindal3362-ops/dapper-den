import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/database';

interface CartItemLocal {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

interface CartContextType {
  items: CartItemLocal[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemLocal[]>(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedColor === selectedColor
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stock_quantity);
        updated[existingIndex].quantity = newQty;
        return updated;
      }
      
      return [...prev, { product, quantity: Math.min(quantity, product.stock_quantity), selectedColor }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string, selectedColor?: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedColor === selectedColor)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    
    setItems(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedColor === selectedColor) {
        return { ...item, quantity: Math.min(quantity, item.product.stock_quantity) };
      }
      return item;
    }));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
      isOpen,
      setIsOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
