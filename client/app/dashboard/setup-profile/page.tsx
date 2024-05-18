"use client";

import { useGetCustomerSummary } from "@/hooks";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoading, data, mutate } = useGetCustomerSummary();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoading && data) {
      router.push("/dashbord");
    }
  }, [data]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
      Setup account
    </div>
  );
}
