"use client";

import { padNumberWithZero } from "../utils";
import { EXPIRY_MONTH_FIELD } from "../config/config";
import { usePaymentFormContext } from "../hooks/use-payment-form-context";

interface ExpiryMonthProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  classNames?: {
    label?: string;
    input?: string;
    error?: string;
  };
}

export function ExpiryMonth({
  classNames,
  placeholder,
  ...props
}: ExpiryMonthProps): JSX.Element {
  const { formData, setFormData, formErrors, localization, locale } =
    usePaymentFormContext();
  const expiryMonthErrors = formErrors?.fieldErrors.expiryMonth;
  const hasError = expiryMonthErrors && expiryMonthErrors.length > 0;
  const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ): void => {
    const expiryMonth = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      expiryMonth,
    }));
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      {...props}
      {...(hasError && { "data-error": true })}
    >
      <label className={classNames?.label} htmlFor={EXPIRY_MONTH_FIELD}>
        {localization.label[locale].expiryMonth}
      </label>
      <select
        {...(hasError && {
          style: { border: "1px solid red" },
          "data-error": true,
          "aria-invalid": true,
        })}
        aria-label={localization.label[locale].expiryMonth}
        autoComplete="cc-exp-month"
        className={classNames?.input}
        id={EXPIRY_MONTH_FIELD}
        name={EXPIRY_MONTH_FIELD}
        onChange={handleChange}
        value={formData.expiryMonth}
      >
        <option disabled value="">
          {placeholder || `MM`}
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
      {expiryMonthErrors ? (
        <p className={classNames?.error} style={{ color: "red" }}>
          {expiryMonthErrors[0]}
        </p>
      ) : null}
    </div>
  );
}
