import { ErrorSummary, PageTitle } from "@/components";
import { Button, Input } from "@jecfe/react-design-system";

import { useEffect, useMemo } from "react";
import { useFormContext, Validate } from "react-hook-form";

export type FormValues = {
  search: string;
};

type Props = {
  onSubmit: (data: FormValues) => void;
  backClick: () => void;
  hint: string;
  validate?: Record<string, Validate<string, FormValues>>;
};
export function SearchForBook({
  onSubmit,
  backClick,
  hint,
  validate = {},
}: Props) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useFormContext<FormValues>();
  const mappedErrors = useMemo(
    () =>
      errors.search && errors.search.message
        ? [{ message: errors.search.message }]
        : undefined,
    [errors],
  );

  useEffect(() => {
    console.log(mappedErrors);
  }, [errors]);
  return (
    <>
      <PageTitle>Search</PageTitle>

      {errors.search && <ErrorSummary errors={mappedErrors} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("search", {
            required: "You must give search criteria",
            validate: validate,
          })}
          legend="Search for a book by title or author"
          hint={hint}
          errors={mappedErrors}
        />
        <div className="mt-10 flex flex-col-reverse gap-y-4 md:flex-row md:gap-y-0 md:space-x-4">
          <Button type="button" variant="secondary" onClick={backClick}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Search
          </Button>
        </div>
      </form>
    </>
  );
}
