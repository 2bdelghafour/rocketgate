import type { HTMLAttributes } from "react";
import { CVV_FIELD } from "../config/config";

interface CvvProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  classNames?: {
    label?: string;
    input?: string;
  };
}

export function Cvv({ label, classNames, ...props }: CvvProps): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column" }} {...props}>
      <label className={classNames?.label} htmlFor={CVV_FIELD}>
        {label || "CVV"}
      </label>
      <input
        className={classNames?.input}
        id={CVV_FIELD}
        maxLength={19}
        name={CVV_FIELD}
        type="text"
      />
    </div>
  );
}
