import { AddBookModal } from "@/app/(add-book)";
import { Selector } from "@/components";
import { SetupBook, Works } from "@/hooks";
import { Button } from "@jecfe/react-design-system";
import { useState } from "react";

type Props = {
  work: Works;
  index: number;
  saveBook?: (isbn: string) => void;
};

export function BookRow({ work, index, saveBook = () => {} }: Props) {
  const [passingIsbn, setPassingIsbn] = useState<string | undefined>();
  const [open, setOpen] = useState<boolean>(false);

  const viewBook = (isbn: string) => {
    setPassingIsbn(isbn);
    setOpen(true);
  };

  const addBook = async (book: SetupBook) => {
    saveBook(book.isbn);
  };

  return (
    <>
      <AddBookModal
        isbn={passingIsbn as string}
        addBook={addBook}
        showModal={open}
        setShowModal={setOpen}
      />
      {work.editions.docs.map((edition) => (
        <>
          {edition.isbn !== undefined && edition.isbn.length !== 0 && (
            <tr key={`${work.key}-${edition.isbn}-${index}`}>
              <td>{index}</td>
              <td>{work.title}</td>
              <td>{work.author_name}</td>
              <td>
                <Selector
                  options={edition.isbn.map((isbn) => {
                    return {
                      value: isbn,
                      label: isbn,
                    };
                  })}
                  placeholder="Select ISBN..."
                  onChange={(x) => {
                    setPassingIsbn(x?.value);
                  }}
                />
              </td>
              <td>
                <Button
                  size="small"
                  variant="primary"
                  className="text-black"
                  onClick={() => viewBook(edition.isbn![0])}
                  disabled={passingIsbn === undefined}
                >
                  View book
                </Button>
              </td>
            </tr>
          )}
        </>
      ))}
    </>
  );
}
