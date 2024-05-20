import * as z from "zod";
import { isValidCreditCardNumber } from ".";

// matches a string representing a number from 1 to 12 inclusive.
const expoiryMonthRegEx = /^(?:[1-9]|1[0-2])$/;
// matches a string that consists of exactly 2 digits.
const expiryYearRegEx = /^\d{2}$/;
// matches a string that consists of exactly 3 or 4 digits.
const cvvRegEx = /^\d{3,4}$/;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- It is best leaving type inferation type to Zod
export const paymentFormSchema = (localization?: Record<string, string>) =>
  z
    .object({
      cardNumber: z.string().refine((value) => isValidCreditCardNumber(value), {
        message: localization?.cardNumber,
      }),
      expiryMonth: z.string().refine((value) => expoiryMonthRegEx.test(value), {
        message: localization?.expiryMonth,
      }),
      expiryYear: z
        .string()
        .refine(
          (value) =>
            expiryYearRegEx.test(value) &&
            parseInt(value) >= new Date().getFullYear() % 100,
          {
            message: localization?.expiryYear,
          }
        ),
      cvv: z.string().refine((value) => cvvRegEx.test(value), {
        message: localization?.cvv,
      }),
      terms: z.boolean().refine((value) => value, {
        message: localization?.terms,
      }),
    })
    .refine(
      ({ expiryMonth, expiryYear }) => {
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const selectedYear = parseInt(expiryYear);
        const selectedMonth = parseInt(expiryMonth);

        return (
          selectedYear > currentYear ||
          (selectedYear === currentYear && selectedMonth >= currentMonth)
        );
      },
      {
        message: localization?.expiry,
        path: ["expiryMonth"],
      }
    );
