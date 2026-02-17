export function isSpecialCustomer(expression: string): boolean {
  // Remove spaces for easier parsing
  const cleaned = expression.replace(/\s/g, "");

  // Split by + and - operators to get individual terms
  const parts = cleaned.split(/[\+\-]/);

  // Count how many parts contain multiplication
  const multiplicationCount = parts.filter((part) => part.includes("*")).length;

  // Special if customer purchased 2 or more different items
  return multiplicationCount >= 2;
}
