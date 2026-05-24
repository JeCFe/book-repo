import { ArrowUp } from "@jecfe/react-design-system";
import { cva, VariantProps } from "class-variance-authority";
import { Dispatch, ReactNode, SetStateAction } from "react";

const accordionContainer = cva(
  [
    "z-10 rounded-xl bg-slate-800/70 shadow-xl duration-300 ease-in-out",
    "duration-300 ease-in-out transition-all px-2",
  ],
  {
    variants: {
      open: {
        false: "pb-0",
        true: "pb-4",
      },
      containerSize: {
        max: "w-full",
        standard: "max-w-sm md:w-full md:max-w-3xl",
      },
    },
    defaultVariants: {
      containerSize: "standard",
    },
  },
);

const accordionIcon = cva(
  "cursor-pointer transition-all duration-200 fill-slate-200 hover:fill-slate-400",
  {
    variants: {
      open: {
        false: "rotate-180",
        true: "rotate-0",
      },
    },
  },
);

const accordion = cva(
  [
    "transition-max-height duration-300 ease-in-out",
    "text-slate-400 leading-normal text-lg",
  ],
  {
    variants: {
      open: {
        true: "max-h-96 opacity-100 ml-5 overflow-x-auto",
        false: "max-h-0 opacity-0",
      },
      sideStyle: {
        true: "border-l border-slate-200 pl-10",
        false: "",
      },
    },
    defaultVariants: {
      open: true,
      sideStyle: true,
    },
  },
);

type Props = {
  title: string;
  children: ReactNode;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
} & VariantProps<typeof accordion> &
  VariantProps<typeof accordionContainer>;

export function ManagedAccordion({
  title,
  children,
  setIsOpen,
  isOpen,
  sideStyle,
  containerSize,
}: Props) {
  return (
    <div className={accordionContainer({ open: isOpen, containerSize })}>
      <div className="item-center flex flex-row justify-center p-1 text-left">
        <div className="ml-4 flex items-center text-xl font-bold text-slate-300">
          {title}
        </div>
        <div className="flex flex-grow" />
        <div className="flex items-center" onClick={() => setIsOpen(!isOpen)}>
          <ArrowUp className={accordionIcon({ open: isOpen })} />
        </div>
      </div>

      <div className={accordion({ open: isOpen, sideStyle })}>{children}</div>
    </div>
  );
}
