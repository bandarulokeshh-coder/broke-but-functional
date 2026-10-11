export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, 200);
}

export function sanitizeAmount(amount: string): number {
  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0 || parsed > 1000000) return 0;
  return Math.round(parsed * 100) / 100;
}