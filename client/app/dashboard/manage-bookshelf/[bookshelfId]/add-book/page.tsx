"use client";

import { RadioButton } from "@/components";
import { useBookWizard } from "@/hooks";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Info } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  radio: "isbn" | "search" | "csv";
};
type Props = {
  params: { bookshelfId: string };
};
export default withPageAuthRequired(function AddBook({ params }: Props) {
  const { updateBook } = useBookWizard();
  const router = useRouter();
  const { bookshelfId } = params;

  useEffect(() => {
    updateBook({ type: "default" });
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

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
      <div className="flex flex-row space-x-2 pb-6">
        <Anchor href="/dashboard">{`< Dashboard`}</Anchor>
        <Anchor
          href={`/dashboard/manage-bookshelf/${encodeURIComponent(bookshelfId)}`}
        >
          {"< Manage bookshelf"}
        </Anchor>

        <div className="text-slate-400 underline underline-offset-4">
          {"< Choose how to add"}
        </div>
      </div>

      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        {`Choose how you'd like to add books`}
      </h1>
      <div className="my-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`Select in what way you'd like to add books`}
      </div>

      {errors.radio && (
        <div className="flex w-full flex-col rounded-xl bg-slate-800/70 p-4 shadow-xl">
          <div className="flex flex-row items-center space-x-4">
            <Info className="h-10 w-10 fill-red-600" />
            <h2 className="text-2xl font-bold text-red-600">Important!</h2>
          </div>
          <div className="flex flex-row pl-14 text-lg text-slate-200">
            {errors.radio.message}
          </div>
        </div>
      )}

      <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12 pt-12">
            <RadioButton
              {...register("radio", { required: "A selection is required" })}
              value="search"
              theme="pink"
              size="large"
              hintClassName="max-w-sm md:max-w-lg"
              hint="Add books via seraching based on title and/or author"
            >
              Search
            </RadioButton>
            <RadioButton
              size="large"
              {...register("radio", {
                required: { value: true, message: "A selection is required" },
              })}
              value="isbn"
              hint="Add books via ISBN search"
              hintClassName="max-w-sm md:max-w-lg"
              theme="cyan"
            >
              ISBN
            </RadioButton>
            <RadioButton
              disabled
              size="large"
              {...register("radio", {
                required: { value: true, message: "A selection is required" },
              })}
              value="csv"
              hint="Add books via a CSV import"
              hintClassName="max-w-sm md:max-w-lg"
              theme="pink"
            >
              CSV Import
            </RadioButton>
          </div>
          <Button
            size="large"
            type="submit"
            className="mb-10 mt-20"
            disabled={!!errors.radio}
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
});
