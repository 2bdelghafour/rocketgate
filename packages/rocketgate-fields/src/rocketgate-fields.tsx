"use client";

import type { FormEvent, ReactNode, RefObject } from "react";
import { useRef, useEffect, useImperativeHandle, useState } from "react";
import {
  CARD_NUMBER_FIELD,
  CSRF_TOKEN_FIELD,
  CVV_FIELD,
  EXPIRY_MONTH_FIELD,
  EXPIRY_YEAR_FIELD,
  PAYMENT_METHOD_FIELD,
} from "./config/config";

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

export function RocketGateFields({
  src,
  children,
  formRef,
  className,
  onFormReady,
}: RocketGateFieldsProps): JSX.Element {
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

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const cardNumber = formData.get(CARD_NUMBER_FIELD);
    const expiryMonth = formData.get(EXPIRY_MONTH_FIELD);
    const expiryYear = formData.get(EXPIRY_YEAR_FIELD);
    const cvv = formData.get(CVV_FIELD);

    console.log({ cardNumber, expiryMonth, expiryYear, cvv });
  };

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
        onSubmit={onSubmit}
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
