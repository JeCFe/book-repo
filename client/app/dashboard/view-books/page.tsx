"use client";

import { RenderStar, Table } from "@/components";
import { useGetCustomerBooks } from "@/hooks";
import { useGetBookshelf } from "@/hooks/useGetBookshelf";
import { getApiClient, updateRanking } from "@/services";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Book = {
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
  order: number;
  ranking?: number;
};

export default withPageAuthRequired(function ManageBookshelf({
  user,
}: {
  user: UserProfile;
}) {
  const { data, isLoading, error, mutate } = useGetCustomerBooks();

  const router = useRouter();

  const updateBookRanking = (ranking: number, id: string) => {
    toast.promise(
      updateRanking({
        customerId: user.sub!,
        customerBookId: id,
        ranking,
      }),
      {
        loading: "Autosaving",
        success: "Autosave complete",
        error: "There was an error when autosaving",
      },
      { id: "autosave" },
    );
    mutate();
  };

  if (isLoading || data === undefined || error !== undefined) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
        <div className="flex items-center justify-center">
          <Spinner fast={isLoading} size="large" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-slate-400">
        <div className="flex flex-row space-x-2">
          <Anchor href="/dashboard" className="pb-6">{`< Dashboard`}</Anchor>
          <div className="underline underline-offset-4">{"< View Books"}</div>
        </div>
        <h1 className="flex flex-col pb-4 text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
          {`View all your books`}
        </h1>
        <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
          {`Here you can view and manage all the books you currently have in your account.`}
        </div>
        <div className="my-4 flex flex-row">
          <Button
            size="large"
            variant="primary"
            className="text-black"
            onClick={() => router.push(`/dashboard/manage-bookshelf/add-book`)}
          >
            Add book
          </Button>
        </div>
        <div className="overflow-x flex pb-20">
          <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Rating</th>
                <td>ISBN</td>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((book, i) => (
                <tr key={`${book.book.name}-${i}`}>
                  <td>
                    <Anchor href={`/dashboard/manage-bookshelf/${book.id}`}>
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
                      disabled
                      size="small"
                      variant="destructive"
                      className="text-black"
                      onClick={() => {}}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
});
