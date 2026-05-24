"use client";
import { PageTitle } from "@/components";
import { useGetCustomerSummary, useSetupWizard } from "@/hooks";
import { getApiClient } from "@/services";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SetupModal } from "../SetupModal";
import { SetupProgress } from "../SetupProgress";
import { ReviewOption } from "./ReviewOptions";

const setupCustomer = getApiClient()
  .path("/action/setup-customer")
  .method("post")
  .create();

const updateNickname = getApiClient()
  .path("/customer/update")
  .method("post")
  .create();

export default withPageAuthRequired(function Preview() {
  const { isComplete, nickname, includeDefaults } = useSetupWizard();
  const { mutate } = useGetCustomerSummary();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customerNickname, setCustomerNickname] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (nickname === undefined) {
      return;
    }
    setCustomerNickname(nickname);
  }, [nickname]);

  const router = useRouter();

  useEffect(() => {
    if (!isComplete) {
      router.push("/setup");
    }
  }, [isComplete, router]);

  const onContinue = async () => {
    setIsLoading(true);
    if (user?.nickname !== nickname) {
      await toast.promise(
        updateNickname({
          id: user?.sub as string,
          nickname: customerNickname,
        }),
        {
          loading: "Updating nickname",
          success: "Nickname updated successfully",
          error:
            "Something went wrong with updating your username, you will be able to update this later",
        },
      );
    }

    await toast.promise(
      setupCustomer({
        id: user!.sub as string,
        bookshelvesNames: [],
        isbns: [],
        includeDefaultBookshelves: includeDefaults,
      }),
      {
        loading: "Setting up account",
        success: () => {
          mutate();
          router.push("/dashboard");
          return "Account has been setup";
        },
        error:
          "Something went wrong with setting up your account. Please try again later, or contact an admin",
      },
    );

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col">
      <SetupProgress currentStep={3} />
      <PageTitle>Review your setup</PageTitle>

      <div className="mt-4 max-w-xl text-xl font-bold tracking-tight text-slate-400">
        Review the details below before we create your account. Everything can
        be changed later.
      </div>

      <div className="mt-10 flex flex-col space-y-4">
        <ReviewOption title="Nickname" href="/setup/nickname">
          {customerNickname}
        </ReviewOption>
      </div>
      <div className="mb-10 mt-16 flex flex-col gap-y-4">
        <div className="flex flex-row gap-x-4">
          <Button
            size="large"
            variant="secondary"
            onClick={() => router.push("/setup/nickname")}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button size="large" isLoading={isLoading} onClick={onContinue}>
            Confirm &amp; create account
          </Button>
        </div>
        <SetupModal />
      </div>
    </div>
  );
});
