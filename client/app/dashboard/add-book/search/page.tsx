"use client";

import { FormValues, SearchForBook } from "@/app/(add-book)";
import { Breadcrumb } from "@/components";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

import { FormProvider, useForm } from "react-hook-form";

export default withPageAuthRequired(function AddBook() {
  const router = useRouter();

  const methods = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    router.push(
      `/dashboard/add-book/search/${encodeURIComponent(data.search)}`,
    );
  };

  return (
    <div className="flex flex-col">
      <Breadcrumb
        crumbs={[
          { href: "/dashboard", display: "Dashboard" },
          { display: "Choose how to add", href: "/dashboard/add-book" },
          { display: "Search" },
        ]}
      />
      <FormProvider {...methods}>
        <SearchForBook
          onSubmit={onSubmit}
          backClick={() => router.push("/dashboard/add-book")}
          hint="These books will be added to your homeless bookshelf"
        />
      </FormProvider>
    </div>
  );
});
