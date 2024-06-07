"use client";

import { AccordionManager } from "@/components";
import { useGetBookshelfSummary } from "@/hooks";
import { getApiClient } from "@/services";
import { Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export function AddBookshelfContent({ id }: { id: string }) {
  const { data } = useGetBookshelfSummary(id);
  const [newBookshelves, setNewBookshelves] = useState<string[]>([]);
  const [newBookshelf, setNewBookshelf] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const router = useRouter();

  const existingBookshelf = useMemo(() => {
    if (!data) {
      return;
    }
    return data.map((x) => x.name);
  }, [data]);

  const addBookshelf = () => {
    if (
      existingBookshelf?.includes(newBookshelf) ||
      newBookshelves.includes(newBookshelf)
    ) {
      toast.error(
        `${newBookshelf} already exists. You may want to review this.`,
      );
    }
    setNewBookshelves((prev) => [...prev, newBookshelf]);
  };

  const saveChanges = () => {
    setIsSaving(true);
  };

  return (
    <>
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
                      className="flex flex-row items-start justify-start pr-2 pt-1 text-slate-300"
                    >
                      <div className="flex items-start justify-start">
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
      <div className="mb-4 mt-8 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-300 md:max-w-4xl md:text-2xl">
        Enter the bookshelf name you want to add
      </div>
      <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <input
          type="text"
          placeholder="Enter bookshelf name..."
          value={newBookshelf}
          onChange={(e) => setNewBookshelf(e.currentTarget.value)}
          className="flex w-full max-w-sm space-y-2 rounded-lg border border-black bg-slate-100 p-2.5 text-slate-900 md:max-w-xl"
        />
        <Button
          size="large"
          variant="primary"
          type="button"
          className="text-black"
          onClick={() => addBookshelf()}
        >
          Add bookshelf
        </Button>
      </div>
      {newBookshelves && newBookshelves.length > 0 && (
        <AccordionManager
          className="space-y-3 pt-12"
          accordions={[
            {
              title: "Proposed Bookshelves",
              children: (
                <div className="space-y-1 divide-y divide-slate-500 pb-1">
                  {newBookshelves.map((bookshelf, index) => (
                    <div
                      key={`${bookshelf}-${index}`}
                      className="flex flex-row items-start justify-start pr-2 pt-1 text-slate-300"
                    >
                      <div className="flex items-start justify-start">
                        {bookshelf}
                      </div>
                      <div className="flex flex-grow" />
                      <div className="flex h-full items-center justify-center">
                        <Button
                          onClick={() => {
                            setNewBookshelves((prevItems) =>
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
      )}
      <div className="mb-10 mt-20 flex flex-row space-x-6 text-black">
        <Button
          type="button"
          size="large"
          variant="secondary"
          onClick={() => router.push("/dashboard")}
        >
          Back
        </Button>
        <Button
          type="button"
          size="large"
          onClick={() => router.push("/dashboard")}
          disabled={newBookshelves.length === 0}
          isLoading={isSaving}
        >
          Add bookshelves
        </Button>
      </div>
    </>
  );
}
