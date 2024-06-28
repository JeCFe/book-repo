"use client";

import { Picture, RenderSection, RenderStar } from "@/components";
import { useGetCustomerBook } from "@/hooks";
import { updateRanking } from "@/services";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Spinner } from "@jecfe/react-design-system";
import { ReactNode } from "react";
import toast from "react-hot-toast";

type Props = {
  params: { customerBookId: string; bookshelfId: string };
};

export default withPageAuthRequired(function ManageBook({
  params,
  user,
}: Props & { user: UserProfile }) {
  const { data, isLoading, mutate } = useGetCustomerBook(
    user.sub!,
    params.customerBookId,
  );

  const updateBookRanking = (ranking: number) => {
    if (data === undefined) {
      return;
    }
    toast.promise(
      updateRanking({
        customerId: user.sub!,
        customerBookId: data.id,
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

  return (
    <div className="text-slate-400">
      <div className="flex flex-row space-x-2">
        <Anchor href="/dashboard" className="pb-6">{`< Dashboard`}</Anchor>
        <Anchor
          href={`/dashboard/manage-bookshelf/${encodeURIComponent(params.bookshelfId)}`}
          className="pb-6"
        >
          {"< Manage Bookshelf"}
        </Anchor>
        <div className="underline underline-offset-4">{"< Manage Book"}</div>
      </div>
      <h1 className="flex flex-col pb-4 text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        {`Manage Book`}
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`View and manage book details, updating ranking, adding a comment, removing book from account, and flagging any issue with the book details`}
      </div>
      <div className="pb-20 pt-10">
        {isLoading || !data ? (
          <div className="flex flex-col items-center justify-center md:flex-row">
            <div className="flex items-center justify-center rounded border border-cyan-500 shadow-2xl md:min-h-[256px] md:min-w-[192px]">
              <Spinner className="flex" fast={isLoading} />
            </div>
            <div className="flex h-full w-full items-center justify-center">
              <Spinner className="flex" fast={isLoading} />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col space-y-2 md:flex-row md:space-x-12 md:space-y-0">
            <div>
              <Picture
                size="xLarge"
                pictureUrl={data.book.picture}
                title={data.book.name ?? ""}
                loading={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <RenderSection size="large" theme="dark" title="Book Title">
                {data.book.name}
              </RenderSection>
              <RenderSection size="large" theme="dark" title="Rating">
                <RenderStar
                  allowHover
                  ranking={data.ranking}
                  onChange={updateBookRanking}
                />
              </RenderSection>
              <RenderSection size="large" theme="dark" title="Release Year">
                {data.book.release}
              </RenderSection>

              {data.book.pageCount && data.book.pageCount > 0 && (
                <RenderSection size="large" theme="dark" title="Page Count">
                  <div className="max-w-sm">{data.book.pageCount}</div>
                </RenderSection>
              )}

              {data.book.authors && data.book.authors.length > 0 && (
                <RenderSection size="large" theme="dark" title="Authors">
                  <div className="max-w-sm">
                    {data.book.authors?.join(", ")}
                  </div>
                </RenderSection>
              )}
              {data.book.subjects && data.book.subjects.length > 0 && (
                <RenderSection size="large" theme="dark" title="Subjects">
                  <div className="max-w-sm">
                    {data.book.subjects?.join(", ")}
                  </div>
                </RenderSection>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
