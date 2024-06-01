"use client";
import { Table } from "@/components";
import { useGetBookshelf } from "@/hooks/useGetBookshelf";
import { Spinner } from "@jecfe/react-design-system";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  const { data, isLoading, error } = useGetBookshelf(bookshelfId);
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  let draggedItem: Book | null = null;

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
    debounce((x: Book[]) => {
      console.log("Debounce");
    }, 1000),
    [],
  );

  useEffect(() => {
    updateBooks(books);
  }, [books]);

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    book: Book,
  ) => {
    draggedItem = book;
    e.dataTransfer.setData("text/plain", book.order.toString());
  };

  const handleDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    target: Book,
  ) => {
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
        <h1 className="flex flex-col pb-4 text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
          {`Manage ${data?.name}`}
        </h1>
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
                  onDrop={(e) => handleDrop(e, book)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <td>{book.order}</td>
                  <td>{book.book.name}</td>
                  <td>{book.book.authors?.join(", ")}</td>
                  <td>COMING</td>
                  <td>{book.book.isbn}</td>
                  <td>DELETE COMING</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}
