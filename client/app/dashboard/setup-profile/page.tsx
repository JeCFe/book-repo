"use client";

import { RadioButton } from "@/components";
import { useGetCustomerSummary } from "@/hooks";
import { Anchor, Button, Info } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  radio: string;
};

export default function Dashboard() {
  const { isLoading, data } = useGetCustomerSummary();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && data) {
      router.push("/dashboard");
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => console.log(data); //Can use this to form the reducer

  return (
    <div className="container flex min-h-screen w-full flex-col px-4 md:px-0 md:pt-0">
      <div className="pt-4 md:pt-20">
        <Anchor
          onClick={() => router.push("/")} //When backend work has been this should then open a model and allow user dets to be deleted from Auth0
          className="cursor-pointer pb-4"
        >
          Cancel
        </Anchor>
        <h1 className="flex flex-row text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
          Setup your account
        </h1>
        <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
          As this your first time we've seen you, lets run through some steps to
          get your account setup for the first time!
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
              hintClassName="max-w-sm md:max-w-lg"
              hint="The quickest way for you to get organising. We will setup your account using all our defaults - this included 3 default bookshelves for all your read books, currently reading, and wanting to read. You can add all your custom bookshelves and add books later."
            >
              Express
            </RadioButton>
            <RadioButton
              size="large"
              {...register("radio", {
                required: { value: true, message: "A selection is required" },
              })}
              value="express"
              hint="Want to control how we set your account up? This paths allows you to choose which defaults you want, add as many bookshelves you want, and even start adding books!"
              hintClassName="max-w-sm md:max-w-lg"
              theme="cyan"
            >
              Advanced
            </RadioButton>
          </div>
          <Button size="large" type="submit" className="my-20">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
