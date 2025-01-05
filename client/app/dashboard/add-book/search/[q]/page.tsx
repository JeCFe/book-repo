"use client";
import { BookRow, Breadcrumb, PageTitle, ProposedBooks } from "@/components";
import {
  SetupBook,
  useBookWizard,
  useGetCustomerBooks,
  useSearchForBooks,
} from "@/hooks";
import { filterBooks } from "@/lib";
import { addBookshelfBook } from "@/services";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button, Spinner, Table } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import toast from "react-hot-toast";

export default withPageAuthRequired(function SearchBookByQuery({
  user,
  params,
}: {
  user: UserProfile;
  params: { q: string };
}) {
  const { q } = params;
  const { data, isLoading } = useSearchForBooks(q);
  const {
    data: books,
    isLoading: isCustomerBooksLoading,
    mutate,
  } = useGetCustomerBooks();
  const router = useRouter();

  const filteredBooks = useMemo(() => {
    if (isLoading || isCustomerBooksLoading || data === undefined) {
      return;
    }
    var bookOrEmptyArray = books ?? [];
    return filterBooks(
      data,
      new Set(bookOrEmptyArray.map((book) => book.book.isbn ?? "")),
    );
  }, [data, isLoading, books]);

  const saveBook = async (isbn: string) => {
    toast.promise(addBookshelfBook({ id: user.sub!, bookshelfId: [], isbn }), {
      success: () => {
        mutate();
        return "Bookshelves added successfully";
      },
      loading: "Adding new bookshelves",
      error: "There was an issue adding bookshelves",
    });
  };

  return (
    <div className="flex flex-col">
      <Breadcrumb
        crumbs={[
          { href: "/dashboard", display: "Dashboard" },
          { display: "Choose how to add", href: "/dashboard/add-book" },
          { display: "Search", href: "/dashboard/add-book/search" },
          { display: "Search results" },
        ]}
      />

      <PageTitle>Search results:</PageTitle>

      {isLoading || isCustomerBooksLoading ? (
        <Spinner fast={isLoading} />
      ) : (
        <div className="flex overflow-auto pb-4">
          <Table>
            <thead>
              <tr>
                <th className="w-[15px]">Order</th>
                <th>Title</th>
                <th>Author</th>
                <th className="min-w-[200px]">ISBN</th>
                <th className="min-w-[150px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks?.map((work, i) => (
                <BookRow
                  key={`book-row.${i}`}
                  work={work}
                  index={i}
                  saveBook={saveBook}
                />
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <div className="mb-10 mt-20 flex flex-row space-x-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/dashboard/add-book/search")}
        >
          Back
        </Button>
      </div>
    </div>
  );
});
