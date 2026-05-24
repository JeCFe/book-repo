import { fireEvent, render, screen } from "@testing-library/react";
import { LinkButton } from "./LinkButton";

jest.mock("@jecfe/react-design-system", () => ({
  anchorCva: () => "anchor-class",
}));

describe("LinkButton", () => {
  it("renders children", () => {
    render(<LinkButton>Click me</LinkButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders as a button element", () => {
    render(<LinkButton>Click me</LinkButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<LinkButton onClick={onClick}>Click me</LinkButton>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });

  it("is disabled when the disabled prop is set", () => {
    render(<LinkButton disabled>Click me</LinkButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
