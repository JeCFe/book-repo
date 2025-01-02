import Select, { ActionMeta, SingleValue } from "react-select";

export function Selector({
  options,
  placeholder,
  onChange,
  isDisabled = false,
}: {
  isDisabled?: boolean;
  options: { value: string; label: string }[];
  placeholder: string;
  onChange:
    | ((
        newValue: SingleValue<{
          value: string;
          label: string;
        }>,
        actionMeta: ActionMeta<{
          value: string;
          label: string;
        }>,
      ) => void)
    | undefined;
}) {
  return (
    <Select
      options={options}
      placeholder={isDisabled ? "Not available" : placeholder}
      onChange={onChange}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: "#0e7490",
          primary25: "#a5f3fc",
          primary50: "#cffafe",
          neutral0: "#e2e8f0", //background
          neutral20: isDisabled ? "#e2e8f0" : "black", // lines
          neutral40: "#475569", //arrow hover
          neutral50: "black", //placeholder
          neutral80: "black", //text colour?
          neutral5: "#e2e8f0", //disabled
        },
      })}
      isDisabled={isDisabled}
    />
  );
}
