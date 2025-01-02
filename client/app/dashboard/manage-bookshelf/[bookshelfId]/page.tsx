"use client";

import { RenderBookGrid, RenderBookTable, ToggleSwitch } from "@/components";
import { useGetBookshelf } from "@/hooks";
import {
  removeBookshelf,
  removeBookshelfBook,
  updateBookshelfOrder,
} from "@/services";
import { Book } from "@/types";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Props = {
  params: { bookshelfId: string };
};

export default withPageAuthRequired(function ManageBookshelf({
  params,
  user,
}: Props & { user: UserProfile }) {
  const { bookshelfId } = params;
  const { data, isLoading, error, mutate } = useGetBookshelf(bookshelfId);
  const [toggleBookRender, setToggleBookRender] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [updatedBooks, setUpdatedBooks] = useState<Book[]>([]);
  const [isDeletingBookshelf, setIsDeletingBookcase] = useState<boolean>(false);
  const router = useRouter();

  let draggedItem: Book | null = null;

  useEffect(() => {
    if (error === undefined || typeof error === "undefined") {
      return;
    }
    if (error instanceof Error) {
      console.log(error.cause);
      if (error.message == "Bad Request") {
        toast.error(
          "Unable to retrieve bookshelf as the bookshelf was in the wrong form",
        );
      } else {
        toast.error(
          `${error.message} prevent successful retrival of bookshelf`,
        );
      }
    } else {
      toast.error("An unknown error occurred retrieving bookshelf");
    }

    router.push("/dashboard");
  }, [error]);

  useEffect(() => {
    if (!data || updatedBooks) {
      return;
    }
    const booksOrdered = [...(data.books as Book[])].toSorted(
      (a, b) => a.order! - b.order!,
    );
    setUpdatedBooks(booksOrdered);
  }, [data]);

  useEffect(() => {
    if (error !== undefined) {
      return;
    }

    if (isLoading) {
      return;
    }
    if (data === undefined) {
      router.push("/dashboard");
      return;
    }
    const booksOrdered = [...(data.books as Book[])].toSorted(
      (a, b) => a.order! - b.order!,
    );
    setBooks(booksOrdered);
  }, [data, isLoading]);

  const updateBooks = useCallback(
    debounce(async (x: Book[]) => {
      toast.promise(
        updateBookshelfOrder({
          customerId: user.sub!,
          bookshelfId: bookshelfId,
          books: x.map((book, i) => {
            return { isbn: book.book.isbn, order: i };
          }),
        }),
        {
          loading: "Autosaving",
          success: "Autosave complete",
          error: "There was an error when autosaving",
        },
        { id: "autosave" },
      );
      mutate();
    }, 1000),
    [],
  );

  useEffect(() => {
    updateBooks(updatedBooks);
  }, [updatedBooks]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, book: Book) => {
    draggedItem = book;
    e.dataTransfer.setData("text/plain", book.order!.toString());
  };

  const handleDrop = (target: Book) => {
    if (!draggedItem || target === draggedItem) {
      return;
    }

    const draggedIndex = books.indexOf(draggedItem);
    const targetIndex = books.indexOf(target);

    const updatedBooks = [...books];
    updatedBooks.splice(draggedIndex, 1);
    updatedBooks.splice(targetIndex, 0, draggedItem);

    setUpdatedBooks(updatedBooks);
    draggedItem = null;
  };

  const removeBook = (isbn: string, name: string) => {
    setIsDeletingBookcase(true);
    toast.promise(
      removeBookshelfBook({
        customerId: user?.sub as string,
        bookshelfId: bookshelfId,
        isbn,
      }),
      {
        loading: `Removing ${name} from ${data?.name}`,
        success: () => {
          mutate();
          return `Successfully removed ${name}`;
        },
        error: `There was an error when trying to remove ${name}`,
      },

      { id: isbn },
    );
    setIsDeletingBookcase(false);
  };

  const removeBookshelfFunc = () => {
    toast.promise(
      removeBookshelf({
        id: user?.sub as string,
        bookshelfId: bookshelfId,
      }),
      {
        loading: `Removing ${data?.name}`,
        success: () => {
          router.push("/dashboard");
          return `Successfully removed ${data?.name}`;
        },
        error: `There was an error when trying to remove ${data?.name}`,
      },

      { id: data?.name as string },
    );
  };

  const booksToRender = () => {
    if (updatedBooks.length !== 0) {
      return updatedBooks;
    }
    return books;
  };

  if (isLoading || data === undefined || error !== undefined) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
        <div className="flex items-center justify-center">
          <Spinner fast={isLoading} size="large" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-slate-400">
        <div className="flex flex-row space-x-2">
          <Anchor href="/dashboard" className="pb-6">{`< Dashboard`}</Anchor>
          <div className="underline underline-offset-4">
            {"< Manage Bookshelf"}
          </div>
        </div>
        <h1 className="flex flex-col pb-4 text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
          {`Manage ${data?.name}`}
        </h1>
        <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
          {`View and manage bookshelf, you can drag 'n' drop the ranking and click on the book title to view more options`}
        </div>
        <div className="my-4 mt-10 flex flex-row">
          <Button
            size="large"
            variant="primary"
            className="text-black"
            disabled={isDeletingBookshelf}
            onClick={() =>
              router.push(`/dashboard/manage-bookshelf/${bookshelfId}/add-book`)
            }
          >
            Add book
          </Button>
          <div className="flex-grow" />
          <Button
            size="large"
            variant="destructive"
            className="text-black"
            disabled={isDeletingBookshelf}
            onClick={() => removeBookshelfFunc()}
          >
            Delete bookshelf
          </Button>
          <ToggleSwitch
            className="flex items-center justify-center"
            onClick={(toggle) => {
              setToggleBookRender(toggle);
            }}
            toggleOffText="Show covers"
            toogleOnText="Show table"
          />
        </div>

        <div className="pb-20 pt-10">
          {!toggleBookRender ? (
            <RenderBookTable
              books={booksToRender()}
              bookHref={`/dashboard/manage-bookshelf/${bookshelfId}/`}
              userId={user.sub!}
              deleteBook={removeBook}
              handleDragStart={(e, book) => handleDragStart(e, book)}
              handleDrop={(book) => handleDrop(book)}
              draggable
            />
          ) : (
            <RenderBookGrid
              onClick={(book) => {
                router.push(
                  `/dashboard/manage-bookshelf/${bookshelfId}/${book.id}`,
                );
              }}
              books={booksToRender()}
              handleDragStart={(e, book) => handleDragStart(e, book)}
              handleDrop={(book) => handleDrop(book)}
              draggable
            />
          )}
        </div>
      </div>
    );
  }
});
