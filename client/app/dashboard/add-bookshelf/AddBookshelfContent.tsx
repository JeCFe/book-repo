"use client";

import { AccordionManager } from "@/components";
import { useGetBookshelfSummary } from "@/hooks";
import { Anchor } from "@jecfe/react-design-system";

export function AddBookshelfContent({ id }: { id: string }) {
  console.log(id);
  const { data, error, isLoading } = useGetBookshelfSummary(id);
  return (
    <>
      test
      {data && (
        <AccordionManager
          className="space-y-3 pt-12"
          accordions={[
            {
              title: "Existing Bookshelves",
              children: (
                <div className="space-y-1 divide-y divide-slate-500 pb-1">
                  {data.map((bookshelf, index) => (
                    <div
                      key={`${bookshelf}-${index}`}
                      className="item-center flex flex-row justify-center pr-2 pt-1 text-slate-300"
                    >
                      <div className="flex items-center justify-center">
                        {bookshelf.name}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      )}
    </>
  );
}
