'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { DateSelector } from '@/components/DateSelector';
import { Calculator } from '@/components/Calculator';
import { DailySummary } from '@/components/DailySummary';
import { DailyList } from '@/components/DailyList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { History, Star } from 'lucide-react';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Set default to today on mount
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setSelectedDate(today);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start gap-4 mb-2">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 text-balance">
                Purchase Calculator
              </h1>
              <p className="text-slate-600 text-lg mt-2">
                Track your daily business calculations
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/special-customers">
                <Button size="lg" variant="outline" className="gap-2 bg-amber-50 border-amber-300 hover:bg-amber-100">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span className="hidden sm:inline">Special</span>
                </Button>
              </Link>
              <Link href="/history">
                <Button size="lg" variant="outline" className="gap-2">
                  <History className="h-5 w-5" />
                  <span className="hidden sm:inline">History</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Calculator */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <Calculator selectedDate={selectedDate} />
        </div>

        {/* Daily Summary */}
        <DailySummary date={selectedDate} />

        {/* Daily Calculations List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Recent Calculations
          </h2>
          <DailyList date={selectedDate} limit={5} />
        </div>
      </div>
    </main>
  );
}
