"use client";

import { useGetCustomerSummary } from "@/hooks";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoading, data, error } = useGetCustomerSummary();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoading && !data) {
      router.push("/dashboard/setup");
    }
  }, [data, error]);

  if (isLoading && !data) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
        <div className="flex items-center justify-center">
          <Spinner fast={isLoading} size="large" />
        </div>
      </div>
    );
  }

  if (!isLoading && data) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
        <h1 className="flex flex-row pt-0 text-center text-5xl font-bold tracking-tight text-slate-200 md:pt-20 md:text-8xl">
          Welcome
        </h1>
        <div className="mt-4 flex max-w-sm flex-row text-center text-xl font-bold tracking-tight text-slate-400 md:max-w-full md:text-3xl">
          {user?.nickname}
        </div>
        <Button
          onClick={() => {
            router.push("/api/auth/logout");
          }}
          variant="secondary"
          size="large"
          className="my-12"
        >
          Logout
        </Button>
      </div>
    );
  }
}
