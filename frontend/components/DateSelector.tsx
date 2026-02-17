'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const selectedDateObj = new Date(selectedDate + 'T00:00:00');
  const formattedDate = format(selectedDateObj, 'EEEE, MMMM d, yyyy');

  const handlePreviousDay = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    onDateChange(format(date, 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    onDateChange(format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousDay}
          className="h-10 w-10 p-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              {formattedDate}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDateObj}
              onSelect={(date) => {
                if (date) {
                  onDateChange(format(date, 'yyyy-MM-dd'));
                }
              }}
              disabled={(date) =>
                date > new Date() ? true : false
              }
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextDay}
          className="h-10 w-10 p-0"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
