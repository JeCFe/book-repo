import { ErrorSummary, PageTitle } from "@/components";
import { Button, RadioGroup } from "@jecfe/react-design-system";
import router from "next/router";
import { useFormContext } from "react-hook-form";

export type ChooseFormValues = {
  radio: "isbn" | "search" | "csv";
};

export function ChooseHowToAdd({
  onSubmit,
}: {
  onSubmit: (data: ChooseFormValues) => void;
}) {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useFormContext<ChooseFormValues>();
  return (
    <>
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
        <RadioGroup<ChooseFormValues>
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
    </>
  );
}
