"use client";

import { CARD_NUMBER_FIELD } from "../config/config";
import { usePaymentFormContext } from "../hooks/use-payment-form-context";

interface CardNumberProps extends React.HTMLAttributes<HTMLDivElement> {
  classNames?: {
    label?: string;
    input?: string;
    error?: string;
  };
}

export function CardNumber({
  classNames,
  ...props
}: CardNumberProps): JSX.Element {
  const { formData, setFormData, formErrors, localization } =
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
        {localization.label.cardNumber}
      </label>
      <input
        {...(hasError && {
          style: { border: "1px solid red" },
          "data-error": true,
          "aria-invalid": true,
        })}
        className={classNames?.input}
        id={CARD_NUMBER_FIELD}
        name={CARD_NUMBER_FIELD}
        onChange={handleChange}
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
