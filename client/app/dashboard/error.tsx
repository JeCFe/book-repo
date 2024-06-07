"use client";
import { JecfeLogo } from "@/assets";
import { Anchor, Info } from "@jecfe/react-design-system";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-slate-200">
      <Info className="fill-red-600" width="96" height="96" />
      <h1 className="flex text-center text-7xl font-bold leading-tight md:text-8xl">
        Something went wrong!
      </h1>

      <p className="mt-4 flex max-w-sm text-center text-xl text-slate-400 md:max-w-full">
        We're sorry, an unknown error has occurred. If this persists please
        contact an admin.
      </p>
      <Anchor href="/" className="pt-8 text-2xl">
        Escape
      </Anchor>
      <div className="pointer-events-none my-12 flex items-center justify-center pb-12 md:absolute md:bottom-8 md:left-8 md:my-0 md:pb-0">
        <JecfeLogo height="54" />
      </div>
    </div>
  );
}
