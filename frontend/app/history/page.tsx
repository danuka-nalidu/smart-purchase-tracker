'use client';

import { useCalculatorStore } from '@/store/useCalculatorStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Trash2, Calendar } from 'lucide-react';
import { DailyCalculation } from '@/types/calculation';

export default function HistoryPage() {
  const calculations = useCalculatorStore((s) => s.calculations);
  const deleteCalculation = useCalculatorStore((s) => s.deleteCalculation);

  const formatter = new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Group calculations by date
  const groupedCalculations = calculations.reduce((acc, calc) => {
    if (!acc[calc.date]) {
      acc[calc.date] = [];
    }
    acc[calc.date].push(calc);
    return acc;
  }, {} as Record<string, DailyCalculation[]>);

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedCalculations).sort((a, b) => 
    b.localeCompare(a)
  );

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const getDayTotal = (date: string) => {
    return groupedCalculations[date].reduce((sum, calc) => sum + calc.result, 0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              Calculation History
            </h1>
            <p className="text-slate-600 text-lg mt-2">
              View all your past calculations
            </p>
          </div>
        </div>

        {/* Empty State */}
        {calculations.length === 0 && (
          <Card className="bg-white shadow-lg">
            <CardContent className="py-16">
              <div className="text-center">
                <Calendar className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No calculations yet
                </h3>
                <p className="text-slate-500 mb-6">
                  Start adding calculations to see them here
                </p>
                <Link href="/">
                  <Button size="lg">
                    Go to Calculator
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calculations by Date */}
        {sortedDates.map((date) => {
          const dayCalculations = groupedCalculations[date];
          const dayTotal = getDayTotal(date);

          return (
            <Card key={date} className="bg-white shadow-lg mb-6">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">
                      {formatDate(date)}
                    </CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      {dayCalculations.length} calculation{dayCalculations.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Daily Total</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatter.format(dayTotal)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {dayCalculations
                    .sort((a, b) => {
                      // Sort by time, latest first
                      const timeA = a.time.split(':').map(Number);
                      const timeB = b.time.split(':').map(Number);
                      return (
                        timeB[0] * 60 + timeB[1] - (timeA[0] * 60 + timeA[1])
                      );
                    })
                    .map((calc) => (
                      <div
                        key={calc.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-baseline gap-3">
                            <span className="text-sm font-medium text-slate-500">
                              {calc.time}
                            </span>
                            <span className="text-lg font-mono text-slate-700">
                              {calc.expression}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-green-600 min-w-[100px] text-right">
                            {formatter.format(calc.result)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCalculation(calc.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
