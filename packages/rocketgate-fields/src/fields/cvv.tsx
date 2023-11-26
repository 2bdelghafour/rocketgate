"use client";

import { CVV_FIELD } from "../config/config";
import { usePaymentFormContext } from "../hooks/use-payment-form-context";

interface CvvProps extends React.HTMLAttributes<HTMLDivElement> {
  classNames?: {
    label?: string;
    input?: string;
    error?: string;
  };
}

export function Cvv({ classNames, ...props }: CvvProps): JSX.Element {
  const { formData, setFormData, formErrors, localization } =
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
        {localization.label.cvv}
      </label>
      <input
        {...(hasError && {
          style: { border: "1px solid red" },
          "data-error": true,
          "aria-invalid": true,
        })}
        className={classNames?.input}
        id={CVV_FIELD}
        name={CVV_FIELD}
        onChange={handleChange}
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
