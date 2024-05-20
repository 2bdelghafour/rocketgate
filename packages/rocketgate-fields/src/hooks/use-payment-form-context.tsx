"use client";

import { createContext, useContext, useState } from "react";
import type { z } from "zod";
import { ZodError } from "zod";
import { paymentFormSchema } from "../utils/schema";
import type { DeepPartial } from "../utils";
import { mergeLocalizations } from "../utils";

type FormData = z.infer<ReturnType<typeof paymentFormSchema>>;

export type Errors = z.inferFlattenedErrors<
  ReturnType<typeof paymentFormSchema>
>;

export type Locale =
  | "EN"
  | "PT"
  | "ES"
  | "IT"
  | "NL"
  | "DE"
  | "FR"
  | "PL"
  | "JP";

export interface PaymentFormContextProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  formErrors: Errors | null;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  localization: {
    label: {
      [locale in Locale]: {
        cardNumber: string;
        expiryMonth: string;
        expiryYear: string;
        cvv: string;
      };
    };
    error: {
      [locale in Locale]: {
        cardNumber: string;
        expiryMonth: string;
        expiryYear: string;
        cvv: string;
        terms: string;
        expiry: string;
      };
    };
  };
  locale: Locale;
}

const baseLocalization: PaymentFormContextProps["localization"] = {
  label: {
    EN: {
      cardNumber: "Card Number",
      expiryMonth: "Expiry Month",
      expiryYear: "Expiry Year",
      cvv: "CVV",
    },
    PT: {
      cardNumber: "Número do cartão",
      expiryMonth: "Mês de validade",
      expiryYear: "Ano de validade",
      cvv: "CVV",
    },
    ES: {
      cardNumber: "Número de tarjeta",
      expiryMonth: "Mes de caducidad",
      expiryYear: "Año de caducidad",
      cvv: "CVV",
    },
    IT: {
      cardNumber: "Numero di carta",
      expiryMonth: "Mese di scadenza",
      expiryYear: "Anno di scadenza",
      cvv: "CVV",
    },
    NL: {
      cardNumber: "Kaartnummer",
      expiryMonth: "Maand vervaldatum",
      expiryYear: "Vervaldatum jaar",
      cvv: "CVV",
    },
    DE: {
      cardNumber: "Kartennummer",
      expiryMonth: "Gültigkeitsmonat",
      expiryYear: "Gültigkeitsjahr",
      cvv: "CVV",
    },
    FR: {
      cardNumber: "Numéro de la carte",
      expiryMonth: "Mois d'expiration",
      expiryYear: "Année d'expiration",
      cvv: "CVV",
    },
    PL: {
      cardNumber: "Numer karty",
      expiryMonth: "Miesiąc ważności",
      expiryYear: "Rok ważności",
      cvv: "CVV",
    },
    JP: {
      cardNumber: "カード番号",
      expiryMonth: "有効期限月",
      expiryYear: "有効期限年",
      cvv: "CVV",
    },
  },
  error: {
    EN: {
      cardNumber: "Missing or invalid card number",
      expiryMonth: "Missing or invalid expiry month",
      expiryYear: "Missing or invalid expiry year",
      cvv: "Missing or invalid CVV",
      terms: "You must agree to the terms",
      expiry: "Expiry must be in the future",
    },
    PT: {
      cardNumber: "Número de cartão ausente ou inválido",
      expiryMonth: "Mês de vencimento inválido",
      expiryYear: "Ano de vencimento inválido",
      cvv: "CVV inválido",
      terms: "Aceite os termos",
      expiry: "A expiração deve ser futura",
    },
    ES: {
      cardNumber: "Falta el número de tarjeta o no es válido",
      expiryMonth: "Mes de caducidad no válido o no introducido",
      expiryYear: "Año de caducidad no válido o no introducido",
      cvv: "CVV no válido o no introducido",
      terms: "Debe aceptar los términos",
      expiry: "La fecha de caducidad debe ser futura",
    },
    IT: {
      cardNumber: "Numero di carta mancante o non valido",
      expiryMonth: "Mese di scadenza mancante o non valido",
      expiryYear: "Anno di scadenza mancante o non valido",
      cvv: "CVV mancante o non valido",
      terms: "Devi accettare i termini",
      expiry: "La scadenza deve essere futura",
    },
    NL: {
      cardNumber: "Ontbrekend of ongeldig kaartnummer",
      expiryMonth: "Ongeldige vervaldatum maand",
      expiryYear: "Ongeldig vervaldatum jaar",
      cvv: "Ongeldige CVV",
      terms: "U moet akkoord gaan met de voorwaarden",
      expiry: "Vervaldatum moet in de toekomst liggen",
    },
    DE: {
      cardNumber: "Fehlende oder ungültige Kartennummer",
      expiryMonth: "Fehlendes oder ungültiges Verfallsdatum Monat.",
      expiryYear: "Fehlendes oder ungültiges Verfallsjahr.",
      cvv: "Fehlende oder ungültige CVV.",
      terms: "Sie müssen den Bedingungen zustimmen.",
      expiry: "Verfall muss in der Zukunft liegen",
    },
    FR: {
      cardNumber: "Numéro de carte manquant ou invalide",
      expiryMonth: "Mois d'expiration invalide",
      expiryYear: "Année d'expiration invalide",
      cvv: "CVV invalide",
      terms: "Acceptez les termes",
      expiry: "L'expiration doit avoir lieu dans le futur",
    },
    PL: {
      cardNumber: "Brakujący lub nieprawidłowy numer karty",
      expiryMonth: "Brakujący lub nieprawidłowy miesiąc ważności",
      expiryYear: "Brakujący lub nieprawidłowy rok ważności",
      cvv: "Brakujący lub nieprawidłowy kod CVV",
      terms: "Należy zaakceptować warunki",
      expiry: "Termin ważności musi przypadać w przyszłości",
    },
    JP: {
      cardNumber: "カード番号の欠落または無効",
      expiryMonth: "有効期限の月が不明または無効",
      expiryYear: "有効期限がない、または無効",
      cvv: "CVVの欠落または無効",
      terms: "条件に同意する必要があります。",
      expiry: "有効期限が将来であること",
    },
  },
};

const PaymentFormContext = createContext<PaymentFormContextProps | undefined>(
  undefined
);

export function PaymentFormProvider({
  children,
  locale = "EN",
  localization: sourceLocalization,
  onFormError,
}: {
  children: React.ReactNode;
  locale?: Locale;
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
    label: mergeLocalizations(
      baseLocalization.label,
      sourceLocalization?.label
    ),
    error: mergeLocalizations(
      baseLocalization.error,
      sourceLocalization?.error
    ),
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e): void => {
    try {
      e.preventDefault();

      paymentFormSchema(localization.error[locale]).parse(formData);
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
        locale,
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
