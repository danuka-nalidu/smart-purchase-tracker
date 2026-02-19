'use client';

import { useCalculatorStore } from '@/store/useCalculatorStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Trash2, Star, Sparkles, History, Lock } from 'lucide-react';
import { Calculation } from '@/lib/api';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { PasswordGate } from '@/components/PasswordGate';
import { useOwnerAuth } from '@/store/useOwnerAuth';

export default function SpecialCustomersPage() {
  const allCalculations = useCalculatorStore((s) => s.calculations);
  const deleteCalculation = useCalculatorStore((s) => s.deleteCalculation);
  const fetchAll = useCalculatorStore((s) => s.fetchAll);
  const { lock } = useOwnerAuth();

  // Load all calculations from the API on mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Filter only special customers
  const specialCalculations = allCalculations.filter((calc) => calc.isSpecial);

  const formatter = new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Group calculations by date
  const groupedCalculations = specialCalculations.reduce((acc, calc) => {
    if (!acc[calc.date]) {
      acc[calc.date] = [];
    }
    acc[calc.date].push(calc);
    return acc;
  }, {} as Record<string, Calculation[]>);

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

  const getTotalAmount = () => {
    return specialCalculations.reduce((sum, calc) => sum + calc.result, 0);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCalculation(id);
      toast.success('Calculation deleted');
    } catch {
      toast.error('Failed to delete. Please try again.');
    }
  };

  return (
    <PasswordGate>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Sparkles className="w-10 h-10 text-amber-500" />
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                  Special Customers
                </h1>
              </div>
              <p className="text-slate-600 text-lg mt-2">
                Customers who purchased multiple items
              </p>
            </div>
            <Link href="/history">
              <Button size="lg" variant="outline" className="gap-2">
                <History className="h-5 w-5" />
                <span className="hidden sm:inline">History</span>
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={lock}
              className="gap-2 border-slate-300 hover:bg-slate-100"
              title="Lock owner access"
            >
              <Lock className="h-5 w-5 text-slate-500" />
              <span className="hidden sm:inline text-slate-600">Lock</span>
            </Button>
          </div>

          {/* Stats Card */}
          {specialCalculations.length > 0 && (
            <Card className="bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg mb-6">
              <CardContent className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-white/80 text-sm font-medium mb-1">
                      Total Special Customers
                    </p>
                    <p className="text-4xl font-bold">
                      {specialCalculations.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/80 text-sm font-medium mb-1">
                      Total Revenue
                    </p>
                    <p className="text-4xl font-bold">
                      {formatter.format(getTotalAmount())}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/80 text-sm font-medium mb-1">
                      Days with Special Customers
                    </p>
                    <p className="text-4xl font-bold">
                      {sortedDates.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {specialCalculations.length === 0 && (
            <Card className="bg-white shadow-lg">
              <CardContent className="py-16">
                <div className="text-center">
                  <Star className="mx-auto h-16 w-16 text-amber-300 mb-4 fill-amber-300" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    No special customers yet
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Special customers are those who purchase multiple items in one transaction
                    <br />
                    <span className="text-sm text-slate-400 mt-2 inline-block">
                      Example: 3*150 + 5*200 (2 or more items)
                    </span>
                  </p>
                  <Link href="/">
                    <Button size="lg" className="bg-amber-500 hover:bg-amber-600">
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
              <Card key={date} className="bg-white shadow-lg mb-6 border-2 border-amber-200">
                <CardHeader className="border-b bg-amber-50/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                        {formatDate(date)}
                      </CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        {dayCalculations.length} special customer{dayCalculations.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Daily Total</p>
                      <p className="text-3xl font-bold text-amber-600">
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
                          key={calc._id}
                          className="flex items-center justify-between p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors border-l-4 border-amber-400"
                        >
                          <div className="flex-1">
                            <div className="flex items-baseline gap-3">
                              <Star className="w-5 h-5 text-amber-500 fill-amber-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-slate-500">
                                {calc.time}
                              </span>
                              <span className="text-lg font-mono text-slate-700">
                                {calc.expression}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-amber-600 min-w-[100px] text-right">
                              {formatter.format(calc.result)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(calc._id)}
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
    </PasswordGate>
  );
}
