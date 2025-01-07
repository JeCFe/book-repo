"use client";

import { PageTitle } from "@/components";
import { useSetupWizard } from "@/hooks";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { SetupModal } from "./SetupModal";

export default withPageAuthRequired(function SetupPath() {
  const { updateCustomer } = useSetupWizard();
  const router = useRouter();

  return (
    <div>
      <SetupModal />
      <PageTitle>Setup your account</PageTitle>

      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`As this your first time we've seen you, lets run through some steps to
        get your account setup for the first time!`}
      </div>

      <Button
        onClick={() => {
          updateCustomer({
            type: "set-config-option",
            option: "express",
          });
          router.push("/setup/nickname");
        }}
      >
        Continue
      </Button>
    </div>
  );
});
