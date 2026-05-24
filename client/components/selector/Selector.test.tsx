import { fireEvent, render, screen } from "@testing-library/react";
import { Selector } from "./Selector";

jest.mock("react-select", () => ({
  __esModule: true,
  default: ({
    placeholder,
    options,
    onChange,
    isDisabled,
  }: {
    placeholder: string;
    options: { value: string; label: string }[];
    onChange: (v: { value: string; label: string }) => void;
    isDisabled: boolean;
  }) => (
    <select
      aria-label="selector"
      disabled={isDisabled}
      onChange={(e) =>
        onChange({ value: e.target.value, label: e.target.value })
      }
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

describe("Selector", () => {
  const options = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("renders with the placeholder", () => {
    render(
      <Selector
        options={options}
        placeholder="Select..."
        onChange={undefined}
      />,
    );
    expect(screen.getByText("Select...")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(
      <Selector
        options={options}
        placeholder="Select..."
        onChange={undefined}
      />,
    );
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("shows 'Not available' placeholder when disabled", () => {
    render(
      <Selector
        options={options}
        placeholder="Select..."
        onChange={undefined}
        isDisabled
      />,
    );
    expect(screen.getByText("Not available")).toBeInTheDocument();
  });

  it("is disabled when isDisabled is true", () => {
    render(
      <Selector
        options={options}
        placeholder="Select..."
        onChange={undefined}
        isDisabled
      />,
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("calls onChange with the selected value", () => {
    const onChange = jest.fn();
    render(
      <Selector
        options={options}
        placeholder="Select..."
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "a" } });
    expect(onChange).toHaveBeenCalledWith({ value: "a", label: "a" });
  });
});
