import { useGetCustomerBooks } from "@/hooks";
import { updateRanking } from "@/services";
import { Anchor, Button } from "@jecfe/react-design-system";
import { DragEvent } from "react";
import toast from "react-hot-toast";
import { Picture, RenderStar, Table } from ".";

export type Book = {
  book: {
    isbn: string | null;
    name: string | null;
    authors?: string[] | undefined;
    subjects: string[] | null;
    release?: string | undefined;
    picture?: string | undefined;
    pageCount: number;
  };
  id: string;
  order?: number;
  ranking?: number;
};

type Props = {
  books: Book[];
  draggable?: boolean;
  handleDragStart?: (e: DragEvent<HTMLDivElement>, book: Book) => void;
  handleDrop?: (book: Book) => void;
  onClick?: (book: Book) => void;
};

export function RenderBookGrid({
  books,
  draggable = false,
  handleDragStart = () => {},
  handleDrop = () => {},
  onClick = () => {},
}: Props) {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {books.map((book) => (
          <div
            onClick={() => onClick(book)}
            draggable={draggable}
            onDragStart={(e) => handleDragStart(e, book)}
            onDrop={() => handleDrop(book)}
            onDragOver={(e) => e.preventDefault()}
            key={book.id}
            className="flex cursor-pointer flex-row rounded border-2 border-transparent hover:border-slate-200"
          >
            <Picture
              size="large"
              pictureUrl={book.book.picture}
              title={book.book.name ?? ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
