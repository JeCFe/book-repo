"use client";
import { AddBookModal } from "@/app/setup/books/AddBookModal";
import { ProposedBooks, Table } from "@/components";
import { SetupBook, useBookWizard, useSearchForBooks } from "@/hooks";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default withPageAuthRequired(function SearchBookByQuery({
  params,
}: {
  params: { q: string };
}) {
  const { q } = params;
  const { data, isLoading } = useSearchForBooks(q);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const [passingIsbn, setPassingIsbn] = useState<string | undefined>();
  const [setupBooks, setSetupBooks] = useState<SetupBook[]>([]);

  const { books, updateBook } = useBookWizard();

  const viewBook = (isbn: string) => {
    setPassingIsbn(isbn);
    setOpen(true);
  };
  useEffect(() => {
    if (isLoading) {
      return;
    }
    setSetupBooks(books ?? []);
  }, [isLoading, books]);

  const addBook = async (book: SetupBook) => {
    updateBook({ type: "add-books", setupBook: book });
  };

  const filteredBooks = useMemo(() => {
    if (isLoading || data === undefined) {
      return;
    }
    const isbnSet = new Set(setupBooks.map((book) => book.isbn));

    return data.docs.filter((work) =>
      work.editions.docs.some((editionDoc) => {
        if (!editionDoc.isbn) {
          return false;
        }
        return !isbnSet.has(editionDoc.isbn[0]);
      }),
    );
  }, [books, data, isLoading, setupBooks]);

  const removeBook = (isbn: string) => {
    updateBook({ type: "remove-book", isbn });
  };

  return (
    <div className="flex flex-col">
      <AddBookModal
        isbn={passingIsbn as string}
        addBook={addBook}
        showModal={open}
        setShowModal={setOpen}
        setPassingIsbn={setPassingIsbn}
      />
      <div className="flex flex-row space-x-2 pb-6">
        <Anchor href="/dashboard">{`< Dashboard`}</Anchor>
        <Anchor href="/dashboard/add-book"> {"< Choose how to add"}</Anchor>
        <Anchor href="/dashboard/add-book/search">{`< Dashboard`}</Anchor>
        <div className="text-slate-400 underline underline-offset-4">
          {"< Search results"}
        </div>
      </div>
      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Select book/s
      </h1>
      <div className="mt-4 flex max-w-sm flex-row pb-4 text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`Search results:`}
      </div>
      {isLoading ? (
        <Spinner fast={isLoading} />
      ) : (
        <div className="flex overflow-auto pb-4">
          <Table>
            <thead>
              <tr>
                <th className="w-[15px]">Order</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th className="min-w-[150px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks?.map((work, i) => (
                <>
                  {work.editions.docs.map((edition) => (
                    <>
                      {edition.isbn !== undefined && (
                        <tr key={`${work.key}-${edition.isbn}-${i}`}>
                          <td>{i}</td>
                          <td>{work.title}</td>
                          <td>{work.author_name}</td>
                          <td>{edition.isbn[0]}</td>
                          <td>
                            <Button
                              size="small"
                              variant="primary"
                              className="text-black"
                              onClick={() => viewBook(edition.isbn![0])}
                            >
                              View book
                            </Button>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {setupBooks && setupBooks.length > 0 && (
        <div className="space-y-8 pt-12">
          <div className="flex max-w-md flex-row text-lg font-bold tracking-tight text-slate-300 md:max-w-4xl md:text-xl">
            {`Confirm these books on the previous page: `}
          </div>
          <ProposedBooks
            setSetupBooks={setSetupBooks}
            setupBooks={setupBooks}
            removeBook={removeBook}
            className="space-y-3"
          />
        </div>
      )}
      <div className="mb-10 mt-20 flex flex-row space-x-6">
        <Button
          type="button"
          size="large"
          variant="secondary"
          onClick={() => router.push("/dashboard/add-book/search")}
        >
          Back
        </Button>
      </div>
    </div>
  );
});
