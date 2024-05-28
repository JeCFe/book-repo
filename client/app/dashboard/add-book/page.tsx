"use client";

import { AddBookModal } from "@/app/setup/books/AddBookModal";
import { SetupBook, useGetCustomerSummary } from "@/hooks";
import { getApiClient } from "@/services";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useState } from "react";

const addBookshelfBook = getApiClient()
  .path("/action/add-book-shelf-book")
  .method("post")
  .create();

export default function AddBook() {
  const { isLoading, data, error, mutate } = useGetCustomerSummary(); //Will need new endpoint that just returns customer bookshelves names and IDs
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const [currentIsbn, setCurrentIsbn] = useState<string | undefined>();
  const [passingIsbn, setPassingIsbn] = useState<string | undefined>();

  const addBook = async (book: SetupBook) => {
    if (book === undefined || data === undefined || user === undefined) {
      return; //error handelling needed
    }
    var bookshelfIds = data.bookshelves?.map((x) => x.id);
    try {
      console.log(bookshelfIds);
      console.log(user.sub);
      console.log(book.isbn);
      await addBookshelfBook({
        id: user.sub!,
        isbn: book.isbn,
        bookshelfId: bookshelfIds ?? [],
      });
    } catch {
      console.log("Something went wrong!");
    }
    mutate();
    router.push("/dashboard");
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
      <AddBookModal
        isbn={passingIsbn as string}
        addBook={addBook}
        showModal={open}
        setShowModal={setOpen}
        setPassingIsbn={setPassingIsbn}
        setCurrentIsbn={setCurrentIsbn}
      />

      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Add Book
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`Search for the book you wish to add with the ISBN`}
      </div>

      <div className="mt-10">
        <div className="mb-4 text-xl text-slate-300">{`Enter the book's ISBN`}</div>
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
      </div>
      <div className="mb-10 mt-20 flex flex-row space-x-6">
        <Button
          type="button"
          size="large"
          variant="secondary"
          onClick={() => router.push("/dashboard")}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
