'use client';

import { useState, useCallback, useEffect } from 'react';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { toast } from 'sonner';

interface CalculatorProps {
  selectedDate: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function Calculator({ selectedDate }: CalculatorProps) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');

  // Multi-item state
  const [runningTotal, setRunningTotal] = useState<number>(0);
  const [accumulatedExpression, setAccumulatedExpression] = useState<string>('');
  const [isMultiItem, setIsMultiItem] = useState(false);

  const addCalculation = useCalculatorStore((s) => s.addCalculation);

  // Helper function to validate expression (no multiple operators in a row)
  const isValidExpression = useCallback((expr: string): boolean => {
    if (!expr) return false;
    // Check for multiple operators in a row
    const operatorRegex = /[+\-*/]{2,}/;
    if (operatorRegex.test(expr)) return false;
    // Check if ends with operator
    if (/[+\-*/]$/.test(expr)) return false;
    return true;
  }, []);

  const handleNumberClick = (num: string) => {
    setExpression((prev) => prev + num);
  };

  const handleOperatorClick = (op: string) => {
    if (!expression) return;
    if (!/[+\-*/]$/.test(expression)) {
      setExpression((prev) => prev + op);
    }
  };

  const handleDecimalClick = () => {
    const lastOperatorIndex = Math.max(
      expression.lastIndexOf('+'),
      expression.lastIndexOf('-'),
      expression.lastIndexOf('*'),
      expression.lastIndexOf('/')
    );
    const currentNumber = expression.substring(lastOperatorIndex + 1);
    if (!currentNumber.includes('.')) {
      setExpression((prev) => prev + '.');
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
    // Also reset multi-item state
    setRunningTotal(0);
    setAccumulatedExpression('');
    setIsMultiItem(false);
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  // Evaluate the current expression and return the numeric result, or null if invalid
  const evaluateExpression = useCallback((expr: string): number | null => {
    try {
      const jsExpression = expr
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/−/g, '-');

      if (!/^[\d+\-*/.()]+$/.test(jsExpression)) return null;

      const fn = new Function('return ' + jsExpression);
      const answer = fn();
      if (!isFinite(answer)) return null;
      return Math.round(answer * 100) / 100;
    } catch {
      return null;
    }
  }, []);

  // "+ Item" button handler — accumulate current item and clear for next
  const handleAddItem = () => {
    if (!isValidExpression(expression)) {
      toast.error('Enter a valid calculation first');
      return;
    }

    const answer = evaluateExpression(expression);
    if (answer === null) {
      toast.error('Invalid calculation');
      return;
    }

    const newRunningTotal = runningTotal + answer;
    const newAccumulatedExpression = accumulatedExpression
      ? `${accumulatedExpression} + ${expression}`
      : expression;

    setRunningTotal(newRunningTotal);
    setAccumulatedExpression(newAccumulatedExpression);
    setIsMultiItem(true);

    // Clear for next item — show running total subtly in result
    setExpression('');
    setResult(String(newRunningTotal));

    toast.info(`Item added — Rs. ${answer.toLocaleString()}. Running total: Rs. ${newRunningTotal.toLocaleString()}`);
  };

  const handleEquals = () => {
    if (!isValidExpression(expression)) return;

    const answer = evaluateExpression(expression);
    if (answer === null) {
      toast.error('Invalid calculation');
      setResult('0');
      return;
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    if (isMultiItem) {
      // Multi-item: combine everything into one record
      const finalTotal = runningTotal + answer;
      const finalExpression = accumulatedExpression
        ? `${accumulatedExpression} + ${expression}`
        : expression;

      addCalculation({
        id: generateId(),
        expression: finalExpression,
        result: finalTotal,
        date: selectedDate,
        time,
        isSpecial: true,
      });

      setResult(String(finalTotal));
      setExpression('');
      setRunningTotal(0);
      setAccumulatedExpression('');
      setIsMultiItem(false);

      toast.success(`Special Customer ⭐ — Total Rs. ${finalTotal.toLocaleString()} saved!`);
    } else {
      // Normal single-item calculation
      addCalculation({
        id: generateId(),
        expression,
        result: answer,
        date: selectedDate,
        time,
        isSpecial: false,
      });

      setResult(String(answer));
      setExpression('');

      toast.success('Calculation saved!');
    }
  };

  // Update result preview in real-time
  const updateResultPreview = useCallback(() => {
    if (!expression) {
      // If in multi-item mode, show running total when expression is empty
      if (isMultiItem) {
        setResult(String(runningTotal));
      } else {
        setResult('0');
      }
      return;
    }

    try {
      const jsExpression = expression
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/−/g, '-');

      if (/^[\d+\-*/.()]+$/.test(jsExpression) && !/[+\-*/.]$/.test(expression)) {
        const fn = new Function('return ' + jsExpression);
        const answer = fn();
        if (isFinite(answer)) {
          setResult(String(Math.round(answer * 100) / 100));
        }
      }
    } catch {
      // Keep previous result
    }
  }, [expression, isMultiItem, runningTotal]);

  useEffect(() => {
    updateResultPreview();
  }, [expression, updateResultPreview]);

  const isEqualsDisabled = !isValidExpression(expression);
  const isAddItemDisabled = !isValidExpression(expression);

  return (
    <div className="space-y-6">
      <Display
        expression={expression}
        result={result}
        isMultiItem={isMultiItem}
        runningTotal={runningTotal}
      />
      <Keypad
        onNumberClick={handleNumberClick}
        onOperatorClick={handleOperatorClick}
        onDecimalClick={handleDecimalClick}
        onClear={handleClear}
        onBackspace={handleBackspace}
        onEquals={handleEquals}
        onAddItem={handleAddItem}
        isEqualsDisabled={isEqualsDisabled}
        isAddItemDisabled={isAddItemDisabled}
        isMultiItem={isMultiItem}
      />
    </div>
  );
}
