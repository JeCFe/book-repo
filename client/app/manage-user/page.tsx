"use client";
import { Checkbox, SummaryTable } from "@/components";
import { getApiClient } from "@/services";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormValues = {
  download: string;
};

const deleteCustomer = getApiClient()
  .path("/customer/delete")
  .method("post")
  .create();
const forgetCustomer = getApiClient()
  .path("/action/forget-me")
  .method("post")
  .create();

export default withPageAuthRequired(function ManageUser({ user }) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();
  const { handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    // Do stuff here
  };

  const forgetMe = async () => {
    await toast.promise(forgetCustomer({ id: user.sub! }), {
      loading: "Forgetting you",
      success: "You are forgotten",
      error: "There was an error forgetting you, contact an admin.",
    });
    await toast.promise(deleteCustomer({ id: user.sub! }), {
      loading: "Deleting auth0 account",
      success: "Auth0 account deleted",
      error: "There was an error deleting auth0 account, contact an admin.",
    });
    router.push("/api/auth/logout");
    setIsDeleting(false);
  };
  return (
    <>
      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        {`Manage ${user.nickname}`}
      </h1>
      <div className="mt-4 flex max-w-sm flex-row pb-10 text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`Here you can view and manage the customer details we have about you. Both authentication account detail and details held in our databases.`}
      </div>

      <div className="flex max-w-3xl flex-row  space-x-4 py-4">
        <Button variant="primary" size="large" disabled={isDeleting}>
          Edit nickname
        </Button>
        <div className="flex flex-grow" />
        <Button
          variant="destructive"
          size="large"
          isLoading={isDeleting}
          onClick={() => {
            setIsDeleting(true);
            forgetMe();
          }}
        >
          Forget me
        </Button>
      </div>
      <SummaryTable
        title="Authorisation details we know about you:"
        rows={[
          {
            title: "Nickname",
            content: user.nickname ?? "Missing data",
          },
          {
            title: "Email",
            content: user.email ?? "Missing data",
          },
          {
            title: "User Id",
            content: user.sub ?? "Missing data",
          },
          {
            title: "Last updated",
            content: new Date(user.updated_at!).toDateString(),
          },
        ]}
      />
      <form
        className="flex flex-col space-y-4 py-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <legend className="text-xl text-slate-200">
          Choose what data you would want to download
        </legend>
        <Checkbox theme="dark" size="large">
          Authorisation data
        </Checkbox>
        <Checkbox theme="dark" size="large">
          Database data
        </Checkbox>

        <Button type="submit" size="large" disabled={isDeleting}>
          Download
        </Button>
      </form>

      <div className="flex w-fit flex-col space-y-2 pb-20 text-lg">
        <Anchor aria-disabled={isDeleting} href="/dashboard">
          Go to Dashboard
        </Anchor>
        <Anchor aria-disabled={isDeleting} href="/">
          Go to Home
        </Anchor>
      </div>
    </>
  );
});
