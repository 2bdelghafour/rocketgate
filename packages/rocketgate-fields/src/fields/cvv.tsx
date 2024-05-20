"use client";

import { CVV_FIELD } from "../config/config";
import { usePaymentFormContext } from "../hooks/use-payment-form-context";

interface CvvProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  classNames?: {
    label?: string;
    input?: string;
    error?: string;
  };
}

export function Cvv({
  classNames,
  placeholder,
  ...props
}: CvvProps): JSX.Element {
  const { formData, setFormData, formErrors, localization, locale } =
    usePaymentFormContext();
  const cvvErrors = formErrors?.fieldErrors.cvv;
  const hasError = cvvErrors && cvvErrors.length > 0;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ): void => {
    const cvv = e.target.value.replace(/ /g, "");

    setFormData((prevData) => ({
      ...prevData,
      cvv,
    }));
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      {...props}
      {...(hasError && { "data-error": true })}
    >
      <label className={classNames?.label} htmlFor={CVV_FIELD}>
        {localization.label[locale].cvv}
      </label>
      <input
        {...(hasError && {
          style: { border: "1px solid red" },
          "data-error": true,
          "aria-invalid": true,
        })}
        aria-label={localization.label[locale].cvv}
        autoComplete="cc-csc"
        autoCorrect="off"
        className={classNames?.input}
        id={CVV_FIELD}
        inputMode="numeric"
        name={CVV_FIELD}
        onChange={handleChange}
        placeholder={placeholder}
        spellCheck="false"
        type="text"
        value={formData.cvv}
      />
      {cvvErrors ? (
        <p className={classNames?.error} style={{ color: "red" }}>
          {cvvErrors}
        </p>
      ) : null}
    </div>
  );
}
