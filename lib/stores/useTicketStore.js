import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTicketStore = create(
  persist(
    (set) => ({
      activeToken: null,
      ticketData: null,
      setToken: (token) => set({ activeToken: token }),
      setTicketData: (data) => set({ ticketData: data }),
      clearAccess: () => set({ activeToken: null, ticketData: null }),
    }),
    {
      name: 'hydroair-ticket-storage',
    }
  )
);

export default useTicketStore;
