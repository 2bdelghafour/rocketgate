"use client";

import { EXPIRY_YEAR_FIELD } from "../config/config";
import { padNumberWithZero } from "../utils";
import { usePaymentFormContext } from "../hooks/use-payment-form-context";

interface ExpiryYearProps extends React.HTMLAttributes<HTMLDivElement> {
  classNames?: {
    label?: string;
    input?: string;
    error?: string;
  };
}

export function ExpiryYear({
  classNames,
  ...props
}: ExpiryYearProps): JSX.Element {
  const { formData, setFormData, formErrors, localization } =
    usePaymentFormContext();
  const expiryYearErrors = formErrors?.fieldErrors.expiryYear;
  const hasError = expiryYearErrors && expiryYearErrors.length > 0;
  const currentYear = new Date().getFullYear();
  const futureYears = Array.from(
    { length: 10 },
    (_, index) => currentYear + index
  );

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ): void => {
    const expiryYear = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      expiryYear,
    }));
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      {...props}
      {...(hasError && { "data-error": true })}
    >
      <label className={classNames?.label} htmlFor={EXPIRY_YEAR_FIELD}>
        {localization.label.expiryYear}
      </label>
      <select
        {...(hasError && {
          style: { border: "1px solid red" },
          "data-error": true,
          "aria-invalid": true,
        })}
        className={classNames?.input}
        id={EXPIRY_YEAR_FIELD}
        name={EXPIRY_YEAR_FIELD}
        onChange={handleChange}
        value={formData.expiryYear}
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
      {expiryYearErrors ? (
        <p className={classNames?.error} style={{ color: "red" }}>
          {expiryYearErrors[0]}
        </p>
      ) : null}
    </div>
  );
}
