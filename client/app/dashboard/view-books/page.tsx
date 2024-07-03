"use client";

import { RenderBookTable, ToggleSwitch } from "@/components";
import { useGetCustomerBooks } from "@/hooks";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default withPageAuthRequired(function ManageBookshelf({
  user,
}: {
  user: UserProfile;
}) {
  const { data, isLoading, error } = useGetCustomerBooks();
  const [toggleBookRender, setToggleBookRender] = useState<boolean>(false);

  const router = useRouter();

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
        <div className="my-4 flex flex-row pt-10">
          <Button
            size="large"
            variant="primary"
            className="text-black"
            onClick={() => router.push(`/dashboard/manage-bookshelf/add-book`)}
          >
            Add book
          </Button>
          <div className="flex flex-grow" />
          <ToggleSwitch
            className="flex items-center justify-center"
            onClick={(toggle) => {
              setToggleBookRender(toggle);
            }}
          />
        </div>
        {!toggleBookRender ? (
          <RenderBookTable
            books={data}
            bookHref={"/dashboard/view-book/"}
            userId={user.sub!}
            deleteBook={() => {}}
          />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
});
