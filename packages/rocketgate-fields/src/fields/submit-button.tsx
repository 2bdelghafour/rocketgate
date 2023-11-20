import type { ButtonHTMLAttributes, ReactNode } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function SubmitButton({
  children,
  ...props
}: SubmitButtonProps): JSX.Element {
  return (
    <button type="submit" {...props}>
      {children}
    </button>
  );
}
