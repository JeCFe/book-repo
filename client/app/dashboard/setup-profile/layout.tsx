"use client";
import { Anchor } from "@jecfe/react-design-system";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="container flex min-h-screen w-full flex-col px-4 md:px-0 md:pt-0 ">
      <div className="pt-0 md:pt-20">
        <Anchor
          onClick={() => router.push("/")} //When backend work has been this should then open a model and allow user dets to be deleted from Auth0
          className="cursor-pointer pb-4"
        >
          Cancel
        </Anchor>
        {children}
      </div>
    </div>
  );
}
