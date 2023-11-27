interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
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
