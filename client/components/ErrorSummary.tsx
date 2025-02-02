import { ErrorMessage, FieldError, Info } from "@jecfe/react-design-system";
import {} from "react-hook-form";

type Props = {
  errors: FieldError[] | undefined;
};

export function ErrorSummary({ errors }: Props) {
  return (
    <div className="mb-4 flex w-full flex-col rounded-xl bg-slate-800/70 p-4 shadow-xl">
      <div className="flex flex-row items-center space-x-4">
        <Info className="h-10 w-10 fill-red-600" />
        <h2 className="text-2xl font-bold text-red-600">Important!</h2>
      </div>
      <div className="pl-14">
        <ErrorMessage errors={errors} />
      </div>
    </div>
  );
}
