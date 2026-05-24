"use client";

import { PageTitle } from "@/components";
import { useSetupWizard } from "@/hooks";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { SetupModal } from "./SetupModal";
import { SetupProgress } from "./SetupProgress";

export default withPageAuthRequired(function SetupPath() {
  const { updateCustomer } = useSetupWizard();
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <SetupProgress currentStep={1} />
      <PageTitle>Set up your account</PageTitle>

      <div className="mt-4 max-w-xl text-xl font-bold tracking-tight text-slate-400">
        {`Welcome! Since this is your first time here, let's take a moment to get
        your account set up.`}
      </div>

      <div className="mt-10 flex flex-col gap-y-4">
        <Button
          size="large"
          onClick={() => {
            updateCustomer({
              type: "set-config-option",
              option: "express",
            });
            router.push("/setup/nickname");
          }}
        >
          Get started
        </Button>
        <div className="w-fit">
          <SetupModal />
        </div>
      </div>
    </div>
  );
});
