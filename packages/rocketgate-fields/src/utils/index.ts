import { LOCALES } from "../config/config";
import type { Locale } from "../hooks/use-payment-form-context";

export function padNumberWithZero(number: number, length: number): string {
  return number.toString().padStart(length, "0");
}

export const isValidCreditCardNumber = (creditCardNumber: string): boolean => {
  if (/[^0-9-\s]+/.test(creditCardNumber)) return false;

  const creditCardNumberArray = creditCardNumber.replace(/\D/g, "").split("");
  const creditCardNumberArrayLength = creditCardNumberArray.length;

  if (creditCardNumberArrayLength < 13 || creditCardNumberArrayLength > 19)
    return false;

  const sum = creditCardNumberArray
    .map((digit, index) => {
      let digitValue = parseInt(digit, 10);
      if (index % 2 === 0 && (digitValue *= 2) > 9) return digitValue - 9;

      return digitValue;
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

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
