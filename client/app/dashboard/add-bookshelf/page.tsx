"use client";

import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import { AddBookshelfContent } from "./AddBookshelfContent";

export default withPageAuthRequired(function AddBookshelf({ user }) {
  return (
    <div className="text-slate-400">
      <div className="flex flex-row space-x-2">
        <Anchor href="/dashboard" className="pb-6">{`< Dashboard`}</Anchor>
        <div className="underline underline-offset-4">{"< Add Bookshelf"}</div>
      </div>
      <h1 className="flex flex-col pb-4 text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Add Bookshelf
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        You can add as many bookshelves that you want.
      </div>
      <AddBookshelfContent id={user.sub!} />
    </div>
  );
});
