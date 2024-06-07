"use client";

import { AccordionManager } from "@/components";
import { useGetBookshelfSummary } from "@/hooks";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Anchor, Spinner } from "@jecfe/react-design-system";
import { AddBookshelfContent } from "./AddBookshelfContent";

export default function AddBookshelf() {
  const { user, isLoading } = useUser();
  return (
    <div className="text-slate-400">
      <div className="flex flex-row space-x-2">
        <Anchor href="/dashboard" className="pb-6">{`< Dashboard`}</Anchor>
        <div className="underline underline-offset-4">{"< Add Bookshelf"}</div>
      </div>
      <h1 className="flex flex-col pb-4 text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Add Bookshelf
      </h1>
      {isLoading || !user || !user.sub ? (
        <Spinner />
      ) : (
        <AddBookshelfContent id={user?.sub} />
      )}
    </div>
  );
}
