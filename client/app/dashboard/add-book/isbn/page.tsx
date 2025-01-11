"use client";

import { Breadcrumb, PageTitle } from "@/components";
import { SetupBook } from "@/hooks";
import { addBookshelfBook } from "@/services";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AddBookByIsbn } from "../../AddBookByIsbn";

export default withPageAuthRequired(function AddBook({ user }) {
  const router = useRouter();

  const saveBook = async (book: SetupBook) => {
    await toast.promise(
      addBookshelfBook({ id: user.sub!, bookshelfId: [], isbn: book.isbn }),
      {
        loading: `Adding ${book.name}`,
        success: `Added ${book.name}`,
        error: `There was an error adding ${book.name}`,
      },
    );
  };

  return (
    <div className="flex flex-col">
      <Breadcrumb
        crumbs={[
          { href: "/dashboard", display: "Dashboard" },
          { display: "Choose how to add", href: "/dashboard/add-book" },
          { display: "Search" },
        ]}
      />
      <PageTitle>Search via ISBN</PageTitle>

      <AddBookByIsbn
        hint="This book will be added to your homeless bookshelf"
        addBook={saveBook}
        backClick={() => router.push("/dashboard/add-book")}
      />
    </div>
  );
});
