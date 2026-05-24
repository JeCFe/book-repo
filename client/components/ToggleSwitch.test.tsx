import { fireEvent, render, screen } from "@testing-library/react";
import { ToggleSwitch } from "./ToggleSwitch";

describe("ToggleSwitch", () => {
  it("renders with default aria-label", () => {
    render(<ToggleSwitch onClick={jest.fn()} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-label", "Toggle Switch");
  });

  it("renders with a custom label", () => {
    render(<ToggleSwitch onClick={jest.fn()} label="Dark mode" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-label", "Dark mode");
  });

  it("shows toggleOffText when not toggled", () => {
    render(<ToggleSwitch onClick={jest.fn()} toggleOffText="Off" toogleOnText="On" />);
    expect(screen.getByText("Off")).toBeInTheDocument();
    expect(screen.queryByText("On")).not.toBeInTheDocument();
  });

  it("shows toogleOnText after clicking", () => {
    render(<ToggleSwitch onClick={jest.fn()} toggleOffText="Off" toogleOnText="On" />);
    fireEvent.click(screen.getByRole("switch"));
    expect(screen.getByText("On")).toBeInTheDocument();
    expect(screen.queryByText("Off")).not.toBeInTheDocument();
  });

  it("calls onClick with true on first click", () => {
    const onClick = jest.fn();
    render(<ToggleSwitch onClick={onClick} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onClick).toHaveBeenCalledWith(true);
  });

  it("calls onClick with false when toggled off after being on", () => {
    const onClick = jest.fn();
    render(<ToggleSwitch onClick={onClick} />);
    fireEvent.click(screen.getByRole("switch"));
    fireEvent.click(screen.getByRole("switch"));
    expect(onClick).toHaveBeenLastCalledWith(false);
  });

  it("starts toggled on when checked prop is true", () => {
    render(
      <ToggleSwitch onClick={jest.fn()} checked={true} toggleOffText="Off" toogleOnText="On" />,
    );
    expect(screen.getByText("On")).toBeInTheDocument();
  });
});
