"use client";
import { BookLogo } from "@/assets";
import { useGetCustomerSummary } from "@/hooks";
import { Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoading, data } = useGetCustomerSummary();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && data) {
      router.push("/dashboard");
    }
  }, [data, isLoading, router]);

  if (isLoading || data) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
        <div className="flex items-center justify-center">
          <Spinner fast={isLoading} size="large" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen w-full flex-1 flex-col px-4 md:px-0 md:pt-0">
      <div className="pointer-events-none flex items-center justify-center pb-10 pt-4 md:absolute md:right-8 md:top-8 md:pb-0 md:pt-0">
        <BookLogo height="100" />
      </div>
      <div className="container mx-auto flex-1 pt-0 md:pt-20">{children}</div>
    </div>
  );
}
