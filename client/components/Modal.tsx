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
          <div className="fixed left-1/2 top-1/2 z-50 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 scale-100 transform overflow-auto rounded-xl bg-slate-300 p-4 shadow-2xl md:left-0 md:top-0 md:h-1/2 md:w-1/2 md:translate-x-1/2 md:translate-y-1/2 md:scale-150 md:p-12">
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
