"use client";
import { BookLogo, JecfeLogo } from "@/assets";
import { Anchor, Button } from "@jecfe/react-design-system";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="pointer-events-none absolute right-8 top-8">
        <BookLogo height="100" />
      </div>
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <h1 className="flex flex-row text-8xl font-bold tracking-tight text-slate-200">
          The Book Repository
        </h1>
        <div className="mt-3 flex flex-row text-4xl font-medium tracking-tight text-slate-400">
          Your tool to store, manage, and view your books.
        </div>
        <Anchor href="/api/auth/login" className="flex flex-row pt-40">
          Sign Up!
        </Anchor>
      </div>
      <div className="pointer-events-none absolute bottom-8 left-8">
        <JecfeLogo height="54" />
      </div>
    </div>
  );
}
