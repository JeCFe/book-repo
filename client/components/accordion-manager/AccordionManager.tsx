import { AccordionProps, ManagedAccordion } from "@/components";
import { useState } from "react";

type Props = {
  accordions: AccordionProps[];
  className?: string;
};

export function AccordionManager({ accordions, className }: Props) {
  const [isOpen, setIsOpen] = useState<number | undefined>();

  return (
    <div className={className ? className : ""}>
      {accordions.map(({ title, children }, index) => (
        <ManagedAccordion
          key={`${title}-${index}`}
          title={title}
          isOpen={isOpen === index ? true : false}
          setIsOpen={() =>
            setIsOpen(() => (isOpen !== index ? index : undefined))
          }
        >
          {children}
        </ManagedAccordion>
      ))}
    </div>
  );
}
