"use client";

import { ChooseFormValues, ChooseHowToAdd } from "@/app/(add-book)";
import { Breadcrumb } from "@/components";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

type FormValues = {
  radio: "isbn" | "search" | "csv";
};
type Props = {
  params: { bookshelfId: string };
};
export default withPageAuthRequired(function AddBook({ params }: Props) {
  const router = useRouter();
  const { bookshelfId } = params;

  const methods = useForm<ChooseFormValues>();

  const onSubmit = (data: FormValues) => {
    switch (data.radio) {
      case "search":
        router.push(
          `/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}/add-book/search`,
        );
        return;

      case "isbn":
        router.push(
          `/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}/add-book/isbn`,
        );
        return;
    }
  };

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
          },
        ]}
      />
      <FormProvider {...methods}>
        <ChooseHowToAdd onSubmit={onSubmit} />
      </FormProvider>
    </div>
  );
});
