import { AddBookModal } from "@/app/setup/books/AddBookModal";
import { Selector } from "@/components";
import { SetupBook, useBookWizard, Works } from "@/hooks";
import { Button } from "@jecfe/react-design-system";
import { useState } from "react";

export function BookRow({ work, index }: { work: Works; index: number }) {
  const [passingIsbn, setPassingIsbn] = useState<string | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const { updateBook } = useBookWizard();

  const viewBook = (isbn: string) => {
    setPassingIsbn(isbn);
    setOpen(true);
  };

  const addBook = async (book: SetupBook) => {
    updateBook({ type: "add-books", setupBook: book });
  };

  return (
    <>
      <AddBookModal
        isbn={passingIsbn as string}
        addBook={addBook}
        showModal={open}
        setShowModal={setOpen}
        setPassingIsbn={setPassingIsbn}
      />
      {work.editions.docs.map((edition) => (
        <>
          {edition.isbn !== undefined && (
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
