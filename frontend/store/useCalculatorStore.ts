'use client';

import { create } from 'zustand';
import { api, Calculation } from '@/lib/api';

interface CalculatorStore {
  calculations: Calculation[];
  isLoading: boolean;

  // Load calculations for a specific date from the API
  fetchByDate: (date: string) => Promise<void>;

  // Load all calculations (for history and special pages)
  fetchAll: () => Promise<void>;

  // Save a new calculation and add it to local state
  addCalculation: (body: Omit<Calculation, '_id'>) => Promise<void>;

  // Delete a calculation by ID
  deleteCalculation: (id: string) => Promise<void>;

  // Derived helpers (computed from local cache)
  getCalculationsByDate: (date: string) => Calculation[];
  getDailyTotal: (date: string) => number;
}

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  calculations: [],
  isLoading: false,

  fetchByDate: async (date: string) => {
    set({ isLoading: true });
    try {
      const data = await api.getByDate(date);
      // Merge fetched records into the local cache 
      set((state) => {
        const others = state.calculations.filter((c) => c.date !== date);
        return { calculations: [...others, ...data], isLoading: false };
      });
    } catch (err) {
      console.error('Failed to fetch calculations:', err);
      set({ isLoading: false });
    }
  },

  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const data = await api.getHistory();
      set({ calculations: data, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch history:', err);
      set({ isLoading: false });
    }
  },

  addCalculation: async (body) => {
    const created = await api.createCalculation(body);
    // Prepend to local cache so the UI updates immediately
    set((state) => ({ calculations: [created, ...state.calculations] }));
  },

  deleteCalculation: async (id: string) => {
    await api.deleteCalculation(id);
    set((state) => ({
      calculations: state.calculations.filter((c) => c._id !== id),
    }));
  },

  getCalculationsByDate: (date: string) => {
    return get()
      .calculations.filter((c) => c.date === date)
      .sort((a, b) => {
        // Sort by time, latest first
        const [ah, am] = a.time.split(':').map(Number);
        const [bh, bm] = b.time.split(':').map(Number);
        return bh * 60 + bm - (ah * 60 + am);
      });
  },

  getDailyTotal: (date: string) => {
    return get()
      .calculations.filter((c) => c.date === date)
      .reduce((sum, c) => sum + c.result, 0);
  },
}));
