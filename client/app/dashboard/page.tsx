"use client";

import { BookLogo } from "@/assets";
import { SideNav } from "@/components";
import { useGetCustomerSummary } from "@/hooks";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Anchor, Button, Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoading, data, error } = useGetCustomerSummary();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoading && !data) {
      router.push("/setup");
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
      <div>
        <div className="flex w-full">
          <SideNav>
            <div className="flex h-full flex-col divide-y divide-slate-500 py-2 pt-4">
              <div className="pointer-events-none flex flex-col items-center justify-center pb-4 pt-4">
                <BookLogo height="100" />
                <div className="text-lg font-bold tracking-tight text-slate-200">
                  The Book Repository
                </div>
              </div>
              <div className="flex w-full flex-grow flex-row overflow-y-auto px-2"></div>
              <div className="flex flex-row px-2 pt-2 text-center text-sm">
                <div className="flex items-center text-center text-slate-400">
                  {user?.nickname}
                </div>
                <div className="flex flex-grow" />
                <Anchor href="/api/auth/logout">Logout</Anchor>
              </div>
            </div>
          </SideNav>
          <div className="flex w-full flex-col py-24 pl-12 text-slate-500">
            test
          </div>
        </div>
      </div>
    );
  }
}
