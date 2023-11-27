"use client";

import { useEffect, useRef } from "react";
import { useInternalPaymentFlowContext } from "../hooks/use-payment-flow-context";

export function DeviceFingerprintingForm(): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  const { state, dispatch } = useInternalPaymentFlowContext();

  const { status, deviceCollectionUrl, deviceCollectionJwt } = state;

  useEffect(() => {
    const handleDeviceFingerPrinting = ({
      origin,
      data,
    }: MessageEvent<string>): void => {
      try {
        if (origin.includes("cardinalcommerce.com") && data) {
          const { Status, SessionId: deviceFingerprintingId } = JSON.parse(
            data
          ) as {
            MessageType: string;
            SessionId: string;
            Status: boolean;
          };

          if (Status) {
            dispatch({ type: "FINGERPRINTED", deviceFingerprintingId });
          } else {
            dispatch({ type: "ERROR", message: "Error getting Cardinal data" });
          }
        }
      } catch (err) {
        dispatch({ type: "ERROR", message: "Error parsing Cardinal data" });
      }
    };

    if (status === "fingerprinting") {
      formRef.current?.submit();

      window.addEventListener("message", handleDeviceFingerPrinting);
    }

    return () => {
      window.removeEventListener("message", handleDeviceFingerPrinting);
    };
  }, [status, dispatch]);

  return (
    <>
      {status === "fingerprinting" && (
        <>
          <iframe
            name="rg-device-fingerprinting"
            src=""
            style={{ display: "none" }}
            title="3D Secure"
          />
          <form
            action={deviceCollectionUrl}
            method="POST"
            ref={formRef}
            style={{ display: "none" }}
            target="rg-device-fingerprinting"
          >
            <input name="JWT" type="hidden" value={deviceCollectionJwt} />
          </form>
        </>
      )}
    </>
  );
}
