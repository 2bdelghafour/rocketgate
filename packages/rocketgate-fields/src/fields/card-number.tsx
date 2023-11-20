import type { HTMLAttributes } from "react";
import { CARD_NUMBER_FIELD } from "../config/config";

interface CardNumberProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  classNames?: {
    label?: string;
    input?: string;
  };
}

export function CardNumber({
  label,
  classNames,
  ...props
}: CardNumberProps): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column" }} {...props}>
      <label className={classNames?.label} htmlFor={CARD_NUMBER_FIELD}>
        {label || "Card Number"}
      </label>
      <input
        className={classNames?.input}
        id={CARD_NUMBER_FIELD}
        maxLength={19}
        name={CARD_NUMBER_FIELD}
        type="text"
      />
    </div>
  );
}
