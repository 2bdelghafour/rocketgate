import type { HTMLAttributes } from "react";
import { EXPIRY_MONTH_FIELD } from "../config/config";
import { padNumberWithZero } from "../utils";

interface ExpiryMonthProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  classNames?: {
    label?: string;
    input?: string;
  };
}

export function ExpiryMonth({
  label,
  classNames,
  ...props
}: ExpiryMonthProps): JSX.Element {
  const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);

  return (
    <div style={{ display: "flex", flexDirection: "column" }} {...props}>
      <label className={classNames?.label} htmlFor={EXPIRY_MONTH_FIELD}>
        {label || "Expiry Month"}
      </label>
      <select
        className={classNames?.input}
        defaultValue=""
        id={EXPIRY_MONTH_FIELD}
        name={EXPIRY_MONTH_FIELD}
      >
        <option disabled value="">
          MM
        </option>
        {monthOptions.map((monthNumber) => {
          const paddedMonth = padNumberWithZero(monthNumber, 2);

          return (
            <option key={monthNumber} value={monthNumber}>
              {paddedMonth}
            </option>
          );
        })}
      </select>
    </div>
  );
}
