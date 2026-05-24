import { Fragment } from "react";

const STEPS = ["Welcome", "Nickname", "Review"];

type Props = {
  currentStep: number;
};

export function SetupProgress({ currentStep }: Props) {
  return (
    <div className="mb-6 flex items-start">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  isCompleted
                    ? "bg-slate-400 text-slate-900"
                    : isCurrent
                      ? "bg-slate-200 text-slate-900"
                      : "border-2 border-slate-600 text-slate-500"
                }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCurrent
                    ? "text-slate-300"
                    : isCompleted
                      ? "text-slate-400"
                      : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="flex h-10 w-16 shrink-0 items-center sm:w-24">
                <div
                  className={`h-px w-full ${isCompleted ? "bg-slate-400" : "bg-slate-700"}`}
                />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
