"use client";

import { ErrorSummary, PageTitle } from "@/components";
import { getApiClient } from "@/services";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Input } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormValues = {
  nickname: string;
};

const updateNickname = getApiClient()
  .path("/customer/update")
  .method("post")
  .create();

export default withPageAuthRequired(function Nickname({ user }) {
  const router = useRouter();

  const onSubmit = (data: FormValues) => {
    toast.promise(
      updateNickname({
        id: user?.sub as string,
        nickname: data.nickname,
      }),
      {
        loading: "Updating nickname",
        success: () => {
          router.push("/api/auth/logout");
          return "Nickname updated successfully";
        },
        error: () => {
          return "Something went wrong with updating your username, you will be able to update this later";
        },
      },
    );
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { nickname: user.nickname! },
  });

  return (
    <div className="flex flex-col">
      <div className="mb-6 w-fit">
        <Anchor href="/manage-user">← Manage account</Anchor>
      </div>

      <PageTitle>Edit nickname</PageTitle>

      <div className="mt-4 max-w-xl text-xl font-bold tracking-tight text-slate-400">
        Choose what you would like to be called. This can be changed again
        later. Note: you will be signed out after saving.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
        {errors.nickname && (
          <ErrorSummary
            errors={
              errors.nickname.message
                ? [{ message: errors.nickname.message }]
                : undefined
            }
          />
        )}
        <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <Input
            legend="Nickname"
            {...register("nickname", {
              required: { value: true, message: "A nickname is required" },
              maxLength: { value: 64, message: "Nickname is too long" },
            })}
            placeholder="Enter nickname..."
          />
        </div>
        <div className="mt-10 flex flex-col-reverse gap-y-4 md:flex-row md:gap-y-0 md:space-x-4">
          <Button
            type="button"
            size="large"
            variant="secondary"
            onClick={() => router.push("/manage-user")}
          >
            Back
          </Button>
          <Button
            size="large"
            type="submit"
            disabled={watch("nickname") === user.nickname}
          >
            Save nickname
          </Button>
        </div>
      </form>
    </div>
  );
});
