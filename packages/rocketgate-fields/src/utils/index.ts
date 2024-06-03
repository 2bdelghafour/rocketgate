import { LOCALES } from "../config/config";
import type { Locale } from "../hooks/use-payment-form-context";

export function padNumberWithZero(number: number, length: number): string {
  return number.toString().padStart(length, "0");
}

export const isValidCreditCardNumber = (creditCardNumber: string): boolean => {
  if (/[^0-9-\s]+/.test(creditCardNumber)) return false;

  const lookup = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
  let index = creditCardNumber.length;
  let x2 = true;
  let sum = 0;

  while (index) {
    const value = creditCardNumber.charCodeAt(--index) - 48;
    if (value < 0 || value > 9) return false;

    x2 = !x2;
    sum += x2 ? lookup[value] : value;
  }

  return sum % 10 === 0;
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export const mergeLocalizations = <
  Localization extends Record<Locale, Record<string, string>>,
>(
  base: Localization,
  source?: DeepPartial<Localization>
): Localization => {
  return LOCALES.reduce((acc, lang) => {
    acc[lang] = {
      ...base[lang],
      ...source?.[lang],
    };

    return acc;
  }, base);
};
