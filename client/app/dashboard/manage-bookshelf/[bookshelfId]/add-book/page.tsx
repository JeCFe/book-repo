"use client";

import { AddBookByIsbn } from "@/app/dashboard/AddBookByIsbn";
import { SetupBook, useGetBookshelfSummary } from "@/hooks";
import { getApiClient } from "@/services";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const addBookshelfBook = getApiClient()
  .path("/action/add-book-shelf-book")
  .method("post")
  .create();

type Props = {
  params: { bookshelfId: string };
};

export default withPageAuthRequired(function AddBook({
  params,
  user,
}: Props & { user: UserProfile }) {
  const { bookshelfId } = params;
  const { isLoading, data, error, mutate } = useGetBookshelfSummary(user.sub!);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const [currentIsbn, setCurrentIsbn] = useState<string | undefined>();
  const [passingIsbn, setPassingIsbn] = useState<string | undefined>();

  const addBook = async (book: SetupBook) => {
    if (book === undefined || data === undefined || user === undefined) {
      return; //error handelling needed
    }
    try {
      await addBookshelfBook({
        id: user.sub!,
        isbn: book.isbn,
        bookshelfId: [bookshelfId],
      });
      toast.success("Successfully added book");
      mutate();
      router.push(
        `/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}`,
      );
    } catch {
      toast.error("Unable to add book");
    }
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
        <Anchor
          href={`/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}`}
        >{`< Manage Bookshelf`}</Anchor>
        <div className="text-slate-400 underline underline-offset-4">
          {"< Add Book"}
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
    </div>
  );
});
