"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  if (!user && !isLoading) {
    router.push(`/api/auth/login?returnTo=${encodeURIComponent("/dashboard")}`);
    return;
  }

  return <div>{children}</div>;
}
