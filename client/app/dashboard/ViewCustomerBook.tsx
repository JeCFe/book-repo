"use client";

import { Picture, RenderSection, RenderStar, Table } from "@/components";
import { useGetCustomerBook } from "@/hooks";
import { removeBookshelfBook, updateComment, updateRanking } from "@/services";
import { addCustomerBookBookshelf } from "@/services/customerBookBookshelf";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner, TextArea } from "@jecfe/react-design-system";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import toast from "react-hot-toast";

type Props = {
  params: { customerBookId: string; bookshelfId: string };
  breadcrumbHref: string;
  breadcrumbReturn: string;
};

export function ViewCustomerBook({
  params,
  user,
  breadcrumbHref,
  breadcrumbReturn,
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
    mutate({ ...data, ranking }, false);
  };

  const debounceUpdateComment = useCallback(
    debounce(async (comment: string) => {
      if (data === undefined) {
        return;
      }
      toast.promise(
        updateComment({
          customerId: user.sub!,
          customerBookId: data.id,
          comment,
        }),
        {
          loading: "Autosaving",
          success: "Autosave complete",
          error: "There was an error when autosaving",
        },
        { id: "autosave" },
      );
      mutate({ ...data, comment }, false);
    }, 1000),
    [],
  );

  const removeBookFromBookshelf = async (bookshelfId: string) => {
    if (data?.bookshelfSummaries === undefined) {
      return;
    }

    var updatedBookshelfSummaries = data.bookshelfSummaries.map((bookshelf) => {
      if (bookshelf.id == bookshelfId) {
        bookshelf.containsBook = false;
      }
      return bookshelf;
    });

    console.log(updatedBookshelfSummaries);

    toast.promise(
      removeBookshelfBook({
        customerId: user.sub!,
        isbn: data.book.isbn,
        bookshelfId,
      }),
      {
        loading: "Removing book from bookshelf",
        success: "Removed book from bookshelf",
        error: "There was an error when removing book from bookshelf",
      },
      { id: "remove" },
    );
    mutate({ ...data, bookshelfSummaries: updatedBookshelfSummaries }, true);
  };

  const addBookTooBookshelf = async (bookshelfId: string) => {
    if (data?.bookshelfSummaries === undefined) {
      return;
    }

    var updatedBookshelfSummaries = data.bookshelfSummaries.map((bookshelf) => {
      if (bookshelf.id == bookshelfId) {
        bookshelf.containsBook = true;
      }
      return bookshelf;
    });

    toast.promise(
      addCustomerBookBookshelf({
        customerId: user.sub!,
        customerBookId: data.id,
        bookshelfId,
      }),
      {
        loading: "Adding book from bookshelf",
        success: "Added book from bookshelf",
        error: "There was an error when adding book from bookshelf",
      },
      { id: "add" },
    );

    console.log(updatedBookshelfSummaries);
    mutate({ ...data, bookshelfSummaries: updatedBookshelfSummaries }, true);
  };

  return (
    <div className="text-slate-400">
      <div className="flex flex-row space-x-2">
        <Anchor href="/dashboard" className="pb-6">{`< Dashboard`}</Anchor>
        <Anchor href={`/dashboard/${breadcrumbHref}`} className="pb-6">
          {`< ${breadcrumbReturn}`}
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
          <div className="flex flex-col">
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
            <div className="mt-10 w-full">
              <RenderSection
                size="large"
                theme="dark"
                title={<div>Comment &#9998;</div>}
                className="w-96"
              >
                <div className="flex w-full max-w-3xl overflow-x-auto pt-4">
                  <TextArea
                    onChange={debounceUpdateComment}
                    autoGrow
                    width="full"
                    border="bottom"
                    defaultValue={data.comment}
                    placeholder="Add a comment..."
                    className="mt-4 border-b !border-white bg-transparent"
                  />
                </div>
              </RenderSection>
            </div>

            <RenderSection
              title="Bookshelves"
              size="large"
              theme="dark"
              className="pt-8"
            >
              <div className="flex w-full max-w-3xl overflow-x-auto pt-4">
                <Table>
                  <thead>
                    <tr>
                      <th>Bookshelf</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bookshelfSummaries
                      ?.sort((a, b) => a.name!.localeCompare(b.name!))
                      .map((bookshelf, i) => (
                        <tr key={`${bookshelf.id}`}>
                          <td>{bookshelf.name}</td>
                          <td>
                            {bookshelf.containsBook ? (
                              <Button
                                size="medium"
                                variant="destructive"
                                className="w-20 text-black"
                                onClick={() =>
                                  removeBookFromBookshelf(bookshelf.id)
                                }
                              >
                                Remove
                              </Button>
                            ) : (
                              <Button
                                size="medium"
                                variant="primary"
                                className="w-20 text-black"
                                onClick={() =>
                                  addBookTooBookshelf(bookshelf.id)
                                }
                              >
                                Add
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </RenderSection>
          </div>
        )}
      </div>
    </div>
  );
}
