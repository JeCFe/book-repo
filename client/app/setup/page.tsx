"use client";

import { Config, useSetupWizard } from "@/hooks";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button, Info, RadioButton } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { SetupModal } from "./SetupModal";

type FormValues = {
  radio: Config;
};

export default withPageAuthRequired(function SetupPath() {
  const { config, complete, updateCustomer } = useSetupWizard();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { radio: config } });

  const onSubmit = (data: FormValues) => {
    const updatedCustomer = updateCustomer({
      type: "set-config-option",
      option: data.radio,
    });
    if (complete(updatedCustomer)) {
      router.push("/setup/preview");
      return;
    }
    router.push("/setup/nickname");
  };

  return (
    <div>
      <SetupModal />
      <h1 className="flex flex-row text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Setup your account
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`As this your first time we've seen you, lets run through some steps to
        get your account setup for the first time!`}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.radio && (
          <div className="my-4 flex flex-col rounded-xl bg-slate-800/70 p-4 shadow-xl">
            <div className="flex flex-row items-center space-x-4">
              <Info className="h-10 w-10 fill-red-600" />
              <h2 className="text-2xl font-bold text-red-600">Important!</h2>
            </div>
            <div className="flex flex-row pl-14 text-lg text-slate-200">
              {errors.radio.message}
            </div>
          </div>
        )}
        <div className="space-y-12 pt-12">
          <RadioButton
            {...register("radio", { required: "A selection is required" })}
            value="express"
            theme="pink"
            size="large"
          >
            Express
          </RadioButton>
          <RadioButton
            size="large"
            {...register("radio", {
              required: { value: true, message: "A selection is required" },
            })}
            value="advanced"
            theme="cyan"
          >
            Advanced
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
  );
});
