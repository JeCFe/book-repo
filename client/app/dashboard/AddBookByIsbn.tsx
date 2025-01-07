import { ErrorSummary } from "@/components";
import { SetupBook } from "@/hooks";
import { Button, Input } from "@jecfe/react-design-system";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AddBookModal } from "../(add-book)/AddBookModal";

type FormValues = {
  search: string;
};

type Props = {
  addBook: (book: SetupBook) => Promise<void>;
  backClick: () => void;
  hint?: string;
};

export function AddBookByIsbn({ addBook, backClick, hint }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [passingIsbn, setPassingIsbn] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    setPassingIsbn(data.search);
    setOpen(true);
  };

  const mappedErrors = useMemo(
    () =>
      errors.search && errors.search.message
        ? [{ message: errors.search.message }]
        : undefined,
    [errors],
  );

  return (
    <>
      {errors.search && <ErrorSummary errors={mappedErrors} />}

      <AddBookModal
        isbn={passingIsbn as string}
        addBook={addBook}
        showModal={open}
        setShowModal={setOpen}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("search", {
            required: "You must give content to search",
          })}
          legend="Search for a book via ISBN"
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
