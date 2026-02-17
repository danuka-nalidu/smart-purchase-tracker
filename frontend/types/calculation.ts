export interface DailyCalculation {
  id: string;
  expression: string;
  result: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}
