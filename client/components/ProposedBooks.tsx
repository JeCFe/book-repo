import { SetupBook } from "@/hooks";
import { Button } from "@jecfe/react-design-system";
import { Dispatch, SetStateAction } from "react";
import { AccordionManager } from ".";

type Props = {
  setupBooks: SetupBook[];
  setSetupBooks: Dispatch<SetStateAction<SetupBook[]>>;
};

export function ProposedBooks({ setupBooks, setSetupBooks }: Props) {
  return (
    <AccordionManager
      className="space-y-3 pt-12"
      accordions={[
        {
          title: "Proposed books",
          children: (
            <div className="space-y-1 divide-y divide-slate-500 pb-1">
              {setupBooks.map((book, index) => (
                <div
                  key={`${book}-${index}`}
                  className="item-center flex flex-row justify-center pr-2 pt-1 text-slate-300"
                >
                  <div className="flex items-center justify-center">
                    {book.name}
                  </div>

                  <div className="flex flex-grow" />
                  <div className="flex h-full items-center justify-center">
                    <Button
                      onClick={() => {
                        setSetupBooks((prevItems) =>
                          prevItems?.filter((_, i) => i !== index),
                        );
                      }}
                      size="small"
                      variant="destructive"
                      className="flex text-slate-900"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}
