"use client";

import { ProposedBooks } from "@/components";
import {
  SetupBook,
  useBookWizard,
  useGetBookshelfSummary,
  useGetCustomerSummary,
} from "@/hooks";
import { getApiClient } from "@/services";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AddBookByIsbn } from "../AddBookByIsbn";

const addBookshelfBook = getApiClient()
  .path("/action/add-book-shelf-book")
  .method("post")
  .create();

export default withPageAuthRequired(function AddBook({ user }) {
  const { isLoading } = useGetBookshelfSummary(user.sub!);
  const [open, setOpen] = useState<boolean>(false);

  const { books, updateBook } = useBookWizard();

  const router = useRouter();
  const [setupBooks, setSetupBooks] = useState<SetupBook[]>([]);
  const [currentIsbn, setCurrentIsbn] = useState<string | undefined>();
  const [passingIsbn, setPassingIsbn] = useState<string | undefined>();
  const [currentSearch, setCurrentSearch] = useState<string | undefined>();
  const [isSavingBooks, setIsSavingBooks] = useState<boolean>(false);

  useEffect(() => {
    setSetupBooks(books ?? []);
  }, [books]);

  const addBook = async (book: SetupBook) => {
    updateBook({ type: "add-books", setupBook: book });
  };

  const removeBook = (isbn: string) => {
    updateBook({ type: "remove-book", isbn });
  };

  const saveBooks = async () => {
    setIsSavingBooks(true);
    for (const book of setupBooks) {
      await toast.promise(
        addBookshelfBook({ id: user.sub!, bookshelfId: [], isbn: book.isbn }),
        {
          loading: `Adding ${book.name}`,
          success: `Added ${book.name}`,
          error: `There was an error adding ${book.name}`,
        },
      );
    }

    router.push("/dashboard");
    setIsSavingBooks(false);
  };

  if (isLoading) {
    <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
      <div className="flex items-center justify-center">
        <Spinner fast={isLoading} size="large" />
      </div>
    </div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-2 pb-6">
        <Anchor href="/dashboard">{`< Dashboard`}</Anchor>

        <div className="text-slate-400 underline underline-offset-4">
          {"< Add book"}
        </div>
      </div>
      <AddBookByIsbn
        passingIsbn={passingIsbn}
        setPassingIsbn={setPassingIsbn}
        currentIsbn={currentIsbn}
        setCurrentIsbn={setCurrentIsbn}
        addBook={addBook}
        open={open}
        setOpen={setOpen}
      />

      <div className="mt-10">
        <div className="mb-4 text-xl text-slate-300">{`Search for book by name and author`}</div>
        <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <input
            type="text"
            value={currentSearch ?? ""}
            onChange={(e) => {
              setCurrentSearch(e.target.value);
            }}
            placeholder="Enter search criteria"
            className="flex w-full max-w-sm space-y-2 rounded-lg border border-black bg-slate-100 p-2.5 text-slate-900 md:max-w-xl"
          />
          <Button
            size="large"
            variant="primary"
            onClick={() =>
              router.push(
                `/dashboard/add-book/${encodeURIComponent(currentSearch!)}`,
              )
            }
            type="button"
            disabled={currentSearch === undefined || currentSearch === ""}
          >
            Lookup Book
          </Button>
        </div>
      </div>

      {setupBooks && setupBooks.length > 0 && (
        <ProposedBooks
          setSetupBooks={setSetupBooks}
          setupBooks={setupBooks}
          removeBook={removeBook}
        />
      )}

      <div className="mb-10 mt-20 flex flex-row space-x-6">
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
          disabled={setupBooks.length === 0}
          isLoading={isSavingBooks}
          onClick={() => saveBooks()}
        >
          Add books
        </Button>
      </div>
    </div>
  );
});
