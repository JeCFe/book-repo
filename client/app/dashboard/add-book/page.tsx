"use client";

import { Breadcrumb, ErrorSummary, PageTitle } from "@/components";
import { useBookWizard } from "@/hooks";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button, RadioGroup } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  radio: "isbn" | "search" | "csv";
};

export default withPageAuthRequired(function AddBook() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    switch (data.radio) {
      case "search":
        router.push("/dashboard/add-book/search");
        return;

      case "isbn":
        router.push("/dashboard/add-book/isbn");
        return;
    }
  };

  return (
    <div className="flex flex-col">
      <Breadcrumb
        crumbs={[
          { href: "/dashboard", display: "Dashboard" },
          { display: "Choose how to add" },
        ]}
      />

      <PageTitle>Add a book</PageTitle>

      {errors.radio && (
        <ErrorSummary
          errors={
            errors.radio && errors.radio.message
              ? [{ message: errors.radio.message }]
              : undefined
          }
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioGroup<FormValues>
          required
          radioButtons={[
            { children: "Search", theme: "cyan", value: "search" },
            { children: "ISBN", theme: "cyan", value: "isbn" },
            { children: "CSV Import", theme: "cyan", value: "csv" },
          ]}
          name={"radio"}
          register={register}
          legend={`Choose how you'd like to add books`}
          hint={`Select in what way you'd like to add books`}
          size="large"
          errors={
            errors.radio && errors.radio.message
              ? [{ message: errors.radio.message }]
              : undefined
          }
        />
        <div className="mt-10 flex flex-col-reverse gap-y-4 md:flex-row md:gap-y-0 md:space-x-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.push("/dashboard")}
          >
            Return to dashboard
          </Button>
          <Button type="submit" disabled={!!errors.radio}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
});
