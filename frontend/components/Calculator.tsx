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
  const addCalculation = useCalculatorStore((s) => s.addCalculation);

  // Helper function to validate expression (no multiple operators in a row)
  const isValidExpression = useCallback((expr: string): boolean => {
    if (!expr) return false;
    // Check for multiple operators in a row
    const operatorRegex = /[+\-*/]{2,}/;
    if (operatorRegex.test(expr)) return false;
    // Check if ends with operator (except for single digit before =)
    if (/[+\-*/]$/.test(expr)) return false;
    return true;
  }, []);

  const handleNumberClick = (num: string) => {
    setExpression((prev) => prev + num);
  };

  const handleOperatorClick = (op: string) => {
    if (!expression) return;
    // Only add operator if expression is valid (doesn't end with operator)
    if (!/[+\-*/]$/.test(expression)) {
      setExpression((prev) => prev + op);
    }
  };

  const handleDecimalClick = () => {
    // Prevent multiple decimals in the same number
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
  };

  const handleEquals = () => {
    if (!isValidExpression(expression)) return;

    try {
      // Replace display operators with JavaScript operators
      const jsExpression = expression
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/−/g, '-');

      // Validate the expression before evaluating
      if (!/^[\d+\-*/.()]+$/.test(jsExpression)) {
        toast.error('Invalid expression');
        return;
      }

      // Use Function constructor instead of eval for better safety
      const fn = new Function('return ' + jsExpression);
      const answer = fn();

      if (!isFinite(answer)) {
        toast.error('Invalid calculation');
        return;
      }

      // Round to 2 decimal places
      const roundedAnswer = Math.round(answer * 100) / 100;

      // Store the calculation
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const time = `${hours}:${minutes}`;

      addCalculation({
        id: generateId(),
        expression,
        result: roundedAnswer,
        date: selectedDate,
        time,
      });

      setResult(String(roundedAnswer));
      setExpression('');
      toast.success('Calculation saved!');
    } catch (error) {
      toast.error('Invalid calculation');
      setResult('0');
    }
  };

  // Update result preview in real-time
  const updateResultPreview = useCallback(() => {
    if (!expression) {
      setResult('0');
      return;
    }

    try {
      const jsExpression = expression
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/−/g, '-');

      // Only evaluate if expression looks valid
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
  }, [expression]);

  // Update preview whenever expression changes
  useEffect(() => {
    updateResultPreview();
  }, [expression, updateResultPreview]);

  const isEqualsDisabled = !isValidExpression(expression);

  return (
    <div className="space-y-6">
      <Display expression={expression} result={result} />
      <Keypad
        onNumberClick={handleNumberClick}
        onOperatorClick={handleOperatorClick}
        onDecimalClick={handleDecimalClick}
        onClear={handleClear}
        onEquals={handleEquals}
        isEqualsDisabled={isEqualsDisabled}
      />
    </div>
  );
}
