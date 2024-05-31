"use client";
import { BookLogo } from "@/assets";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Anchor } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  if (!user && !isLoading) {
    router.push(`/api/auth/login?returnTo=${encodeURIComponent("/dashboard")}`);
    return;
  }
  return (
    <div className="flex min-h-screen w-full flex-1 flex-col px-4 md:px-0 md:pt-0">
      <div className="pointer-events-none flex items-center justify-center pb-10 pt-4 md:absolute md:right-8 md:top-8 md:pb-0 md:pt-0">
        <BookLogo height="100" />
      </div>

      <div className="container mx-auto flex-1 pt-0 md:pt-20">
        <Anchor href="/dashboard" className="pb-6">{`< Dashboard`}</Anchor>
        {children}
      </div>
    </div>
  );
}
