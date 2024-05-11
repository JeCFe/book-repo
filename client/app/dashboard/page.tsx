"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  return (
    <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
      <h1 className="flex flex-row pt-0 text-center text-5xl font-bold tracking-tight text-slate-200 md:pt-20 md:text-8xl">
        Welcome {user?.name}
      </h1>
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
