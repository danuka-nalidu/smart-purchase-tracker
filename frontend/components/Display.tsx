'use client';

interface DisplayProps {
  expression: string;
  result: string;
  isMultiItem?: boolean;
  runningTotal?: number;
}

export function Display({ expression, result, isMultiItem, runningTotal }: DisplayProps) {
  return (
    <div className={`rounded-lg p-6 mb-6 shadow-lg transition-colors duration-300 ${isMultiItem ? 'bg-purple-950' : 'bg-slate-900'}`}>
      {/* Multi-item mode indicator */}
      {isMultiItem && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-purple-700">
          <span className="text-purple-300 text-sm font-semibold tracking-wide">⭐ SPECIAL CUSTOMER</span>
          <span className="ml-auto text-purple-200 text-sm font-mono">
            Running: Rs. {(runningTotal ?? 0).toLocaleString()}
          </span>
        </div>
      )}
      <div className="text-right">
        <div className="text-slate-400 text-lg mb-2 h-6 font-mono break-words">
          {expression || (isMultiItem ? 'Enter next item...' : '0')}
        </div>
        <div className={`text-5xl font-bold font-mono break-words ${isMultiItem ? 'text-purple-100' : 'text-white'}`}>
          {result}
        </div>
      </div>
    </div>
  );
}
