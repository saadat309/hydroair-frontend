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
        const itemId = product.documentId || product.id;
        const existingItem = items.find((item) => (item.documentId || item.id) === itemId);

        let newItems;
        if (existingItem) {
          newItems = items.map((item) =>
            (item.documentId || item.id) === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [...items, { 
            id: itemId, 
            documentId: product.documentId,
            quantity: 1,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            international_currency: product.international_currency
          }];
        }

        const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        set({ items: newItems, totalItems, totalPrice });
      },

      refreshItem: (id, localizedData) => {
        const { items } = get();
        const newItems = items.map((item) =>
          (item.documentId || item.id) === id ? { ...item, ...localizedData } : item
        );
        set({ items: newItems });
      },

      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter((item) => (item.documentId || item.id) !== productId);
        
        const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        set({ items: newItems, totalItems, totalPrice });
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();
        if (quantity < 1) return;

        const newItems = items.map((item) =>
          (item.documentId || item.id) === productId ? { ...item, quantity } : item
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
