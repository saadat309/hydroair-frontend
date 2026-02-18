import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        let newItems;
        if (existingItem) {
          newItems = items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [...items, { ...product, quantity: 1 }];
        }

        const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        set({ items: newItems, totalItems, totalPrice });
      },

      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== productId);
        
        const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        set({ items: newItems, totalItems, totalPrice });
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();
        if (quantity < 1) return;

        const newItems = items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );

        const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        set({ items: newItems, totalItems, totalPrice });
      },

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
