import { ReactNode, useState } from "react";
import { ManagedAccordion } from ".";

export type AccordionProps = {
  title: string;
  children: ReactNode;
};

export function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <ManagedAccordion title={title} isOpen={isOpen} setIsOpen={setIsOpen}>
      {children}
    </ManagedAccordion>
  );
}
