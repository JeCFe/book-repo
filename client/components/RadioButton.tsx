import { VariantProps, cva } from "class-variance-authority";
// @ts-ignore
import React, { InputHTMLAttributes, ReactNode, forwardRef } from "react";

const radio = cva(
  [
    "appearance-none flex rounded-full border-2 focus:outline-none",
    "after:m-auto after:flex after:content-center after:justify-center after:rounded-full",
    "focus:border-4 focus:ring",
    "disabled:bg-gray-300",
  ],
  {
    variants: {
      size: {
        small: ["h-8 min-h-8 w-8 min-w-8", "after:h-4 after:w-4"],
        medium: ["h-10 min-h-10 w-10 min-w-10", "after:h-6 after:w-6"],
        large: ["h-12 min-h-12 w-12 min-w-12", "after:h-7 after:w-7"],
      },
      darkMode: {
        true: "border-slate-400 after:checked:bg-pink-600 focus:ring-pink-600",
        false: "border-black after:checked:bg-pink-400 focus:ring-pink-400",
      },
    },
    defaultVariants: {
      size: "small",
      darkMode: false,
    },
  },
);

const label = cva(["flex flex-col font-bold"], {
  variants: {
    size: {
      medium: "md:text-lg text-base",
      small: "md:text-base text-sm",
      large: "md:text-3xl text-xl",
    },
    darkMode: { true: "text-slate-300", false: "text-black" },
  },
  defaultVariants: { size: "small" },
});

const hints = cva("", {
  variants: {
    size: {
      small: "ml-10",
      medium: "ml-12",
      large: "ml-14 text-base",
    },
    darkMode: { true: "text-slate-400", false: "text-gray-500" },
  },
});

type Props = {
  children?: ReactNode;
  hint?: ReactNode;
  className?: string;
  radioClassName?: string;
  hintClassName?: string;
  darkMode?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof radio>;

export const RadioButton = forwardRef<HTMLInputElement, Props>(
  (
    {
      children,
      hint,
      size,
      className,
      darkMode,
      radioClassName,
      hintClassName,
      ...rest
    }: Props,
    ref,
  ) => (
    <label className={label({ size, className, darkMode })}>
      <div className="flex flex-row items-center">
        <input
          {...rest}
          className={radio({ size, darkMode, className: radioClassName })}
          ref={ref}
          type="radio"
        />
        <span className="ml-2">{children}</span>
      </div>
      {hint && (
        <span className={hints({ size, darkMode, className: hintClassName })}>
          {hint}
        </span>
      )}
    </label>
  ),
);

RadioButton.defaultProps = {
  darkMode: true,
  hint: undefined,
  children: undefined,
  className: "",
};

RadioButton.displayName = "RadioButton";
