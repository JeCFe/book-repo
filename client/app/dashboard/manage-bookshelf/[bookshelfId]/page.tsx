"use client";
import { LinkButton, Table } from "@/components";
import { useGetBookshelf } from "@/hooks/useGetBookshelf";
import { getApiClient } from "@/services";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ShowBookDetailsModal } from "../../ShowBookDetailsModal";

const updateBookshelfOrder = getApiClient()
  .path("/action/update-bookshelf-order")
  .method("post")
  .create();

const removeBookshelfBook = getApiClient()
  .path("/action/remove-bookshelf-book")
  .method("post")
  .create();

const removeBookshelf = getApiClient()
  .path("/action/remove-bookshelf")
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

type Props = {
  params: { bookshelfId: string };
};

export default withPageAuthRequired(function ManageBookshelf({
  params,
  user,
}: Props & { user: UserProfile }) {
  const { bookshelfId } = params;

  const { data, isLoading, error, mutate } = useGetBookshelf(bookshelfId);
  const [books, setBooks] = useState<Book[]>([]);
  const [updatedBooks, setUpdatedBooks] = useState<Book[]>([]);
  const [isDeletingBookshelf, setIsDeletingBookcase] = useState<boolean>(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [passingIsbn, setPassingIsbn] = useState<string | undefined>();

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
      (a, b) => a.order - b.order,
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
      (a, b) => a.order - b.order,
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

    setUpdatedBooks(updatedBooks);
    draggedItem = null;
  };

  const removeBook = (book: Book) => {
    setIsDeletingBookcase(true);
    toast.promise(
      removeBookshelfBook({
        customerId: user?.sub as string,
        bookshelfId: bookshelfId,
        isbn: book.book.isbn,
      }),
      {
        loading: `Removing ${book.book.name} from ${data?.name}`,
        success: () => {
          mutate();
          return `Successfully removed ${book.book.name}`;
        },
        error: `There was an error when trying to remove ${book.book.name}`,
      },

      { id: book.book.isbn as string },
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
        <ShowBookDetailsModal
          passingIsbn={passingIsbn ?? ""}
          showModal={isOpen}
          setShowModal={setIsOpen}
          setPassingIsbn={setPassingIsbn}
        />
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
        </div>
        <div className="flex overflow-auto pb-20">
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
              {booksToRender().map((book, i) => (
                <tr
                  key={`${book.book.name}-${i}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, book)}
                  onDrop={() => handleDrop(book)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <td>{book.order}</td>
                  <td>
                    <LinkButton
                      onClick={() => {
                        setPassingIsbn(book.book.isbn ?? "");
                        setIsOpen(true);
                      }}
                    >
                      {book.book.name}
                    </LinkButton>
                  </td>
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
});
