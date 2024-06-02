"use client";

import { AddBookModal } from "@/app/setup/books/AddBookModal";
import { SetupBook, useGetCustomerSummary } from "@/hooks";
import { getApiClient } from "@/services";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddBookByIsbn } from "../AddBookByIsbn";

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
    const bookshelfIds = data.bookshelves?.map((x) => x.id);
    try {
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

      <AddBookByIsbn
        passingIsbn={passingIsbn}
        setPassingIsbn={setPassingIsbn}
        currentIsbn={currentIsbn}
        setCurrentIsbn={setCurrentIsbn}
        addBook={addBook}
        open={open}
        setOpen={setOpen}
      />
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
