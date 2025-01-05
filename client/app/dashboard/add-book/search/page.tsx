"use client";

import { Breadcrumb, ErrorSummary, PageTitle } from "@/components";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button, Input } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  search: "string";
};

export default withPageAuthRequired(function AddBook({ user }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    router.push(
      `/dashboard/add-book/search/${encodeURIComponent(data.search)}`,
    );
  };

  const mappedErrors = useMemo(
    () =>
      errors.search && errors.search.message
        ? [{ message: errors.search.message }]
        : undefined,
    [errors],
  );

  return (
    <div className="flex flex-col">
      <Breadcrumb
        crumbs={[
          { href: "/dashboard", display: "Dashboard" },
          { display: "Choose how to add", href: "/dashboard/add-book" },
          { display: "Search" },
        ]}
      />
      <PageTitle>Search</PageTitle>

      {errors.search && <ErrorSummary errors={mappedErrors} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("search", {
            required: "You must give content to search",
          })}
          legend="Search for a book by title or author"
          hint="These books will be added to your homeless bookshelf"
          errors={mappedErrors}
        />
        <div className="mt-10 flex flex-col-reverse gap-y-4 md:flex-row md:gap-y-0 md:space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dashboard/add-book")}
          >
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Search
          </Button>
        </div>
      </form>
    </div>
  );
});
