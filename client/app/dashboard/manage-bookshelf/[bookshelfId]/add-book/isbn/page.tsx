"use client";

import { AddBookByIsbn } from "@/app/dashboard/AddBookByIsbn";
import { Breadcrumb, PageTitle } from "@/components";
import { SetupBook, useGetBookshelf } from "@/hooks";
import { addBookshelfBook } from "@/services";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

type Props = {
  params: { bookshelfId: string };
};

export default withPageAuthRequired(function AddBook({
  params,
  user,
}: Props & { user: UserProfile }) {
  const { bookshelfId } = params;
  const { data, isLoading } = useGetBookshelf(bookshelfId);
  const router = useRouter();

  const saveBook = async (book: SetupBook) => {
    await toast.promise(
      addBookshelfBook({
        id: user.sub!,
        bookshelfId: [bookshelfId],
        isbn: book.isbn,
      }),
      {
        loading: `Adding ${book.name}`,
        success: `Added ${book.name}`,
        error: `There was an error adding ${book.name}`,
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
        <div className="flex items-center justify-center">
          <Spinner fast={isLoading} size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Breadcrumb
        crumbs={[
          { href: "/dashboard", display: "Dashboard" },
          {
            display: "Manage bookshelf",
            href: `/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}`,
          },
          {
            display: "Choose how to add",
            href: `/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}/add-book`,
          },
          { display: "Search" },
        ]}
      />

      <PageTitle>Search via ISBN</PageTitle>

      <AddBookByIsbn
        hint={`These books will be added to ${data?.name}`}
        addBook={saveBook}
        backClick={() =>
          router.push(
            `/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}/add-book`,
          )
        }
      />
    </div>
  );
});
