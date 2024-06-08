"use client";

import { AccordionManager, Checkbox } from "@/components";
import { SetupBookshelf, useSetupWizard } from "@/hooks";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SetupModal } from "../SetupModal";

export type FormValues = {
  checkBox: boolean;
};

export default withPageAuthRequired(function Bookshelves() {
  const { config, bookshelves, includeDefaults, complete, updateCustomer } =
    useSetupWizard();

  const [setupBookshelves, setSetupBookshelves] = useState<SetupBookshelf>([]);

  const router = useRouter();

  const [currentBookshelf, setCurrentBookshelf] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (config === undefined || config === "express") {
      router.push("/setup");
    }
  }, [config, router]);

  useEffect(() => {
    setSetupBookshelves(bookshelves ?? []);
  }, [bookshelves]);

  const onSubmit = (data: FormValues) => {
    const updatedCustomer = updateCustomer({
      type: "add-bookshelves",
      bookshelves: setupBookshelves,
      defaults: data.checkBox,
    });

    if (complete(updatedCustomer)) {
      router.push("/setup/preview");
      return;
    }

    router.push("/setup/books");
  };
  const addBookshelf = () => {
    if (currentBookshelf === undefined) {
      return;
    }

    setSetupBookshelves((prev) => [...prev, currentBookshelf]);
    setCurrentBookshelf(undefined);
  };

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { checkBox: includeDefaults },
  });

  return (
    <div className="flex flex-col">
      <SetupModal />
      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Setup your bookshelves
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        You can add as many initial bookshelves as you want, fear not you can
        always do this later.
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox
          {...register("checkBox")}
          className="mt-10 md:mt-20"
          size="large"
          theme="dark"
          hint="This will include all default bookshelves"
        >
          Include default shelves
        </Checkbox>

        <div className="mt-10">
          <div className="mb-4 text-xl text-slate-300">
            Enter the name you wish the bookshelf to be called.
          </div>
          <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <input
              type="text"
              value={currentBookshelf ?? ""}
              onChange={(e) => {
                setCurrentBookshelf(e.target.value);
              }}
              placeholder="Enter bookshelf name..."
              className="flex w-full max-w-sm space-y-2 rounded-lg border border-black bg-slate-100 p-2.5 text-slate-900 md:max-w-xl"
            />
            <Button
              size="large"
              variant="primary"
              onClick={addBookshelf}
              type="button"
            >
              Add bookshelf
            </Button>
          </div>

          {setupBookshelves && setupBookshelves.length > 0 && (
            <AccordionManager
              className="space-y-3 pt-12"
              accordions={[
                {
                  title: "Proposed bookshelves",
                  children: (
                    <div className="space-y-1 divide-y divide-slate-500 pb-1">
                      {setupBookshelves.map((bookshelf, index) => (
                        <div
                          key={`${bookshelf}-${index}`}
                          className="item-center flex flex-row justify-center pr-2 pt-1 text-slate-300"
                        >
                          <div className="flex items-center justify-center">
                            {bookshelf}
                          </div>

                          <div className="flex flex-grow" />
                          <div className="flex h-full items-center justify-center">
                            <Button
                              onClick={() =>
                                setSetupBookshelves((prevItems) =>
                                  prevItems?.filter((_, i) => i !== index),
                                )
                              }
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
            onClick={() => router.push("/setup/nickname")}
          >
            Back
          </Button>
          <Button size="large" type="submit">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
});
