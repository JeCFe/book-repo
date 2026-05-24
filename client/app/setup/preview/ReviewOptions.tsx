"use client";
import { Anchor } from "@jecfe/react-design-system";
import { ReactNode } from "react";

type Props = {
  href: string;
  title: string;
  children: ReactNode;
};

export function ReviewOption({ href, title, children }: Props) {
  return (
    <div className="max-w-lg rounded-lg border border-slate-700 px-4 py-4">
      <div className="flex flex-row items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {title}
        </span>
        <Anchor href={href}>Edit</Anchor>
      </div>
      <div className="mt-2 text-xl font-medium text-slate-200">{children}</div>
    </div>
  );
}
