'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { DateSelector } from '@/components/DateSelector';
import { Calculator } from '@/components/Calculator';
import { DailySummary } from '@/components/DailySummary';
import { DailyList } from '@/components/DailyList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { History, Star, Lock, Unlock, X, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useOwnerAuth } from '@/store/useOwnerAuth';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [shake, setShake] = useState(false);

  const { isOwnerUnlocked, unlock, lock } = useOwnerAuth();

  // Set default to today on mount
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setSelectedDate(today);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleUnlock = () => {
    const success = unlock(password);
    if (success) {
      setShowLockModal(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword('');
    }
  };

  const handleLock = () => {
    lock();
  };

  const closeModal = () => {
    setShowLockModal(false);
    setPassword('');
    setPasswordError('');
    setShowPassword(false);
  };

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

            <div className="flex gap-2 items-center">
              {isOwnerUnlocked ? (
                /* Owner view: show nav buttons + lock button */
                <>
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
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleLock}
                    className="gap-2 border-green-300 bg-green-50 hover:bg-green-100 text-green-700"
                    title="Lock owner access"
                  >
                    <Unlock className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                /* Public view: only show lock icon */
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowLockModal(true)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 w-10 h-10 rounded-full"
                  title="Owner access"
                >
                  <Lock className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Owner mode banner */}
          {isOwnerUnlocked && (
            <div className="mt-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                Owner view active — all transactions and totals are visible
              </p>
            </div>
          )}
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

        {/* Daily Summary — only visible to owner */}
        {isOwnerUnlocked && <DailySummary date={selectedDate} />}

        {/* Daily Calculations List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Recent Calculations
          </h2>
          {isOwnerUnlocked ? (
            /* Owner: show all calculations */
            <DailyList date={selectedDate} limit={5} />
          ) : (
            /* Public: show only ≤ Rs.10,000 */
            <DailyList date={selectedDate} limit={5} maxAmount={10000} />
          )}
        </div>
      </div>

      {/* Password Modal */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 ${shake ? '' : ''}`}
            style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center shadow-lg">
                <Lock className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Owner Access</h2>
              <p className="text-slate-500 text-sm">
                Enter the owner password to view all transactions
              </p>
            </div>

            {/* Password input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  placeholder="Enter password"
                  autoFocus
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {passwordError && (
                <p className="mt-2 text-red-500 text-sm">⚠ {passwordError}</p>
              )}
            </div>

            {/* Unlock button */}
            <Button
              onClick={handleUnlock}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Unlock
            </Button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </main>
  );
}
