import { ReactNode } from "react";

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="mb-8 flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
      {children}
    </h1>
  );
}
