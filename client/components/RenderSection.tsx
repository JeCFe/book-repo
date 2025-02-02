import { VariantProps, cva, cx } from "class-variance-authority";
import { ReactNode } from "react";

const head = cva("font-bold tracking-tight", {
  variants: {
    size: {
      medium: "text-lg",
      large: "text-4xl md:text-4xl",
    },
    theme: {
      light: "text-slate-700",
      dark: "text-slate-500",
    },
  },
  defaultVariants: {
    size: "medium",
    theme: "light",
  },
});

const body = cva("flex", {
  variants: {
    size: {
      medium: "text-sm",
      large: "md:text-2xl text-xl",
    },
    theme: {
      light: "text-slate-900",
      dark: "text-slate-300",
    },
  },
  defaultVariants: {
    size: "medium",
    theme: "light",
  },
});

export function RenderSection({
  title,
  children,
  size,
  theme,
  className,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
} & VariantProps<typeof head> &
  VariantProps<typeof body>) {
  return (
    <div className={cx("flex w-full flex-col", className)}>
      <h4 className={head({ size, theme })}>{title}</h4>
      <div className={body({ size, theme })}>{children}</div>
    </div>
  );
}
