"use client";

import { getApiClient } from "@/services";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Info } from "@jecfe/react-design-system";
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
        loading: "Upading nickname",
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
      <div className="flex flex-row space-x-2">
        <Anchor href="/manage-user" className="pb-6">{`< Manage User`}</Anchor>
      </div>

      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Enter desired nickname
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        What would you like to be called? This nickname can be changed later,
        and will affect any of our sibling services you may use.
      </div>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        After changing username you will be required to sign out.
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.nickname && (
          <div className="my-4 flex flex-col rounded-xl bg-slate-800/70 p-4 shadow-xl">
            <div className="flex flex-row items-center space-x-4">
              <Info className="h-10 w-10 fill-red-600" />
              <h2 className="text-2xl font-bold text-red-600">Important!</h2>
            </div>
            <div className="flex flex-row pl-14 text-lg text-slate-200">
              {errors.nickname.message}
            </div>
          </div>
        )}
        <div className="mt-10">
          <div className="mb-4 text-xl text-slate-300">Enter your nickname</div>
          <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <input
              {...register("nickname", {
                required: { value: true, message: "A nickanme is required" },
                maxLength: { value: 64, message: "Nickname is too long" },
              })}
              type="text"
              placeholder="Enter nickname..."
              className="flex w-full max-w-sm space-y-2 rounded-lg border border-black bg-slate-100 p-2.5 text-slate-900 md:max-w-xl"
            />
          </div>
        </div>
        <div className="mb-10 mt-20 flex flex-row space-x-6">
          <Button
            size="large"
            type="submit"
            disabled={watch("nickname") === user.nickname}
          >
            Update nickname
          </Button>
        </div>
      </form>
    </div>
  );
});
