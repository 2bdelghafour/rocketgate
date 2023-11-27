"use client";

import { createContext, useContext, useState } from "react";
import type { z } from "zod";
import { ZodError } from "zod";
import { paymentFormSchema } from "../utils/schema";
import type { DeepPartial } from "../utils";

type FormData = z.infer<typeof paymentFormSchema>;

export type Errors = z.inferFlattenedErrors<typeof paymentFormSchema>;

export interface PaymentFormContextProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  formErrors: Errors | null;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  localization: {
    label: {
      cardNumber: string;
      expiryMonth: string;
      expiryYear: string;
      cvv: string;
    };
  };
}

const baseLocalization: PaymentFormContextProps["localization"] = {
  label: {
    cardNumber: "Card Number",
    expiryMonth: "Expiry Month",
    expiryYear: "Expiry Year",
    cvv: "CVV",
  },
};

const PaymentFormContext = createContext<PaymentFormContextProps | undefined>(
  undefined
);

export function PaymentFormProvider({
  children,
  localization: sourceLocalization,
  onFormError,
}: {
  children: React.ReactNode;
  localization?: DeepPartial<PaymentFormContextProps["localization"]>;
  onFormError?: (errors: Errors) => void;
}): JSX.Element {
  const [formErrors, setFormErrors] = useState<Errors | null>(null);
  const [formData, setFormData] = useState<FormData>({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    terms: false,
  });

  const localization: PaymentFormContextProps["localization"] = {
    label: {
      ...baseLocalization.label,
      ...sourceLocalization?.label,
    },
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e): void => {
    try {
      e.preventDefault();

      paymentFormSchema.parse(formData);
      window.RocketGateSubmitFields(e);
      setFormErrors(null);
    } catch (error) {
      if (error instanceof ZodError) {
        const flatError = error.flatten();

        setFormErrors(flatError);
        onFormError?.(flatError);
      }
    }
  };

  return (
    <PaymentFormContext.Provider
      value={{
        formData,
        setFormData,
        formErrors,
        handleSubmit,
        localization,
      }}
    >
      {children}
    </PaymentFormContext.Provider>
  );
}

export const usePaymentFormContext = (): PaymentFormContextProps => {
  const context = useContext(PaymentFormContext);

  if (!context) {
    throw new Error(
      "usePaymentFormContext must be used within a PaymentFormProvider"
    );
  }

  return context;
};
