"use client";

import { useSetupWizard } from "@/hooks";

import { ErrorSummary, PageTitle } from "@/components";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button, Input } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SetupModal } from "../SetupModal";
import { SetupProgress } from "../SetupProgress";

type FormValues = {
  nickname: string;
};

export default withPageAuthRequired(function Nickname({ user }) {
  const { config, complete, nickname, updateCustomer } = useSetupWizard();

  const router = useRouter();

  useEffect(() => {
    if (config === undefined) {
      router.push("/setup");
    }
  }, [config, router]);

  const onSubmit = (data: FormValues) => {
    const updatedCustomer = updateCustomer({
      type: "set-nickname",
      nickname: data.nickname,
    });
    if (complete(updatedCustomer) || config === "express") {
      router.push("/setup/preview");
      return;
    }
    router.push("/setup/bookshelves");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { nickname: nickname ?? user?.nickname ?? "" },
  });

  return (
    <div className="flex flex-col">
      <SetupProgress currentStep={2} />
      <PageTitle>Choose a nickname</PageTitle>

      {errors.nickname && (
        <ErrorSummary
          errors={
            errors.nickname && errors.nickname.message
              ? [{ message: errors.nickname.message }]
              : undefined
          }
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
        <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <Input
            legend="Nickname"
            hint="This can be changed later and will affect sister services"
            {...register("nickname", {
              required: { value: true, message: "A nickname is required" },
              maxLength: { value: 64, message: "Nickname is too long" },
            })}
            placeholder="Enter nickname..."
          />
        </div>

        <div className="mt-10 flex flex-col gap-y-4">
          <div className="flex flex-col-reverse gap-y-4 md:flex-row md:gap-y-0 md:space-x-4">
            <Button
              type="button"
              size="large"
              variant="secondary"
              onClick={() => router.push("/setup")}
            >
              Back
            </Button>
            <Button size="large" type="submit">
              Continue
            </Button>
          </div>
          <SetupModal />
        </div>
      </form>
    </div>
  );
});
