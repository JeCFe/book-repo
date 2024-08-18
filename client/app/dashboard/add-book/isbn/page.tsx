"use client";

import { ProposedBooks } from "@/components";
import { SetupBook, useBookWizard } from "@/hooks";
import { addBookshelfBook } from "@/services";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AddBookByIsbn } from "../../AddBookByIsbn";

export default withPageAuthRequired(function AddBook({ user }) {
  const [open, setOpen] = useState<boolean>(false);

  const { books, updateBook } = useBookWizard();

  const router = useRouter();
  const [setupBooks, setSetupBooks] = useState<SetupBook[]>([]);
  const [currentIsbn, setCurrentIsbn] = useState<string | undefined>();
  const [passingIsbn, setPassingIsbn] = useState<string | undefined>();
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

  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-2 pb-6">
        <Anchor href="/dashboard">{`< Dashboard`}</Anchor>
        <Anchor href="/dashboard/add-book"> {"< Choose how to add"}</Anchor>
        <div className="text-slate-400 underline underline-offset-4">
          {"< ISBN"}
        </div>
      </div>
      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Add book via ISBN
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`Search for the book you wish to add - these books will be added to your homeless bookshelf`}
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
          onClick={() => router.push("/dashboard/add-book")}
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
