"use client";

import { TERMS_FIELD } from "../config/config";
import { usePaymentFormContext } from "../utils/payment-form-context";

interface TermsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  classNames?: {
    label?: string;
    input?: string;
    error?: string;
  };
}

export function Terms({
  children,
  classNames,
  ...props
}: TermsProps): JSX.Element {
  const { formData, setFormData, formErrors } = usePaymentFormContext();
  const termsErrors = formErrors?.fieldErrors.terms;
  const hasError = termsErrors && termsErrors.length > 0;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ): void => {
    const terms = e.target.checked;

    setFormData((prevData) => ({
      ...prevData,
      terms,
    }));
  };

  return (
    <div {...props} {...(hasError && { "data-error": true })}>
      <input
        {...(hasError && {
          style: { border: "1px solid red" },
          "data-error": true,
          "aria-invalid": true,
        })}
        checked={formData.terms}
        className={classNames?.input}
        id={TERMS_FIELD}
        name={TERMS_FIELD}
        onChange={handleChange}
        type="checkbox"
      />
      <label
        className={classNames?.label}
        htmlFor={TERMS_FIELD}
        style={{ marginLeft: "10px" }}
      >
        {children}
      </label>
      {termsErrors ? (
        <p className={classNames?.error} style={{ color: "red" }}>
          {termsErrors}
        </p>
      ) : null}
    </div>
  );
}
