"use client";

import { Picture, SideNav } from "@/components";
import { useGetCustomerSummary } from "@/hooks";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Anchor, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoading, data, error } = useGetCustomerSummary();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoading && !data) {
      router.push("/setup");
    }
  }, [data, error, isLoading, router]);

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
                <div className="p-4">
                  <Anchor href="/dashboard/add-book">Add book</Anchor>
                </div>
              </div>
              <div className="flex flex-row px-2 pt-2 text-center text-sm">
                <div className="flex items-center text-center text-slate-400">
                  {user?.nickname}
                </div>
                <div className="flex flex-grow" />
                <Anchor href="/api/auth/logout">Logout</Anchor>
              </div>
            </>
          </SideNav>
          <div className="flex w-full flex-col space-y-10 overflow-x-auto px-12 py-24 text-slate-500">
            {data.bookshelves &&
              data.bookshelves?.map((x) => (
                <div key={x.id}>
                  {x.books && (
                    <div className="flex flex-col">
                      <div className="w-full border-b border-slate-600 pb-2 text-3xl font-bold tracking-tight text-slate-300">
                        {x.name}
                      </div>
                      <div className="my-4 flex flex-row space-x-2 overflow-x-auto">
                        {x.books?.map((book) => (
                          <div
                            key={`${x.id}-${book.book.isbn}`}
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
}
