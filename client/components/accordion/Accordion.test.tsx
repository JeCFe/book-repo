import { fireEvent, render, screen } from "@testing-library/react";
import { Accordion } from "./Accordion";

jest.mock("@/components", () => ({
  ManagedAccordion: ({
    title,
    children,
    isOpen,
    setIsOpen,
  }: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
  }) => (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  ),
}));

describe("Accordion", () => {
  it("renders the title", () => {
    render(<Accordion title="My Section"><p>Content</p></Accordion>);
    expect(screen.getByText("My Section")).toBeInTheDocument();
  });

  it("starts closed and does not render children", () => {
    render(<Accordion title="My Section"><p>Content</p></Accordion>);
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders children after toggling open", () => {
    render(<Accordion title="My Section"><p>Content</p></Accordion>);
    fireEvent.click(screen.getByText("My Section"));
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("hides children again after toggling closed", () => {
    render(<Accordion title="My Section"><p>Content</p></Accordion>);
    fireEvent.click(screen.getByText("My Section"));
    fireEvent.click(screen.getByText("My Section"));
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });
});
