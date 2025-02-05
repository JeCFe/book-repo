"use client";
import { BookTable } from "@/app/(add-book)";
import { Breadcrumb, PageTitle } from "@/components";
import { useGetCustomerBooks, useSearchForBooks } from "@/hooks";
import { filterBooks } from "@/lib";
import { addBookshelfBook } from "@/services";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import toast from "react-hot-toast";

type Props = {
  params: { q: string };
};

export default withPageAuthRequired(function SearchBookByQuery({
  params,
  user,
}: Props & { user: UserProfile }) {
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
    const bookOrEmptyArray = books ?? [];
    return filterBooks(
      data,
      new Set(bookOrEmptyArray.map((book) => book.book.isbn ?? "")),
    );
  }, [data, isLoading, books]);

  const saveBook = async (isbn: string) => {
    toast.promise(addBookshelfBook({ id: user.sub!, bookshelfId: [], isbn }), {
      success: () => {
        mutate();
        return "Book added successfully";
      },
      loading: "Adding new book",
      error: "There was an issue adding book",
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
        <BookTable filteredBooks={filteredBooks} saveBook={saveBook} />
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
