"use client";
import { AccordionManager } from "@/components";
import {
  SetupBook,
  SetupBookshelf,
  useGetCustomerSummary,
  useSetupWizard,
} from "@/hooks";
import { getApiClient } from "@/services";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SetupModal } from "../SetupModal";
import { ReviewOption } from "./ReviewOptions";

const setupCustomer = getApiClient()
  .path("/action/setup-customer")
  .method("post")
  .create();

const updateNickname = getApiClient()
  .path("/customer/update")
  .method("post")
  .create();

export default withPageAuthRequired(function Preview() {
  const { isComplete, nickname, books, bookshelves, includeDefaults } =
    useSetupWizard();
  const { mutate } = useGetCustomerSummary();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customerBooks, setCustomerBooks] = useState<SetupBook[]>([]);
  const [customerNickname, setCustomerNickname] = useState<
    string | undefined
  >();
  const [customerBookshelves, setCustomerBookshelves] =
    useState<SetupBookshelf>([]);
  const [customerDefaults, setCustomerDefaults] = useState<boolean>();

  useEffect(() => {
    if (nickname === undefined) {
      return;
    }
    setCustomerNickname(nickname);
  }, [nickname, books, bookshelves, includeDefaults]);
  useEffect(() => {
    if (books === undefined) {
      return;
    }
    setCustomerBooks(books);
  }, [books, bookshelves, includeDefaults]);
  useEffect(() => {
    if (bookshelves === undefined) {
      return;
    }
    setCustomerBookshelves(bookshelves);
  }, [bookshelves]);
  useEffect(() => {
    setCustomerDefaults(includeDefaults);
  }, [includeDefaults]);

  const router = useRouter();

  useEffect(() => {
    if (!isComplete) {
      router.push("/setup");
    }
  }, [isComplete, router]);

  const onContinue = async () => {
    setIsLoading(true);
    if (user?.nickname !== nickname) {
      await toast.promise(
        updateNickname({
          id: user?.sub as string,
          nickname: customerNickname,
        }),
        {
          loading: "Upading nickname",
          success: "Nickname updated successfully",
          error:
            "Something went wrong with updating your username, you will be able to update this later",
        },
      );
    }

    await toast.promise(
      setupCustomer({
        id: user!.sub as string,
        bookshelvesNames: bookshelves,
        isbns: books?.map((x) => x.isbn),
        includeDefaultBookshelves: includeDefaults,
      }),
      {
        loading: "Setting up account",
        success: () => {
          mutate();
          router.push("/dashboard");
          return "Account has been setup";
        },
        error:
          "Something went wrong with setting up your account. Please try again later, or contact an admin",
      },
    );

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col">
      <SetupModal />

      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Review account setup
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        This will be how we setup your account, make any changes necessary. You
        are able to change any of these at a later point also.
      </div>

      <div className="mt-10 flex flex-col space-y-10">
        <ReviewOption title="Review nickname" href="/setup/nickname">
          {customerNickname}
        </ReviewOption>
        <ReviewOption title="Review bookshelves" href="/setup/bookshelves">
          <div>
            {customerDefaults !== undefined && customerDefaults
              ? "Default bookshelves will be included."
              : "Default bookshelves won't be included."}
          </div>
          {customerBookshelves && customerBookshelves.length > 0 && (
            <AccordionManager
              className="max-w-lg space-y-3 pt-4"
              accordions={[
                {
                  title: "Proposed bookshelves",
                  children: (
                    <div className="space-y-1 divide-y divide-slate-500 pb-1">
                      {customerBookshelves.map((bookshelf, index) => (
                        <div
                          key={`${bookshelf}-${index}`}
                          className="flex flex-row pr-2 pt-1 text-slate-300"
                        >
                          {bookshelf}
                        </div>
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          )}
        </ReviewOption>
        <ReviewOption title="Review books" href="/setup/books">
          {customerBooks && customerBooks.length > 0 ? (
            <AccordionManager
              className="max-w-lg space-y-3 pt-4"
              accordions={[
                {
                  title: "Proposed books",
                  children: (
                    <div className="space-y-1 divide-y divide-slate-500 pb-1">
                      {customerBooks.map((book, index) => (
                        <div
                          key={`${book}-${index}`}
                          className="flex flex-row pr-2 pt-1 text-slate-300"
                        >
                          {book.name}
                        </div>
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          ) : (
            "No books to be added during setup."
          )}
        </ReviewOption>
      </div>
      <div className="mb-10 mt-20 flex flex-row space-x-6">
        <Button
          size="large"
          variant="secondary"
          onClick={() => router.push("/setup/books")}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button size="large" isLoading={isLoading} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
});
