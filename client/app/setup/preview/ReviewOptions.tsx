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
    <div className="flex flex-col">
      <div className="mb-4 flex max-w-lg flex-row border-b border-b-slate-200 px-2 pb-4 text-xl text-slate-300">
        <div>{title}</div>
        <div className="flex flex-grow" />
        <Anchor href={href}>Edit</Anchor>
      </div>
      <div className="px-2 text-xl text-slate-200">{children}</div>
    </div>
  );
}
