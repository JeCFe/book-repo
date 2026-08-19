"use client";

import { ChooseFormValues, ChooseHowToAdd } from "@/app/(add-book)";
import { Breadcrumb } from "@/components";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

import { FormProvider, useForm } from "react-hook-form";

export default withPageAuthRequired(function AddBook() {
  const router = useRouter();

  const methods = useForm<ChooseFormValues>();

  const onSubmit = (data: ChooseFormValues) => {
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

      <FormProvider {...methods}>
        <ChooseHowToAdd onSubmit={onSubmit} />
      </FormProvider>
    </div>
  );
});
