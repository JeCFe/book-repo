import { render, screen } from "@testing-library/react";
import { RadioButton } from "./RadioButton";

describe("RadioButton", () => {
  it("renders a radio input", () => {
    render(<RadioButton />);
    expect(screen.getByRole("radio")).toBeInTheDocument();
  });

  it("renders children as label text", () => {
    render(<RadioButton>Option A</RadioButton>);
    expect(screen.getByText("Option A")).toBeInTheDocument();
  });

  it("renders a hint when provided", () => {
    render(<RadioButton hint="Helpful hint">Option A</RadioButton>);
    expect(screen.getByText("Helpful hint")).toBeInTheDocument();
  });

  it("does not render a hint element when hint is not provided", () => {
    render(<RadioButton>Option A</RadioButton>);
    expect(screen.queryByText("Helpful hint")).not.toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(<RadioButton disabled>Option A</RadioButton>);
    expect(screen.getByRole("radio")).toBeDisabled();
  });

  it("forwards extra input attributes", () => {
    render(<RadioButton name="group" value="a">Option A</RadioButton>);
    expect(screen.getByRole("radio")).toHaveAttribute("name", "group");
    expect(screen.getByRole("radio")).toHaveAttribute("value", "a");
  });
});
