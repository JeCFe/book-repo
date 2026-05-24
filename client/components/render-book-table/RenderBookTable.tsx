import { RenderStar } from "@/components";
import { useGetCustomerBooks } from "@/hooks";
import { updateRanking } from "@/services";
import { Book } from "@/types";
import { Anchor, Button, Table } from "@jecfe/react-design-system";
import { DragEvent } from "react";
import toast from "react-hot-toast";

type Props = {
  books: Book[];
  bookHref: string;
  userId: string;
  draggable?: boolean;
  deleteBook: (isbn: string, name: string) => void;
  handleDragStart?: (e: DragEvent<HTMLTableRowElement>, book: Book) => void;
  handleDrop?: (book: Book) => void;
};

export function RenderBookTable({
  books,
  deleteBook,
  bookHref,
  userId,
  draggable = false,
  handleDragStart = () => {},
  handleDrop = () => {},
}: Props) {
  const { mutate } = useGetCustomerBooks();

  const updateBookRanking = (ranking: number, id: string) => {
    toast.promise(
      updateRanking({
        customerId: userId,
        customerBookId: id,
        ranking,
      }),
      {
        loading: "Autosaving",
        success: () => {
          mutate();
          return "Autosave complete";
        },
        error: "There was an error when autosaving",
      },
      { id: "autosave" },
    );
  };
  return (
    <div className="flex overflow-x-auto">
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
              draggable={draggable}
              onDragStart={(e) => handleDragStart(e, book)}
              onDrop={() => handleDrop(book)}
              onDragOver={(e) => e.preventDefault()}
            >
              <td>{book.order ?? i + 1}</td>
              <td>
                <Anchor href={`${bookHref}/${book.id}`}>
                  {book.book.name}
                </Anchor>
              </td>
              <td>{book.book.authors?.join(", ")}</td>
              <td>
                <RenderStar
                  allowHover
                  onChange={(ranking) => {
                    updateBookRanking(ranking, book.id);
                  }}
                  ranking={book.ranking}
                />
              </td>
              <td>{book.book.isbn}</td>
              <td>
                <Button
                  size="small"
                  variant="destructive"
                  className="text-black"
                  onClick={() =>
                    deleteBook(book.book.isbn as string, book.book.name!)
                  }
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
