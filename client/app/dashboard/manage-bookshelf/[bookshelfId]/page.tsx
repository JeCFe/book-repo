"use client";
import { Table } from "@/components";
import { useGetBookshelf } from "@/hooks/useGetBookshelf";
import { getApiClient } from "@/services";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const updateBookshelfOrder = getApiClient()
  .path("/action/update-bookshelf-order")
  .method("post")
  .create();

const removeBookshelfBook = getApiClient()
  .path("/action/remove-bookshelf-book")
  .method("post")
  .create();

type Book = {
  book: {
    isbn: string | null;
    name: string | null;
    authors?: string[] | undefined;
    subjects: string[] | null;
    release?: string | undefined;
    picture?: string | undefined;
    pageCount: number;
  };
  order: number;
};

export default function ManageBookshelf({
  params,
}: {
  params: { bookshelfId: string };
}) {
  const { bookshelfId } = params;
  const { user } = useUser();
  const { data, isLoading, error, mutate } = useGetBookshelf(bookshelfId);
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  let draggedItem: Book | null = null;

  useEffect(() => {
    if (error === undefined || typeof error === "undefined") {
      return;
    }
    toast.error(error);
  }, error);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (data === undefined) {
      router.push("/dashboard");
      return;
    }
    const booksOrdered = [...(data.books as Book[])].toSorted(
      (a, b) => a.order - b.order,
    );
    setBooks(booksOrdered);
  }, [data, isLoading]);

  const updateBooks = useCallback(
    debounce(async (x: Book[], userSub: string) => {
      toast.promise(
        updateBookshelfOrder({
          customerId: userSub,
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
    if (!user) {
      return;
    }
    updateBooks(books, user.sub!);
  }, [books, user]);

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    book: Book,
  ) => {
    draggedItem = book;
    e.dataTransfer.setData("text/plain", book.order.toString());
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

    setBooks(updatedBooks);
    draggedItem = null;
  };

  const removeBook = (book: Book) => {
    toast.promise(
      removeBookshelfBook({
        customerId: user?.sub as string,
        bookshelfId: bookshelfId,
        isbn: book.book.isbn,
      }),
      {
        loading: `Removing ${book.book.name} from ${data?.name}`,
        success: `Successfully removed ${book.book.name}`,
        error: `There was an error when trying to remove ${book.book.name}`,
      },

      { id: book.book.isbn as string },
    );
    mutate();
  };

  if (isLoading && data === undefined) {
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
        <div className="my-4 flex flex-row">
          <Button
            size="large"
            variant="primary"
            className="text-black"
            onClick={() =>
              router.push(`/dashboard/manage-bookshelf/${bookshelfId}/add-book`)
            }
          >
            Add book
          </Button>
          <div className="flex-grow" />
          <Button size="large" variant="destructive" className="text-black">
            Delete bookshelf
          </Button>
        </div>
        <div className="flex overflow-auto">
          <Table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Author</th>
                <th>Rating</th>
                <td>ISBN</td>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, i) => (
                <tr
                  key={`${book.book.name}-${i}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, book)}
                  onDrop={() => handleDrop(book)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <td>{book.order}</td>
                  <td>{book.book.name}</td>
                  <td>{book.book.authors?.join(", ")}</td>
                  <td>COMING</td>
                  <td>{book.book.isbn}</td>
                  <td>
                    <Button
                      size="small"
                      variant="destructive"
                      className="text-black"
                      onClick={() => removeBook(book)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}
