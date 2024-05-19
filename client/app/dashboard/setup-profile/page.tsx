"use client";

import { Checkbox, Modal, RadioButton } from "@/components";
import { useGetCustomerSummary } from "@/hooks";
import { Anchor, Button, Info } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  radio: string;
};

export default function Dashboard() {
  const { isLoading, data } = useGetCustomerSummary();
  const [showModal, setShowModal] = useState<boolean>(false);
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

  const onSubmit = (data: FormValues) => console.log(data); //TODO: Can use this to form the reducer

  const onConfirm = () => {
    router.push("/"); //TODO: goal will be to eventuall call BE managment api if they selected to delete auth account
  };

  return (
    <div>
      {/* TODO: Can make this and the anchor into a share page comp */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={onConfirm}
      >
        <>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Are you sure?
          </h1>
          <h2 className="mt-1 max-w-sm text-base font-bold tracking-tight text-slate-600">
            You haven't yet setup your account, this action will take you back
            to the homepage and cancel any setup actions you have already taken.
          </h2>
          <div className="pt-8 md:pt-12">
            <Checkbox
              size="small"
              hint="Remove authetnication account"
              theme="standard"
            >
              Delete Auth0 account
            </Checkbox>
          </div>
        </>
      </Modal>
      <Anchor
        onClick={() => setShowModal(true)}
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
        <Button size="large" type="submit" className="mb-10 mt-20">
          Continue
        </Button>
      </form>
    </div>
  );
}
