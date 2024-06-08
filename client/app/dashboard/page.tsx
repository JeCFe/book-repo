"use client";

import { Picture, SideNav } from "@/components";
import { useGetCustomerSummary } from "@/hooks";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default withPageAuthRequired(
  function Dashboard({ user }) {
    const { isLoading, data, error } = useGetCustomerSummary();
    const router = useRouter();

    useEffect(() => {
      if (error) {
        throw error;
      }
      if (!isLoading && !data && user) {
        router.push("/setup");
      }
    }, [data, error, isLoading]);

    if (isLoading && !data) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
          <div className="flex items-center justify-center">
            <Spinner fast={isLoading} size="large" />
          </div>
        </div>
      );
    }

    if (!isLoading && data) {
      return (
        <div>
          <div className="flex w-full">
            <SideNav>
              <>
                <div className="flex w-full flex-grow flex-row overflow-y-auto px-2">
                  <div className="flex flex-col space-y-4 p-4">
                    <Anchor href="/dashboard/add-book">Add book</Anchor>
                    <Anchor href="/dashboard/add-bookshelf">
                      Add bookshelf
                    </Anchor>
                  </div>
                </div>
                <div className="h-f flex flex-row items-center px-4 pt-4 text-center text-base">
                  <div className="flex items-center text-center text-slate-400">
                    {user.nickname}
                  </div>
                  <div className="flex flex-grow" />
                  <div className="flex flex-row space-x-2">
                    <Anchor href="/me">Manage</Anchor>
                    <Anchor href="/api/auth/logout">Logout</Anchor>
                  </div>
                </div>
              </>
            </SideNav>
            <div className="flex w-full flex-col space-y-10 overflow-x-auto px-12 py-24 text-slate-500">
              {data.bookshelves &&
                data.bookshelves?.map((bookshelf) => (
                  <div key={bookshelf.id}>
                    {bookshelf.books && (
                      <div className="flex flex-col">
                        <div className="flex w-full flex-row border-b border-slate-600 pb-2">
                          <div className="text-3xl font-bold tracking-tight text-slate-300">
                            {bookshelf.name}
                          </div>
                          <div className="flex flex-grow" />
                          <div className="flex">
                            <Anchor
                              href={`/dashboard/manage-bookshelf/${bookshelf.id}`}
                            >
                              Manage
                            </Anchor>
                          </div>
                        </div>

                        <div className="my-4 flex flex-row space-x-2 overflow-x-auto">
                          {bookshelf.books
                            .toSorted((a, b) => a.order - b.order)
                            .map((book) => (
                              <div
                                key={`${bookshelf.id}-${book.book.isbn}`}
                                className="flex flex-row"
                              >
                                <Picture
                                  size="large"
                                  pictureUrl={book.book.picture}
                                  title={book.book.name as string}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      );
    }
  },
  { returnTo: "/dashboard" },
);
