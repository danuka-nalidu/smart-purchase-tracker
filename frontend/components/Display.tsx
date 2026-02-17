'use client';

interface DisplayProps {
  expression: string;
  result: string;
}

export function Display({ expression, result }: DisplayProps) {
  return (
    <div className="bg-slate-900 rounded-lg p-6 mb-6 shadow-lg">
      <div className="text-right">
        <div className="text-slate-400 text-lg mb-2 h-6 font-mono break-words">
          {expression || '0'}
        </div>
        <div className="text-white text-5xl font-bold font-mono break-words">
          {result}
        </div>
      </div>
    </div>
  );
}
