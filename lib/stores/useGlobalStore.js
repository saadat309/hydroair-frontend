import { create } from 'zustand';

export const useGlobalStore = create((set) => ({
  isMaintenanceMode: false,
  setMaintenanceMode: (value) => set({ isMaintenanceMode: value }),
}));
