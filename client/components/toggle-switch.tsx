import { cva, cx } from "class-variance-authority";
import { useState } from "react";

const outterDiv = cva(
  "mx-3 flex h-7 w-14 cursor-pointer items-center rounded-full px-1 z-10 focus:outline-none",
  {
    variants: {
      toggled: {
        true: "bg-cyan-500",
        false: "bg-pink-300",
      },
    },
  },
);

const innerDiv = cva(
  "h-5 w-5 transform rounded-full bg-white shadow-md transition-transform",
  {
    variants: {
      toggled: {
        true: "translate-x-7",
        false: "translate-x-0",
      },
    },
  },
);

type Props = {
  checked: boolean;
  onClick: (toggle: boolean) => void;
  label?: string;
  className?: string;
};

export function ToggleSwitch({
  checked = false,
  onClick,
  label,
  className,
}: Props) {
  const [toggled, setToggled] = useState<boolean>(checked);
  const handleClick = () => {
    setToggled(!toggled);
    onClick(!toggled);
  };
  return (
    <div
      className={cx("w-max", className)}
      onClick={handleClick}
      role="switch"
      aria-label={label || "Toggle Switch"}
      tabIndex={0}
    >
      <div className={outterDiv({ toggled })}>
        <div className={innerDiv({ toggled })} />
      </div>
    </div>
  );
}
