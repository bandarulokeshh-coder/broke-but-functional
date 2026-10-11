export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>"'&]/g, (char) => {
      const map: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return map[char] || char;
    })
    .trim()
    .slice(0, 100);
}

export function sanitizeAmount(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed <= 0 || parsed > 1000000) return 0;
  return Math.round(parsed * 100) / 100;
}