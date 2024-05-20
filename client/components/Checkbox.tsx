import { VariantProps, cva } from "class-variance-authority";
import React, { InputHTMLAttributes, ReactNode, forwardRef } from "react";

const checkbox = cva(
  [
    "appearance-none box-border relative border-2",
    "focus:before:absolute focus:before:-left-0.5 focus:before:-top-0.5 focus:before:border-4 focus:before:ring",
    "checked:after:absolute checked:after:box-border checked:after:rotate-45 checked:after:border-solid",
    "disabled:bg-gray-300",
  ],
  {
    variants: {
      size: {
        small: [
          "h-8 min-h-8 w-8 min-w-8",
          "focus:before:h-8 focus:before:w-8",
          "checked:after:left-2 checked:after:top-[1px] checked:after:h-[20px] checked:after:w-3 checked:after:border-b-[5px] checked:after:border-r-[5px]",
        ],
        medium: [
          "h-10 min-h-10 w-10 min-w-10",
          "focus:before:h-10 focus:before:w-10",
          "checked:after:left-3 checked:after:top-[3px] checked:after:h-[25px] checked:after:w-3 checked:after:border-b-[5px] checked:after:border-r-[5px]",
        ],
      },
      theme: {
        standard:
          "border-slate-900 focus:before:border-slate-900 focus:before:ring-pink-400 checked:after:border-pink-400",
        dark: "border-slate-200 focus:before:border-slate-300 focus:before:ring-pink-400 checked:after:border-pink-400",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

const label = cva(["flex flex-col w-fit"], {
  variants: {
    size: { medium: "text-lg", small: "text-base" },
    theme: {
      standard: "text-slate-800",
      dark: "text-slate-300",
    },
  },
  defaultVariants: { size: "small" },
});

const hintCva = cva("", {
  variants: {
    size: { medium: "text-base ml-14", small: "text-sm ml-12" },
    theme: {
      standard: "text-slate-500",
      dark: "text-slate-400",
    },
  },
  defaultVariants: { size: "small" },
});

type Props = {
  children?: ReactNode;
  hint?: ReactNode;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof checkbox> &
  VariantProps<typeof label> &
  VariantProps<typeof hintCva>;

export const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ children, hint, size, className, theme, ...rest }: Props, ref) => (
    <label className={label({ size, className, theme })}>
      <div className="flex w-fit flex-row items-center">
        <input
          {...rest}
          className={checkbox({ size, theme })}
          ref={ref}
          type="checkbox"
        />
        <span className="ml-4">{children}</span>
      </div>
      {hint && <span className={hintCva({ size, theme })}>{hint}</span>}
    </label>
  ),
);

Checkbox.defaultProps = {
  hint: undefined,
  children: undefined,
  className: "",
};

Checkbox.displayName = "Checkbox";
