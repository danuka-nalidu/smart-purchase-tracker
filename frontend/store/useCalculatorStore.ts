'use client';

import { create } from 'zustand';
import { DailyCalculation } from '@/types/calculation';

interface CalculatorStore {
  calculations: DailyCalculation[];
  addCalculation: (calculation: DailyCalculation) => void;
  deleteCalculation: (id: string) => void;
  getCalculationsByDate: (date: string) => DailyCalculation[];
  getDailyTotal: (date: string) => number;
}

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  calculations: [],

  addCalculation: (calculation: DailyCalculation) => {
    set((state) => ({
      calculations: [calculation, ...state.calculations],
    }));
  },

  deleteCalculation: (id: string) => {
    set((state) => ({
      calculations: state.calculations.filter((calc) => calc.id !== id),
    }));
  },

  getCalculationsByDate: (date: string) => {
    const { calculations } = get();
    return calculations
      .filter((calc) => calc.date === date)
      .sort((a, b) => {
        // Sort by time, latest first
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return (
          timeB[0] * 60 + timeB[1] - (timeA[0] * 60 + timeA[1])
        );
      });
  },

  getDailyTotal: (date: string) => {
    const { calculations } = get();
    return calculations
      .filter((calc) => calc.date === date)
      .reduce((sum, calc) => sum + calc.result, 0);
  },
}));
