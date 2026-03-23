export function normalizeCurrency(input: string | number): number {
  if (typeof input === 'number') return input;
  const sanitized = input.replace(/[R$\s.]/g, '').replace(',', '.');
  const value = parseFloat(sanitized);
  return isNaN(value) ? 0 : value;
}
