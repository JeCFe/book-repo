"use client";

import { FormValues, SearchForBook } from "@/app/(add-book)";
import { Breadcrumb, ProposedBooks } from "@/components";
import {
  SetupBook,
  useBookWizard,
  useGetBookshelf,
  useGetBookshelfSummary,
} from "@/hooks";
import { addBookshelfBook } from "@/services";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  params: { bookshelfId: string };
};

export default withPageAuthRequired(function AddBook({
  params,
  user,
}: Props & { user: UserProfile }) {
  const { bookshelfId } = params;
  const { data, isLoading } = useGetBookshelf(bookshelfId);
  const router = useRouter();

  const methods = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    router.push(
      `/dashboard/add-book/search/${encodeURIComponent(data.search)}`,
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
        <div className="flex items-center justify-center">
          <Spinner fast={isLoading} size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Breadcrumb
        crumbs={[
          { href: "/dashboard", display: "Dashboard" },
          {
            display: "Manage bookshelf",
            href: `/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}`,
          },
          {
            display: "Choose how to add",
            href: `/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}/add-book`,
          },
          { display: "Search" },
        ]}
      />

      <FormProvider {...methods}>
        <SearchForBook
          onSubmit={onSubmit}
          backClick={() => router.push("/dashboard/add-book")}
          hint={`These books will be added to ${data?.name}`}
        />
      </FormProvider>
    </div>
  );
});
