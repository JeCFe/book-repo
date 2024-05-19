import { Checkbox, Modal } from "@/components";
import { Anchor } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SetupModal() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  const onConfirm = () => {
    router.push("/");
  };
  return (
    <>
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
    </>
  );
}
