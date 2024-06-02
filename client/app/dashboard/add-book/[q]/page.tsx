"use client";
import { Table } from "@/components";
import { useSearchForBooks } from "@/hooks";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import { useEffect } from "react";

export default function SearchBookByQuery({
  params,
}: {
  params: { q: string };
}) {
  const { q } = params;
  const { data, isLoading } = useSearchForBooks(q);

  useEffect(() => {
    if (!data) {
      return;
    }
    console.log(data);
  }, [data]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-2 pb-6">
        <Anchor href="/dashboard">{`< Dashboard`}</Anchor>
        <Anchor href={`/dashboard/add-book`}>{`< Add book`}</Anchor>
        <div className="text-slate-400 underline underline-offset-4">
          {"< Search results"}
        </div>
      </div>
      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Add Book
      </h1>
      <div className="mt-4 flex max-w-sm flex-row pb-4 text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`Search results:`}
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex overflow-auto">
          <Table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Action</th>
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
