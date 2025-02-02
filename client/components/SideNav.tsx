import { BookLogo, BookLogoCopy, Menu } from "@/assets";

import { cva } from "class-variance-authority";
import { ReactNode, useState } from "react";

const mobileNav = cva("sm:hidden ", {
  variants: {
    isOpen: {
      true: "fixed left-0 top-0 h-full w-full bg-slate-800",
      false: "hidden",
    },
  },
});

export function SideNav({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {/*MOBILE NAV*/}
      <div>
        <div
          className="group fixed left-5 top-5 z-10 cursor-pointer sm:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-12 w-12 fill-slate-200 group-hover:fill-slate-400" />
        </div>
        <div className={mobileNav({ isOpen })}>
          <div className="flex h-full flex-col divide-y divide-slate-500 py-2 pt-4">
            <div className="pointer-events-none flex flex-col items-center justify-center pb-4 pt-4">
              <BookLogoCopy height="100" />
              <div className="text-lg font-bold tracking-tight text-slate-200">
                The Book Repository
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>

      {/*DESKTOP NAV*/}
      <div className="sticky top-0 hidden h-screen w-96 flex-col divide-y divide-slate-500 bg-slate-800 py-2 pt-4 sm:flex">
        <div className="flex h-full flex-col divide-y divide-slate-500 pt-4">
          <div className="pointer-events-none flex flex-col items-center justify-center pb-4 pt-4">
            <BookLogo height="100" />
            <div className="text-lg font-bold tracking-tight text-slate-200">
              The Book Repository
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
