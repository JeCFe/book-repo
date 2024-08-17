"use client";

import {
  Alerter,
  AvidReviewer,
  BetaTester,
  BookAddict,
  Commentor,
  Contributor,
  GoalScorer,
  GoalSetter,
  Sharing,
  Sponsor,
} from "@/assets/trophies";
import { Accordion, Picture, SideNav } from "@/components";
import { useBookWizard, useGetCustomerSummary, useSetupWizard } from "@/hooks";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShowBookDetailsModal } from "./ShowBookDetailsModal";

export default withPageAuthRequired(function Dashboard({ user }) {
  const { isLoading, data, error } = useGetCustomerSummary();
  const { updateBook } = useBookWizard();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [passingCustomerBookId, setPassingCustomerBookId] = useState<
    string | undefined
  >();

  const router = useRouter();

  useEffect(() => {
    updateBook({ type: "default" });
  }, []);

  useEffect(() => {
    if (!isLoading && !data) {
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
        <ShowBookDetailsModal
          passingCustomerBookId={passingCustomerBookId as string}
          showModal={isOpen}
          setShowModal={setIsOpen}
          setPassingCustomerBookId={setPassingCustomerBookId}
          userId={user.sub!}
        />
        <div className="flex w-full">
          <SideNav>
            <>
              <div className="flex w-full flex-grow flex-row overflow-y-auto px-2">
                <div className="flex flex-col space-y-4 p-4">
                  <Anchor href="/dashboard/add-book">Add book</Anchor>
                  <Anchor href="/dashboard/add-bookshelf">Add bookshelf</Anchor>
                  <Anchor href="/dashboard/view-books">View books</Anchor>
                </div>
              </div>
              <div className="flex flex-row items-center p-4 text-center text-base">
                <div className="flex items-center text-center text-slate-400">
                  {user.nickname}
                </div>
                <div className="flex flex-grow" />
                <div className="flex flex-row space-x-2">
                  <Anchor href="/manage-user">Manage</Anchor>
                  <Anchor href="/api/auth/logout">Logout</Anchor>
                </div>
              </div>
            </>
          </SideNav>
          <div className="flex w-full flex-col space-y-10 overflow-x-auto px-12 py-24 text-slate-500">
            {data.trophies && (
              <Accordion title="Trophies" sideStyle={false} containerSize="max">
                {data.trophies.map((x) => {
                  const className = "w-24 md:w-36";
                  switch (x.type) {
                    case "beta-tester":
                      return <BetaTester className={className} />;
                    case "alerter":
                      return <Alerter className={className} />;
                    case "avid-reviewer":
                      return <AvidReviewer className={className} />;
                    case "book-addict":
                      return <BookAddict className={className} />;
                    case "commentator":
                      return <Commentor className={className} />;
                    case "contributor":
                      return <Contributor className={className} />;
                    case "goal-scored":
                      return <GoalScorer className={className} />;
                    case "goal-setter":
                      return <GoalSetter className={className} />;
                    case "sharing-is-caring":
                      return <Sharing className={className} />;
                    case "sponsor":
                      return <Sponsor className={className} />;
                  }
                })}
              </Accordion>
            )}
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
                              onClick={() => {
                                setPassingCustomerBookId(book.id as string);
                                setIsOpen(true);
                              }}
                              key={`${bookshelf.id}-${book.book.isbn}`}
                              className="flex cursor-pointer flex-row rounded border-2 border-transparent hover:border-slate-200"
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
});
