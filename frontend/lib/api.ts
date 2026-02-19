// Base URL for the backend API
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Typed response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Generic fetch helper that checks for success and parses JSON
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "API request failed");
  }

  return json.data as T;
}

// --- Calculation API calls ---

export interface Calculation {
  _id: string;
  expression: string;
  result: number;
  date: string;
  time: string;
  isSpecial: boolean;
}

export interface DailySummary {
  date: string;
  total: number;
  count: number;
}

export const api = {
  // Save a new calculation
  createCalculation: (body: Omit<Calculation, "_id">) =>
    request<Calculation>("/api/calculations", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Get all calculations for a specific date
  getByDate: (date: string) =>
    request<Calculation[]>(`/api/calculations?date=${date}`),

  // Delete a calculation by ID
  deleteCalculation: (id: string) =>
    request<void>(`/api/calculations/${id}`, { method: "DELETE" }),

  // Get daily total + count
  getDailySummary: (date: string) =>
    request<DailySummary>(`/api/calculations/summary?date=${date}`),

  // Get all calculations (history)
  getHistory: () =>
    request<Calculation[]>("/api/calculations/history"),

  // Get special-customer calculations only
  getSpecial: () =>
    request<Calculation[]>("/api/calculations/special"),
};
