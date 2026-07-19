// Formata progressivamente para (dd)9dddd-dddd.
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  const area = digits.slice(0, 2);
  const nine = digits.slice(2, 3);
  const part1 = digits.slice(3, 7);
  const part2 = digits.slice(7, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${area}`;
  if (digits.length <= 3) return `(${area})${nine}`;
  if (digits.length <= 7) return `(${area})${nine}${part1}`;
  return `(${area})${nine}${part1}-${part2}`;
}
