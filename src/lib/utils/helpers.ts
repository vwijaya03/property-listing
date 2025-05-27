export function priceToFormattedString(valueFloat: number): string {
  const value = Math.floor(valueFloat);
  const length = value.toString().length;

  let divisor = 1;
  let suffix = '';

  if (length >= 4 && length <= 6) {
    divisor = 1_000;
    suffix = 'Ribu';
  } else if (length >= 7 && length <= 9) {
    divisor = 1_000_000;
    suffix = 'Juta';
  } else if (length >= 10 && length <= 12) {
    divisor = 1_000_000_000;
    suffix = 'Milyar';
  } else if (length >= 13) {
    divisor = 1_000_000_000_000;
    suffix = 'Triliun';
  }

  if (divisor === 1) return value.toLocaleString();

  const formatted = parseFloat((value / divisor).toFixed(2)).toString();
  return `Rp. ${formatted} ${suffix}`;
}
