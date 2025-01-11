import { anchorCva } from "@jecfe/react-design-system";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function LinkButton({ children, className, ...rest }: Props) {
  return (
    <button {...rest} className={anchorCva({ className })}>
      {children}
    </button>
  );
}
