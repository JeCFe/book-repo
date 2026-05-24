"use client";
import { Modal, PageTitle, SummaryTable } from "@/components";
import { useGetCustomerSummary } from "@/hooks";
import { getApiClient } from "@/services";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Checkbox } from "@jecfe/react-design-system";
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
    const dataObj: { auth0?: string; db?: string } = {};
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Are you sure?
        </h1>
        <p className="mt-2 max-w-sm text-base font-bold tracking-tight text-slate-600">
          This action is irreversible and will remove your Auth0 account and
          delete all data we hold for you.
        </p>
      </Modal>

      <div className="mb-6 w-fit">
        <Anchor href="/dashboard">← Back to dashboard</Anchor>
      </div>

      <PageTitle>{`Manage ${user.nickname}`}</PageTitle>
      <div className="mt-4 max-w-xl pb-10 text-xl font-bold tracking-tight text-slate-400">
        View and manage the data we hold about you.
      </div>

      <div className="py-4">
        <Button
          variant="primary"
          size="large"
          disabled={isDeleting}
          onClick={() => router.push("/manage-user/edit-nickname")}
        >
          Edit nickname
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
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="flex flex-col space-y-4">
          <legend className="text-xl text-slate-200">
            Choose what data you would want to download
          </legend>
          <Checkbox theme="dark" size="large" {...register("auth0")}>
            Authorisation data
          </Checkbox>
          <Checkbox theme="dark" size="large" {...register("db")}>
            Database data
          </Checkbox>
        </fieldset>
        <div>
          <Button
            type="submit"
            size="large"
            disabled={isDeleting || (!watch("auth0") && !watch("db"))}
          >
            Download
          </Button>
        </div>
      </form>

      <div className="my-8 border-t border-red-900/50" />

      <div className="pb-20">
        <h2 className="text-lg font-semibold text-red-400">Danger zone</h2>
        <p className="mt-1 max-w-xl text-sm text-slate-400">
          Permanently delete your account and all associated data. This cannot
          be undone.
        </p>
        <div className="mt-4">
          <Button
            variant="destructive"
            size="large"
            isLoading={isDeleting}
            onClick={() => setIsOpen(true)}
          >
            Forget me
          </Button>
        </div>
      </div>
    </>
  );
});
