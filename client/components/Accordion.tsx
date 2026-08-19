import { ReactNode, useState } from "react";
import { ManagedAccordion } from ".";

export type AccordionProps = {
  title: string;
  children: ReactNode;
  sideStyle?: boolean;
  containerSize?: "max" | "standard";
};

export function Accordion({
  title,
  children,
  sideStyle,
  containerSize,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <ManagedAccordion
      title={title}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      sideStyle={sideStyle}
      containerSize={containerSize}
    >
      {children}
    </ManagedAccordion>
  );
}
