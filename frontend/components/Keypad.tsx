'use client';

import { Button } from '@/components/ui/button';

interface KeypadProps {
  onNumberClick: (num: string) => void;
  onOperatorClick: (op: string) => void;
  onDecimalClick: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  isEqualsDisabled: boolean;
}

export function Keypad({
  onNumberClick,
  onOperatorClick,
  onDecimalClick,
  onClear,
  onBackspace,
  onEquals,
  isEqualsDisabled,
}: KeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {/* Row 1 */}
      <Button
        onClick={() => onNumberClick('7')}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-slate-100"
      >
        7
      </Button>
      <Button
        onClick={() => onNumberClick('8')}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-slate-100"
      >
        8
      </Button>
      <Button
        onClick={() => onNumberClick('9')}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-slate-100"
      >
        9
      </Button>
      <Button
        onClick={() => onOperatorClick('/')}
        className="h-20 text-2xl font-bold bg-orange-500 hover:bg-orange-600 text-white"
      >
        ÷
      </Button>

      {/* Row 2 */}
      <Button
        onClick={() => onNumberClick('4')}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-slate-100"
      >
        4
      </Button>
      <Button
        onClick={() => onNumberClick('5')}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-slate-100"
      >
        5
      </Button>
      <Button
        onClick={() => onNumberClick('6')}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-slate-100"
      >
        6
      </Button>
      <Button
        onClick={() => onOperatorClick('*')}
        className="h-20 text-2xl font-bold bg-orange-500 hover:bg-orange-600 text-white"
      >
        ×
      </Button>

      {/* Row 3 */}
      <Button
        onClick={() => onNumberClick('1')}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-slate-100"
      >
        1
      </Button>
      <Button
        onClick={() => onNumberClick('2')}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-slate-100"
      >
        2
      </Button>
      <Button
        onClick={() => onNumberClick('3')}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-slate-100"
      >
        3
      </Button>
      <Button
        onClick={() => onOperatorClick('-')}
        className="h-20 text-2xl font-bold bg-orange-500 hover:bg-orange-600 text-white"
      >
        −
      </Button>

      {/* Row 4 */}
      <Button
        onClick={() => onNumberClick('0')}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-slate-100"
      >
        0
      </Button>
      <Button
        onClick={onDecimalClick}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-slate-100"
      >
        .
      </Button>
      <Button
        onClick={onBackspace}
        variant="outline"
        className="h-20 text-2xl font-bold hover:bg-red-50"
      >
        ⌫
      </Button>
      <Button
        onClick={onClear}
        variant="destructive"
        className="h-20 text-2xl font-bold"
      >
        C
      </Button>

      {/* Row 5 */}
      <Button
        onClick={() => onOperatorClick('+')}
        className="col-span-2 h-20 text-2xl font-bold bg-orange-500 hover:bg-orange-600 text-white"
      >
        +
      </Button>
      <Button
        onClick={onEquals}
        disabled={isEqualsDisabled}
        className="col-span-2 h-20 text-2xl font-bold bg-green-600 hover:bg-green-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        =
      </Button>
    </div>
  );
}
