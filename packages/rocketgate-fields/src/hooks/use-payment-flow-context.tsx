"use client";

import { createContext, useCallback, useContext, useReducer } from "react";

type Status =
  | "ready"
  | "tokenized"
  | "fingerprinting"
  | "fingerprinted"
  | "three_d_1"
  | "three_d_2";

interface ErrorAction {
  type: "ERROR";
  message: string;
}

interface MetadataAction {
  type: "METADATA";
  metadata: Record<string, string>;
}

interface FingerprintingAction {
  type: "FINGERPRINTING";
  deviceCollectionUrl: string;
  deviceCollectionJwt: string;
}

interface FingerprintedAction {
  type: "FINGERPRINTED";
  deviceFingerprintingId: string;
}

interface StepUpOneAction {
  type: "STEP_UP_1";
  guidNo: string;
  paReq: string;
  acsUrl: string;
}

interface StepUpTwoAction {
  type: "STEP_UP_2";
  guidNo: string;
  stepUpUrl: string;
  stepUpJwt: string;
}

interface PaymentState {
  status: Status;
  error: string | null;
  metadata: Record<string, string>;
  redirectionUrl: string;
  deviceCollectionUrl?: string;
  deviceCollectionJwt?: string;
  deviceFingerprintingId?: string;
  paReq?: string;
  acsUrl?: string;
  stepUpUrl?: string;
  stepUpJwt?: string;
  guidNo?: string;
}

type PaymentAction =
  | MetadataAction
  | ErrorAction
  | FingerprintingAction
  | FingerprintedAction
  | StepUpOneAction
  | StepUpTwoAction;

const initialState: PaymentState = {
  status: "ready",
  error: null,
  redirectionUrl: "",
  metadata: {},
};

interface PaymentFlowContextProps {
  state: PaymentState;
  dispatch: React.Dispatch<PaymentAction>;
  handleDeviceFingerPrinting: (
    params: Omit<FingerprintingAction, "type">
  ) => void;
  handleStepUpForm: (
    params: Omit<StepUpOneAction, "type"> | Omit<StepUpTwoAction, "type">
  ) => void;
  setMetadata: (metadata: Record<string, string>) => void;
}

const reducer = (state: PaymentState, action: PaymentAction): PaymentState => {
  console.log({ action });

  switch (action.type) {
    case "METADATA":
      return {
        ...state,
        metadata: action.metadata,
      };
    case "FINGERPRINTING":
      return {
        ...state,
        status: "fingerprinting",
        deviceCollectionUrl: action.deviceCollectionUrl,
        deviceCollectionJwt: action.deviceCollectionJwt,
      };
    case "FINGERPRINTED":
      return {
        ...state,
        status: "fingerprinted",
        deviceFingerprintingId: action.deviceFingerprintingId,
      };
    case "STEP_UP_1":
      return {
        ...state,
        status: "three_d_1",
        guidNo: action.guidNo,
        acsUrl: action.acsUrl,
        paReq: action.paReq,
      };
    case "STEP_UP_2":
      return {
        ...state,
        status: "three_d_2",
        guidNo: action.guidNo,
        stepUpUrl: action.stepUpUrl,
        stepUpJwt: action.stepUpJwt,
      };
    default:
      return state;
  }
};

const PaymentFlowContext = createContext<PaymentFlowContextProps | undefined>(
  undefined
);

export function PaymentFlowProvider({
  children,
  redirectionUrl,
}: {
  children: React.ReactNode;
  redirectionUrl: string;
}): JSX.Element {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    redirectionUrl,
  });

  const handleDeviceFingerPrinting = useCallback(
    ({
      deviceCollectionUrl,
      deviceCollectionJwt,
    }: Omit<FingerprintingAction, "type">): void => {
      dispatch({
        type: "FINGERPRINTING",
        deviceCollectionUrl,
        deviceCollectionJwt,
      });
    },
    []
  );

  const handleStepUpForm = useCallback(
    ({
      guidNo,
      ...params
    }: Omit<StepUpOneAction, "type"> | Omit<StepUpTwoAction, "type">): void => {
      if ("stepUpUrl" in params && "stepUpJwt" in params) {
        const { stepUpUrl, stepUpJwt } = params;

        dispatch({ type: "STEP_UP_2", stepUpUrl, stepUpJwt, guidNo });
      } else if ("paReq" in params && "acsUrl" in params) {
        const { paReq, acsUrl } = params;

        dispatch({ type: "STEP_UP_1", paReq, acsUrl, guidNo });
      }
    },
    []
  );

  const setMetadata = useCallback((metadata: Record<string, string>): void => {
    dispatch({ type: "METADATA", metadata });
  }, []);

  return (
    <PaymentFlowContext.Provider
      value={{
        state,
        dispatch,
        setMetadata,
        handleDeviceFingerPrinting,
        handleStepUpForm,
      }}
    >
      {children}
    </PaymentFlowContext.Provider>
  );
}

export const useInternalPaymentFlowContext = (): PaymentFlowContextProps => {
  const context = useContext(PaymentFlowContext);

  if (!context) {
    throw new Error(
      "useInternalPaymentFlowContext must be used within a PaymentFlowProvider"
    );
  }

  return context;
};

export const usePaymentFlowContext = (): Omit<
  PaymentFlowContextProps,
  "dispatch"
> => {
  const context = useContext(PaymentFlowContext);

  if (!context) {
    throw new Error(
      "usePaymentFlowContext must be used within a PaymentFlowProvider"
    );
  }

  const { dispatch: _dispatch, ...rest } = context;

  return rest;
};
