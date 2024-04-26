"use client";

import { useRef, useEffect, useImperativeHandle, useState } from "react";
import {
  CSRF_TOKEN_FIELD,
  IOVATION_FIELD,
  PAYMENT_METHOD_FIELD,
} from "./config/config";
import type {
  Errors,
  PaymentFormContextProps,
} from "./hooks/use-payment-form-context";
import {
  PaymentFormProvider,
  usePaymentFormContext,
} from "./hooks/use-payment-form-context";
import type { DeepPartial } from "./utils";
import { DeviceFingerprintingForm } from "./forms/device-fingerprinting-form";
import { StepUpForm } from "./forms/step-up-form";

declare global {
  interface Window {
    rocketGateForm: HTMLFormElement | null;
    RocketGateSetSubmitCB: (callback: (form: HTMLFormElement) => void) => void;
    RocketGateLoadFields: (fieldsWrapperID: string) => void;
    RocketGateSubmitFields: (e: React.FormEvent<HTMLFormElement>) => void;
    io_bbout_element_id: string;
    io_enable_rip: boolean;
    io_install_stm: boolean;
    io_exclude_stm: number;
    io_install_flash: boolean;
  }
}

export interface RocketGateCardFields {
  token: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  bin: string;
  ioBlackBox?: string;
}
export interface RocketGateFieldsProps {
  src: string;
  children: React.ReactNode;
  formRef?: React.RefObject<Pick<HTMLFormElement, "submit">>;
  className?: string;
  scrub?: boolean;
  onFormReady?: () => void;
  onCardSubmitted: (fields: RocketGateCardFields) => void;
}

interface RocketGateFieldsWithContextProps extends RocketGateFieldsProps {
  localization?: DeepPartial<PaymentFormContextProps["localization"]>;
  onFormError?: (errors: Errors) => void;
}

function RocketGateFields({
  src,
  children,
  formRef,
  className,
  scrub = false,
  onFormReady,
  onCardSubmitted,
}: RocketGateFieldsProps): JSX.Element {
  const { handleSubmit, formData } = usePaymentFormContext();
  const innerFormRef = useRef<HTMLFormElement>(null);
  const cardFieldsRef = useRef<HTMLDivElement>(null);
  const ioBlackBoxRef = useRef<HTMLInputElement>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);

  useImperativeHandle(
    formRef,
    () => ({
      submit: () => {
        const form = innerFormRef.current;

        if (form) {
          const syntheticEvent = new Event("submit", {
            bubbles: true,
            cancelable: true,
          });

          form.dispatchEvent(syntheticEvent);
        }
      },
    }),
    []
  );

  useEffect(() => {
    const iovationScript = document.createElement("script");
    const script = document.createElement("script");
    script.id = "rg-script";
    script.src = src;
    script.async = true;
    script.onload = () => {
      try {
        window.rocketGateForm = innerFormRef.current;
        window.RocketGateSetSubmitCB((form: HTMLFormElement): void => {
          const tokenFormData = new FormData(form);
          const token = tokenFormData
            .get("RocketGateToken")
            ?.toString()
            .replace("\n", "");

          if (token) setPaymentToken(token);
        });
        window.RocketGateLoadFields("rg-card-fields");
      } catch {
        console.error("RocketGate script failed to load");
      }
    };
    document.body.appendChild(script);

    if (scrub) {
      window.io_bbout_element_id = IOVATION_FIELD;
      window.io_enable_rip = true;
      window.io_install_stm = false;
      window.io_exclude_stm = 12;
      window.io_install_flash = false;
      iovationScript.id = "rg-iovation-script";
      iovationScript.src = "https://mpsnare.iesnare.com/snare.js";
      document.body.appendChild(iovationScript);
    }

    return () => {
      document.body.removeChild(script);
      if (scrub) document.body.removeChild(iovationScript);
    };
  }, [src, scrub]);

  useEffect(() => {
    const cardFieldsElement = cardFieldsRef.current;
    const cardFieldsObserver = new MutationObserver((mutations) => {
      if (mutations[0].addedNodes.length > 0) {
        const csrfTokenField = document.getElementById(
          CSRF_TOKEN_FIELD
        ) as HTMLInputElement | null;

        if (csrfTokenField) {
          setCsrfToken(csrfTokenField.value);
          onFormReady?.();
        }
      }
    });

    if (cardFieldsElement)
      cardFieldsObserver.observe(cardFieldsElement, { childList: true });

    return () => {
      cardFieldsObserver.disconnect();
    };
  }, [onFormReady]);

  useEffect(() => {
    if (paymentToken) {
      const bin = formData.cardNumber.substring(0, 6);

      onCardSubmitted({
        token: paymentToken,
        ...formData,
        bin,
        ioBlackBox: ioBlackBoxRef.current?.value,
      });
      setPaymentToken(null);
    }
  }, [paymentToken, onCardSubmitted, formData]);

  return (
    <>
      {!csrfToken && (
        <div
          id="rg-card-fields"
          ref={cardFieldsRef}
          style={{ display: "none" }}
        />
      )}

      <form
        className={className}
        id="rg-payment-form"
        noValidate
        onSubmit={handleSubmit}
        ref={innerFormRef}
      >
        <input id={PAYMENT_METHOD_FIELD} type="hidden" value="card" />
        {csrfToken ? (
          <input id={CSRF_TOKEN_FIELD} type="hidden" value={csrfToken} />
        ) : null}
        {scrub ? (
          <input id={IOVATION_FIELD} ref={ioBlackBoxRef} type="hidden" />
        ) : null}

        {children}
      </form>

      <DeviceFingerprintingForm />
      <StepUpForm />
    </>
  );
}

RocketGateFields.displayName = "RocketGateFields";

export default function RocketGateFieldsWithContext({
  localization,
  onFormError,
  ...props
}: RocketGateFieldsWithContextProps): JSX.Element {
  return (
    <PaymentFormProvider localization={localization} onFormError={onFormError}>
      <RocketGateFields {...props} />
    </PaymentFormProvider>
  );
}
