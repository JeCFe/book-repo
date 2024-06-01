"use client";
import { Table } from "@/components";
import { useGetBookshelf } from "@/hooks/useGetBookshelf";
import { Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ManageBookshelf({
  params,
}: {
  params: { bookshelfId: string };
}) {
  const { bookshelfId } = params;
  const { data, isLoading, error } = useGetBookshelf(bookshelfId);
  const router = useRouter();

  console.log(bookshelfId);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (data === undefined) {
      router.push("/dashboard");
    }
  }, [data, isLoading]);

  if (isLoading && data === undefined) {
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
        <h1 className="flex flex-col pb-4 text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
          {`Manage ${data?.name}`}
        </h1>
        <div className="flex overflow-auto">
          <Table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Author</th>
                <th>Rating</th>
                <td>ISBN</td>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.books?.map((book, i) => (
                <tr key={`${book.book.name}-${i}`}>
                  <td>{book.order}</td>
                  <td>{book.book.name}</td>
                  <td>{book.book.authors?.join(", ")}</td>
                  <td>COMING</td>
                  <td>{book.book.isbn}</td>
                  <td>DELETE COMING</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}
