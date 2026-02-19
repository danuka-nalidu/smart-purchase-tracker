import { create } from 'zustand';

const OWNER_PASSWORD = 'raptor2025';

interface OwnerAuthStore {
  isOwnerUnlocked: boolean;
  unlock: (password: string) => boolean;
  lock: () => void;
}

export const useOwnerAuth = create<OwnerAuthStore>((set) => ({
  isOwnerUnlocked: false,

  unlock: (password: string) => {
    if (password === OWNER_PASSWORD) {
      set({ isOwnerUnlocked: true });
      return true;
    }
    return false;
  },

  lock: () => {
    set({ isOwnerUnlocked: false });
  },
}));
