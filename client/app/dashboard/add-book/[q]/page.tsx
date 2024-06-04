"use client";
import { AddBookModal } from "@/app/setup/books/AddBookModal";
import { Table } from "@/components";
import { SetupBook, useGetCustomerSummary, useSearchForBooks } from "@/hooks";
import { getApiClient } from "@/services";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const addBookshelfBook = getApiClient()
  .path("/action/add-book-shelf-book")
  .method("post")
  .create();

export default function SearchBookByQuery({
  params,
}: {
  params: { q: string };
}) {
  const { q } = params;
  const { data, isLoading } = useSearchForBooks(q);
  const {
    isLoading: customerSummaryLoading,
    data: customerSummaryData,
    mutate,
  } = useGetCustomerSummary(); //Will need new endpoint that just returns customer bookshelves names and IDs
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const [currentIsbn, setCurrentIsbn] = useState<string | undefined>();
  const [passingIsbn, setPassingIsbn] = useState<string | undefined>();

  useEffect(() => {
    if (!data) {
      return;
    }
    console.log(data);
  }, [data]);

  const viewBook = (isbn: string) => {
    setPassingIsbn(isbn);
    setOpen(true);
  };

  const addBook = async (book: SetupBook) => {
    if (
      book === undefined ||
      customerSummaryData === undefined ||
      user === undefined
    ) {
      return; //error handelling needed
    }
    const bookshelfIds = customerSummaryData.bookshelves?.map((x) => x.id);
    try {
      await addBookshelfBook({
        id: user.sub!,
        isbn: book.isbn,
        bookshelfId: bookshelfIds ?? [],
      });
    } catch {
      console.log("Something went wrong!");
    }
    mutate();
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col">
      <AddBookModal
        isbn={passingIsbn as string}
        addBook={addBook}
        showModal={open}
        setShowModal={setOpen}
        setPassingIsbn={setPassingIsbn}
        setCurrentIsbn={setCurrentIsbn}
      />
      <div className="flex flex-row space-x-2 pb-6">
        <Anchor href="/dashboard">{`< Dashboard`}</Anchor>
        <Anchor href={`/dashboard/add-book`}>{`< Add book`}</Anchor>
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
        <Spinner />
      ) : (
        <div className="flex overflow-auto pb-20">
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
              {data.docs.map((work, i) => (
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
    </div>
  );
}
