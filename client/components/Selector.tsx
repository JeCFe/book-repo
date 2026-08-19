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
      className="text-black"
      isDisabled={isDisabled}
    />
  );
}
