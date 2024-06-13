"use client";
import { Checkbox, Modal, SummaryTable } from "@/components";
import { useGetCustomerSummary } from "@/hooks";
import { getApiClient } from "@/services";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormValues = {
  auth0: string;
  db: string;
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
  const { data: customerData } = useGetCustomerSummary();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const { handleSubmit, register, watch } = useForm<FormValues>();

  const downloadJSON = (jsonString: string, filename: string) => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  };

  const onSubmit = (data: FormValues) => {
    if (!data.auth0 && !data.db) {
      return;
    }
    var dataObj: { auth0?: string; db?: string } = {};
    if (data.auth0) {
      dataObj.auth0 = JSON.stringify(user);
    }
    if (data.db && customerData) {
      dataObj.db = JSON.stringify(customerData);
    }
    downloadJSON(JSON.stringify(dataObj), `${user.nickname}-data`);
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
      <Modal
        isOpen={isOpen}
        actioning={isDeleting}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          setIsDeleting(true);
          forgetMe();
        }}
        disabled={isDeleting}
      >
        <div className="flex flex-col items-center justify-center p-8 text-center align-middle">
          <h1 className="flex flex-col text-center text-5xl font-bold tracking-tight text-slate-700">
            Are you sure?
          </h1>
          <div className="max-w-sm pt-10 text-xl tracking-tight text-slate-500">
            This action is non reversible and will remove your Auth0 account and
            delete any data we hold for you in our databases.
          </div>
        </div>
      </Modal>
      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        {`Manage ${user.nickname}`}
      </h1>
      <div className="mt-4 flex max-w-sm flex-row pb-10 text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`Here you can view and manage the customer details we have about you. Both authentication account detail and details held in our databases.`}
      </div>

      <div className="flex max-w-3xl flex-row  space-x-4 py-4">
        <Button
          variant="primary"
          size="large"
          disabled={isDeleting}
          onClick={() => router.push("/manage-user/edit-nickname")}
        >
          Edit nickname
        </Button>
        <div className="flex flex-grow" />
        <Button
          variant="destructive"
          size="large"
          isLoading={isDeleting}
          onClick={() => {
            setIsOpen(true);
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
        <Checkbox theme="dark" size="large" {...register("auth0")}>
          Authorisation data
        </Checkbox>
        <Checkbox theme="dark" size="large" {...register("db")}>
          Database data
        </Checkbox>

        <Button
          type="submit"
          size="large"
          disabled={isDeleting || (!watch("auth0") && !watch("db"))}
        >
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
