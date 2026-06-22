export type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

export const BRAND_META: Record<
  Exclude<CardBrand, "unknown">,
  { label: string; length: number; cvcLength: number }
> = {
  visa: { label: "Visa", length: 16, cvcLength: 3 },
  mastercard: { label: "Mastercard", length: 16, cvcLength: 3 },
  amex: { label: "American Express", length: 15, cvcLength: 4 },
};

export function detectCardBrand(value: string): CardBrand {
  const num = value.replace(/\D/g, "");
  if (/^4/.test(num)) return "visa";
  if (/^3[47]/.test(num)) return "amex";
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[01]\d|2720)/.test(num)) {
    return "mastercard";
  }
  return "unknown";
}

export function maxDigits(brand: CardBrand): number {
  return brand === "amex" ? 15 : 16;
}

export function formatCardNumber(value: string): string {
  const brand = detectCardBrand(value);
  const num = value.replace(/\D/g, "").slice(0, maxDigits(brand));
  if (brand === "amex") {
    return num
      .replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" ")
      )
      .trim();
  }
  return num.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function luhnValid(value: string): boolean {
  const num = value.replace(/\D/g, "");
  if (num.length < 12) return false;
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function isCardComplete(value: string): boolean {
  const brand = detectCardBrand(value);
  if (brand === "unknown") return false;
  const num = value.replace(/\D/g, "");
  return num.length === BRAND_META[brand].length && luhnValid(num);
}
