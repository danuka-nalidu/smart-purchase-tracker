'use client';

import { Card } from '@/components/ui/card';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { format } from 'date-fns';

interface DailySummaryProps {
  date: string;
}

export function DailySummary({ date }: DailySummaryProps) {
  const calculations = useCalculatorStore((s) =>
    s.getCalculationsByDate(date)
  );
  const dailyTotal = useCalculatorStore((s) => s.getDailyTotal(date));

  const formatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
      <div className="space-y-4">
        <div>
          <p className="text-slate-600 text-sm font-medium">Date</p>
          <p className="text-slate-900 text-lg font-semibold">
            {formattedDate}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Amount (LKR)</p>
            <p className="text-slate-900 text-2xl font-bold">
              {formatter.format(dailyTotal)}
            </p>
          </div>
          <div>
            <p className="text-slate-600 text-sm font-medium">Number of Calculations</p>
            <p className="text-slate-900 text-2xl font-bold">
              {calculations.length}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
