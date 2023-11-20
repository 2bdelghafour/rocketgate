import type { HTMLAttributes } from "react";
import { EXPIRY_YEAR_FIELD } from "../config/config";
import { padNumberWithZero } from "../utils";

interface ExpiryYearProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  classNames?: {
    label?: string;
    input?: string;
  };
}

export function ExpiryYear({
  label,
  classNames,
  ...props
}: ExpiryYearProps): JSX.Element {
  const currentYear = new Date().getFullYear();
  const futureYears = Array.from(
    { length: 10 },
    (_, index) => currentYear + index
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }} {...props}>
      <label className={classNames?.label} htmlFor={EXPIRY_YEAR_FIELD}>
        {label || "Expiry Year"}
      </label>
      <select
        className={classNames?.input}
        defaultValue=""
        id={EXPIRY_YEAR_FIELD}
        name={EXPIRY_YEAR_FIELD}
      >
        <option disabled value="">
          YYYY
        </option>
        {futureYears.map((year) => {
          const paddedYear = padNumberWithZero(year % 100, 2);

          return (
            <option key={year} value={paddedYear}>
              {year}
            </option>
          );
        })}
      </select>
    </div>
  );
}
