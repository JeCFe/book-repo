import { Anchor, Button } from "@jecfe/react-design-system";
import React, { ReactNode } from "react";
import { Checkbox } from ".";

type Props = {
  children: ReactNode;
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function Modal({ children, isOpen, onClose, onConfirm }: Props) {
  return (
    <>
      {isOpen && (
        <>
          <div className="absolute left-0 top-0 z-40 h-full w-full bg-slate-900/80" />
          <div className="absolute left-0 top-0 z-50 h-1/2 w-1/2 translate-x-1/2 translate-y-1/2 scale-100 transform overflow-auto rounded-xl bg-slate-300 p-4 shadow-2xl md:scale-150 md:p-12">
            <div className="flex h-full w-full flex-col">
              {children}
              <div className="flex flex-grow" />
              <div className="flex flex-row items-center">
                <Anchor className="cursor-pointer" onClick={() => onClose()}>
                  Cancel
                </Anchor>
                <div className="flex flex-grow" />
                <Button onClick={() => onConfirm()} size="small">
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
