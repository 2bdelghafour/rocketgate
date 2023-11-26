"use client";

import type { ReactNode, RefObject } from "react";
import { useRef, useEffect, useImperativeHandle, useState } from "react";
import { CSRF_TOKEN_FIELD, PAYMENT_METHOD_FIELD } from "./config/config";
import type { PaymentFormContextProps } from "./utils/payment-form-context";
import {
  PaymentFormProvider,
  usePaymentFormContext,
} from "./utils/payment-form-context";
import type { DeepPartial } from "./utils";

declare global {
  interface Window {
    RocketGateLoadFields: (fieldsWrapperID: string) => void;
  }
}

export interface RocketGateFieldsProps {
  src: string;
  children: ReactNode;
  formRef?: RefObject<Pick<HTMLFormElement, "submit">>;
  className?: string;
  onFormReady?: () => void;
}

interface RocketGateFieldsWithContextProps extends RocketGateFieldsProps {
  localization?: DeepPartial<PaymentFormContextProps["localization"]>;
}

function RocketGateFields({
  src,
  children,
  formRef,
  className,
  onFormReady,
}: RocketGateFieldsProps): JSX.Element {
  const { handleSubmit } = usePaymentFormContext();
  const innerFormRef = useRef<HTMLFormElement>(null);
  const cardFieldsRef = useRef<HTMLDivElement>(null);
  const [csrfToken, setCsrfToken] = useState("");

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
    const script = document.createElement("script");
    script.id = "rg-script";
    script.src = src;
    script.async = true;
    script.onload = () => {
      try {
        window.RocketGateLoadFields("rg-card-fields");
      } catch {
        console.error("RocketGate script failed to load");
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src]);

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
        {csrfToken.length > 0 && (
          <input id={CSRF_TOKEN_FIELD} type="hidden" value={csrfToken} />
        )}

        {children}
      </form>
    </>
  );
}

RocketGateFields.displayName = "RocketGateFields";

export default function RocketGateFieldsWithContext({
  localization,
  ...props
}: RocketGateFieldsWithContextProps): JSX.Element {
  return (
    <PaymentFormProvider localization={localization}>
      <RocketGateFields {...props} />
    </PaymentFormProvider>
  );
}
