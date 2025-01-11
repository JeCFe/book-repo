import { Modal } from "@/components";
import { getApiClient } from "@/services";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Anchor, Checkbox } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SetupModal() {
  const { user, isLoading } = useUser();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deleteAuth, setDeleteAuth] = useState<boolean>(true);
  const [actioning, setActioning] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const deleteCustomer = getApiClient()
    .path("/customer/delete")
    .method("post")
    .create();

  const onConfirm = async () => {
    if (user?.sub == undefined) {
      return;
    }
    setActioning(true);
    if (!deleteAuth) {
      setActioning(false);
      router.push("/");
      return;
    }

    await deleteCustomer({ id: user.sub })
      .then(() => {
        setActioning(false);
        setError(false);
        router.push("/api/auth/logout");
        return;
      })
      .catch(() => {
        setActioning(false);
        setError(true);
      });
  };
  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={onConfirm}
        error={
          error
            ? "Unable to confirm successful deletion of account. Please contact an admin."
            : undefined
        }
        actioning={actioning || isLoading}
        disabled={false}
      >
        <>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Are you sure?
          </h1>
          <h2 className="mt-1 max-w-sm text-base font-bold tracking-tight text-slate-600">
            {`You haven't yet setup your account, this action will take you back
            to the homepage and cancel any setup actions you have already taken.`}
          </h2>
          <div className="pt-8 md:pt-12">
            <Checkbox
              size="small"
              hint="Remove authentication account"
              theme="standard"
              checked={deleteAuth}
              onChange={(e) => setDeleteAuth(e.currentTarget.checked)}
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
