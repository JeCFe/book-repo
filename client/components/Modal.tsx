import { Anchor, Button } from "@jecfe/react-design-system";
import React, { ReactNode } from "react";
import { Checkbox } from ".";

type Props = {
  children: ReactNode;
  isOpen?: boolean;
  actioning: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: () => void;
  disabled: boolean;
};

export function Modal({
  children,
  isOpen,
  onClose,
  onConfirm,
  actioning,
  error,
  disabled,
}: Props) {
  return (
    <>
      {isOpen && (
        <>
          <div className="absolute left-0 top-0 z-40 h-full w-full bg-slate-900/80" />
          <div className="absolute left-0 top-0 z-50 h-1/2 w-1/2 translate-x-1/2 translate-y-1/2 scale-100 transform overflow-auto rounded-xl bg-slate-300 p-4 shadow-2xl md:scale-150 md:p-12">
            <div className="flex h-full w-full flex-col">
              {children}
              <div className="flex flex-grow" />
              {error && (
                <div className="flex pb-4 text-sm text-red-600">{error}</div>
              )}
              <div className="flex flex-row items-center pb-2">
                <Anchor
                  className="cursor-pointer"
                  onClick={() => onClose()}
                  aria-disabled={actioning}
                >
                  Cancel
                </Anchor>
                <div className="flex flex-grow" />
                <Button
                  onClick={() => onConfirm()}
                  size="small"
                  isLoading={actioning}
                  disabled={disabled}
                >
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
