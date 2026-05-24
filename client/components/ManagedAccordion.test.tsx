import { fireEvent, render, screen } from "@testing-library/react";
import { ManagedAccordion } from "./ManagedAccordion";

jest.mock("@jecfe/react-design-system", () => ({
  ArrowUp: () => <svg data-testid="arrow-icon" />,
}));

describe("ManagedAccordion", () => {
  it("renders the title", () => {
    render(
      <ManagedAccordion title="My Section" isOpen={false} setIsOpen={jest.fn()}>
        <p>Content</p>
      </ManagedAccordion>,
    );
    expect(screen.getByText("My Section")).toBeInTheDocument();
  });

  it("renders children in the DOM regardless of open state", () => {
    render(
      <ManagedAccordion title="My Section" isOpen={false} setIsOpen={jest.fn()}>
        <p>Hidden content</p>
      </ManagedAccordion>,
    );
    expect(screen.getByText("Hidden content")).toBeInTheDocument();
  });

  it("calls setIsOpen when the arrow is clicked", () => {
    const setIsOpen = jest.fn();
    render(
      <ManagedAccordion title="My Section" isOpen={false} setIsOpen={setIsOpen}>
        <p>Content</p>
      </ManagedAccordion>,
    );
    fireEvent.click(screen.getByTestId("arrow-icon"));
    expect(setIsOpen).toHaveBeenCalled();
  });
});
