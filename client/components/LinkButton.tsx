import { cva } from "class-variance-authority";
import { ButtonHTMLAttributes, ReactNode } from "react";

const anchor = cva([
  "appearance-none inline-block underline underline-offset-4",
  "text-blue-500 hover:text-blue-900",
  "transition duration-200 ease-in-out",
  "disabled:text-gray-300",
]);

type Props = {
  children: ReactNode | ReactNode[];
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function LinkButton({ children, className, ...rest }: Props) {
  return (
    <button {...rest} className={anchor({ className })}>
      {children}
    </button>
  );
}
