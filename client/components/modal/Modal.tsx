import { Anchor, Button } from "@jecfe/react-design-system";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isOpen?: boolean;
  actioning: boolean;
  error?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  disabled: boolean;
  confirmText?: string;
};
export function Modal({
  children,
  isOpen,
  onClose = () => {},
  onConfirm,
  actioning,
  error,
  disabled,
  confirmText = "Confirm",
}: Props) {
  return (
    <>
      {isOpen && (
        <>
          <div className="fixed left-0 top-0 z-40 h-full w-full bg-slate-900/80" />
          <div className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-11/12 max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-xl bg-slate-300 p-6 shadow-2xl md:p-12">
            <div className="flex w-full flex-col">
              {children}
              <div className="mt-8 border-t border-slate-400" />
              {error && (
                <div className="flex pb-4 pt-2 text-sm text-red-600">
                  {error}
                </div>
              )}
              <div className="mt-4 flex flex-row items-center pb-2">
                <Anchor
                  className="cursor-pointer"
                  onClick={() => onClose()}
                  aria-disabled={actioning}
                >
                  {onConfirm ? "Cancel" : "Close"}
                </Anchor>
                <div className="flex flex-grow" />
                {onConfirm && (
                  <Button
                    onClick={() => onConfirm()}
                    size="small"
                    isLoading={actioning}
                    disabled={disabled}
                  >
                    {confirmText}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
