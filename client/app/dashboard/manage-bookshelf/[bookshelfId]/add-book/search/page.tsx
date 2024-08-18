"use client";

import { ProposedBooks } from "@/components";
import {
  SetupBook,
  useBookWizard,
  useGetBookshelf,
  useGetBookshelfSummary,
} from "@/hooks";
import { addBookshelfBook } from "@/services";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  params: { bookshelfId: string };
};

export default withPageAuthRequired(function AddBook({
  params,
  user,
}: Props & { user: UserProfile }) {
  const { bookshelfId } = params;
  const { isLoading } = useGetBookshelfSummary(user.sub!);
  const {
    data,
    isLoading: bookshelfLoading,
    mutate,
  } = useGetBookshelf(bookshelfId);
  const { books, updateBook } = useBookWizard();
  const router = useRouter();
  const [setupBooks, setSetupBooks] = useState<SetupBook[]>([]);
  const [currentSearch, setCurrentSearch] = useState<string | undefined>();
  const [isSavingBooks, setIsSavingBooks] = useState<boolean>(false);

  useEffect(() => {
    setSetupBooks(books ?? []);
  }, [books]);

  const removeBook = (isbn: string) => {
    updateBook({ type: "remove-book", isbn });
  };

  const saveBooks = async () => {
    setIsSavingBooks(true);
    for (const book of setupBooks) {
      await toast.promise(
        addBookshelfBook({
          id: user.sub!,
          bookshelfId: [bookshelfId],
          isbn: book.isbn,
        }),
        {
          loading: `Adding ${book.name}`,
          success: `Added ${book.name}`,
          error: `There was an error adding ${book.name}`,
        },
      );
    }
    mutate();
    router.push(
      `/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}/add-book`,
    );
    setIsSavingBooks(false);
  };

  if (isLoading || bookshelfLoading) {
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
        <Anchor
          href={`/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}`}
        >
          {"< Manage bookshelf"}
        </Anchor>
        <Anchor
          href={`/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}/add-book`}
        >
          {"< Choose how to add"}
        </Anchor>

        <div className="text-slate-400 underline underline-offset-4">
          {"< Search"}
        </div>
      </div>
      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Search
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`Search for the book you wish to add - these books will be added to ${data?.name}`}
      </div>

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
                `/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}/add-book/search/${encodeURIComponent(currentSearch!)}`,
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
          onClick={() =>
            router.push(
              `/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}/add-book`,
            )
          }
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
