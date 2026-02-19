'use client';

import { useCalculatorStore } from '@/store/useCalculatorStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState, useEffect } from 'react';
import { Trash2, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface DailyListProps {
  date: string;
  limit?: number;
  maxAmount?: number;
}

export function DailyList({ date, limit, maxAmount }: DailyListProps) {
  const allCalculations = useCalculatorStore((s) =>
    s.getCalculationsByDate(date)
  );
  // Filter by maxAmount if provided (public view hides > Rs.10,000 entries)
  const filtered = maxAmount !== undefined
    ? allCalculations.filter((c) => c.result <= maxAmount)
    : allCalculations;
  const calculations = limit ? filtered.slice(0, limit) : filtered;
  const deleteCalculation = useCalculatorStore((s) => s.deleteCalculation);
  const fetchByDate = useCalculatorStore((s) => s.fetchByDate);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load data from API when date changes
  useEffect(() => {
    fetchByDate(date);
  }, [date, fetchByDate]);

  const formatter = new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (calculations.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <p className="text-slate-500 text-lg">No calculations for this date yet.</p>
      </Card>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead className="w-12"></TableHead>
              <TableHead className="font-bold text-slate-900">Time</TableHead>
              <TableHead className="font-bold text-slate-900">Calculation</TableHead>
              <TableHead className="text-right font-bold text-slate-900">
                Amount (LKR)
              </TableHead>
              <TableHead className="w-12 text-center font-bold text-slate-900">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculations.map((calc) => (
              <TableRow
                key={calc._id}
                className={calc.isSpecial ? "hover:bg-amber-50 bg-amber-50/50 border-l-4 border-amber-400" : "hover:bg-slate-50"}
              >
                <TableCell className="text-center">
                  {calc.isSpecial && (
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{calc.time}</TableCell>
                <TableCell className="font-mono text-sm">{calc.expression}</TableCell>
                <TableCell className="text-right font-bold text-slate-900">
                  {formatter.format(calc.result)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(calc._id)}
                    className="hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-3">
        {calculations.map((calc) => (
          <Card
            key={calc._id}
            className={calc.isSpecial ? "p-4 bg-amber-50 border-amber-400 border-l-4" : "p-4"}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {calc.isSpecial && (
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium text-slate-600">
                      {calc.time}
                    </p>
                  </div>
                  <p className="font-mono text-sm text-slate-900 mt-1">
                    {calc.expression}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(calc._id)}
                  className="hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">
                  {formatter.format(calc.result)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Calculation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this calculation? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteId) {
                  try {
                    await deleteCalculation(deleteId);
                    toast.success('Calculation deleted');
                  } catch {
                    toast.error('Failed to delete. Please try again.');
                  }
                  setDeleteId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
