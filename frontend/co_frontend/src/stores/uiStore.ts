import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  xpGainAmount: number | null;
  showXpPopup: (amount: number) => void;
  hideXpPopup: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  xpGainAmount: null,

  showXpPopup: (amount: number) => {
    set({ xpGainAmount: amount });
    setTimeout(() => {
      set({ xpGainAmount: null });
    }, 3000);
  },

  hideXpPopup: () => set({ xpGainAmount: null }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
