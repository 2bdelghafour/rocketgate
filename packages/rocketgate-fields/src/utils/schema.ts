import * as z from "zod";
import { isValidCreditCardNumber } from ".";

// matches a string representing a number from 1 to 12 inclusive.
const expoiryMonthRegEx = /^(?:[1-9]|1[0-2])$/;
// matches a string that consists of exactly 2 digits.
const expiryYearRegEx = /^\d{2}$/;
// matches a string that consists of exactly 3 or 4 digits.
const cvvRegEx = /^\d{3,4}$/;

export const paymentFormSchema = z
  .object({
    cardNumber: z.string().refine((value) => isValidCreditCardNumber(value), {
      message: "Missing or invalid card number",
    }),
    expiryMonth: z.string().refine((value) => expoiryMonthRegEx.test(value), {
      message: "Missing or invalid expiry month",
    }),
    expiryYear: z
      .string()
      .refine(
        (value) =>
          expiryYearRegEx.test(value) &&
          parseInt(value) >= new Date().getFullYear() % 100,
        {
          message: "Missing or invalid expiry year",
        }
      ),
    cvv: z.string().refine((value) => cvvRegEx.test(value), {
      message: "Missing or invalid CVV",
    }),
    terms: z.boolean().refine((value) => value, {
      message: "You must agree to the terms",
    }),
    ioBlackBox: z.string().optional(),
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
      message: "Expiry must be in the future",
      path: ["expiryMonth"],
    }
  );
