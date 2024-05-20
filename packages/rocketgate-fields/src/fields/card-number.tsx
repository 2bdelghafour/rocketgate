"use client";

import { CARD_NUMBER_FIELD } from "../config/config";
import { usePaymentFormContext } from "../hooks/use-payment-form-context";

interface CardNumberProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  classNames?: {
    label?: string;
    input?: string;
    error?: string;
  };
}

export function CardNumber({
  classNames,
  placeholder,
  ...props
}: CardNumberProps): JSX.Element {
  const { formData, setFormData, formErrors, localization, locale } =
    usePaymentFormContext();
  const cardNumberErrors = formErrors?.fieldErrors.cardNumber;
  const hasError = cardNumberErrors && cardNumberErrors.length > 0;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ): void => {
    const cardNumber = e.target.value.replace(/ /g, "");

    setFormData((prevData) => ({
      ...prevData,
      cardNumber,
    }));
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      {...props}
      {...(hasError && { "data-error": true })}
    >
      <label className={classNames?.label} htmlFor={CARD_NUMBER_FIELD}>
        {localization.label[locale].cardNumber}
      </label>
      <input
        {...(hasError && {
          style: { border: "1px solid red" },
          "data-error": true,
          "aria-invalid": true,
        })}
        aria-label={localization.label[locale].cardNumber}
        autoComplete="cc-number"
        autoCorrect="off"
        className={classNames?.input}
        id={CARD_NUMBER_FIELD}
        inputMode="numeric"
        name={CARD_NUMBER_FIELD}
        onChange={handleChange}
        placeholder={placeholder}
        spellCheck="false"
        type="text"
        value={formData.cardNumber}
      />
      {cardNumberErrors ? (
        <p className={classNames?.error} style={{ color: "red" }}>
          {cardNumberErrors[0]}
        </p>
      ) : null}
    </div>
  );
}
