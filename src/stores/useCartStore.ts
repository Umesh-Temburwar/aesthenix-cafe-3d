import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductSize } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, size: ProductSize, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTaxAmount: () => number; // 5% GST
  getPackagingFee: () => number; // ₹40 or free above ₹500
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, size: ProductSize, quantity = 1) => {
        const itemId = `${product.id}-${size.name.toLowerCase()}`;
        const unitPrice = Math.round(product.price * size.priceMultiplier);

        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => item.id === itemId);

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                id: itemId,
                product,
                size,
                quantity,
                unitPrice,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, delta: number) => {
        set((state) => {
          const updatedItems = state.items
            .map((item) => {
              if (item.id === itemId) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);

          return { items: updatedItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getTaxAmount: () => {
        // 5% Café GST
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * 0.05);
      },

      getPackagingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 600 ? 0 : 40;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal + get().getTaxAmount() + get().getPackagingFee();
      },
    }),
    {
      name: 'aura-roast-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
