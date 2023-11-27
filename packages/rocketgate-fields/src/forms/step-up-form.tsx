"use client";

import { useEffect, useRef } from "react";
import { useInternalPaymentFlowContext } from "../hooks/use-payment-flow-context";

export function StepUpForm(): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  const { state } = useInternalPaymentFlowContext();

  const {
    status,
    redirectionUrl,
    metadata,
    stepUpUrl,
    stepUpJwt,
    acsUrl,
    paReq,
  } = state;
  const isStepUp = ["three_d_1", "three_d_2"].includes(status);
  const formAction = status === "three_d_1" ? acsUrl : stepUpUrl;

  useEffect(() => {
    if (isStepUp) formRef.current?.submit();
  }, [isStepUp]);

  return (
    <>
      {isStepUp ? (
        <>
          <iframe
            name="rg-3ds-step-up"
            sandbox="allow-scripts allow-top-navigation allow-forms allow-same-origin"
            src=""
            style={{
              width: "100%",
              height: "100%",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 99999,
              backgroundColor: "white",
            }}
            title="3D Secure Step Up"
          />
          <form
            action={formAction}
            method="POST"
            ref={formRef}
            style={{ display: "none" }}
            target="rg-3ds-step-up"
          >
            <input name="MD" type="hidden" value={JSON.stringify(metadata)} />

            {status === "three_d_1" && (
              <>
                <input name="PaReq" type="hidden" value={paReq} />
                <input name="TermUrl" type="hidden" value={redirectionUrl} />
              </>
            )}

            {status === "three_d_2" && (
              <input name="JWT" type="hidden" value={stepUpJwt} />
            )}
          </form>
        </>
      ) : null}
    </>
  );
}
