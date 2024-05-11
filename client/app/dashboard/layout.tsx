"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Spinner } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  if (!user && !isLoading) {
    router.push(`/api/auth/login?returnTo=${encodeURIComponent("/dashboard")}`);
    return;
  }

  return <div>{children}</div>;
}
