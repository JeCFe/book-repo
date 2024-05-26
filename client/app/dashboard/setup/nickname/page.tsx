"use client";

import { AccordionManager, Checkbox } from "@/components";
import { SetupBook, SetupBookshelf, useSetupWizard } from "@/hooks";
import { Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SetupModal } from "../../SetupModal";

export type FormValues = {
  checkBox: boolean;
};

export default function Books() {
  const { config, books, includeDefaults, updateCustomer } = useSetupWizard();

  const [setupBooks, setSetupBooks] = useState<SetupBook[]>([]);

  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const [currentIsbn, setCurrentIsbn] = useState<string | undefined>();
  const [passingIsbn, setPassingIsbn] = useState<string | undefined>();

  useEffect(() => {
    if (config === undefined) {
      router.push("/dashboard/setup");
    }
  }, []);

  useEffect(() => {
    setSetupBooks(books ?? []);
  }, [books]);

  const onContinue = () => {
    updateCustomer({
      type: "add-books",
      setupBooks,
    });

    router.push("/dashboard/setup/preview");
  };

  const addBook = (book: SetupBook) => {
    if (book === undefined) {
      return;
    }

    setSetupBooks((prev) => [...prev, book]);
  };

  return (
    <div className="flex flex-col">
      <AddBookModal
        isbn={passingIsbn as string}
        addBook={addBook}
        showModal={open}
        setShowModal={setOpen}
        setPassingIsbn={setPassingIsbn}
        setCurrentIsbn={setCurrentIsbn}
      />
      <SetupModal />

      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Setup your books
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        You add as many books as you want, once you're on your dashboard you
        will be able to organise and setup additional books.
      </div>

      <div className="mt-10">
        <div className="mb-4 text-xl text-slate-300">Enter the book's ISBN</div>
        <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <input
            type="text"
            value={currentIsbn ?? ""}
            onChange={(e) => {
              setCurrentIsbn(e.target.value);
            }}
            placeholder="Enter ISBN..."
            className="flex w-full max-w-sm space-y-2 rounded-lg border border-black bg-slate-100 p-2.5 text-slate-900 md:max-w-xl"
          />
          <Button
            size="large"
            variant="primary"
            onClick={() => {
              setPassingIsbn(currentIsbn);
              setOpen(true);
            }}
            type="button"
            disabled={currentIsbn === undefined || currentIsbn === ""}
          >
            Lookup Book
          </Button>
        </div>

        {setupBooks && setupBooks.length > 0 && (
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
        )}
      </div>
      <div className="mb-10 mt-20 flex flex-row space-x-6">
        <Button
          type="button"
          size="large"
          variant="secondary"
          onClick={() => router.push("/dashboard/setup/bookshelf")}
        >
          Back
        </Button>
        <Button size="large" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
