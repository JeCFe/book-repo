import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { AccordionManager } from "./AccordionManager";

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
    setIsOpen: () => void;
  }) => (
    <div>
      <button onClick={setIsOpen} data-testid={`toggle-${title}`} aria-expanded={isOpen}>
        {title}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  ),
}));

describe("AccordionManager", () => {
  const accordions = [
    { title: "Section A", children: <p>Content A</p> },
    { title: "Section B", children: <p>Content B</p> },
  ];

  it("renders all accordion titles", () => {
    render(<AccordionManager accordions={accordions} />);
    expect(screen.getByText("Section A")).toBeInTheDocument();
    expect(screen.getByText("Section B")).toBeInTheDocument();
  });

  it("all accordions start closed", () => {
    render(<AccordionManager accordions={accordions} />);
    expect(screen.getByTestId("toggle-Section A")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("toggle-Section B")).toHaveAttribute("aria-expanded", "false");
  });

  it("opens an accordion when its toggle is clicked", () => {
    render(<AccordionManager accordions={accordions} />);
    fireEvent.click(screen.getByTestId("toggle-Section A"));
    expect(screen.getByTestId("toggle-Section A")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Content A")).toBeInTheDocument();
  });

  it("only one accordion is open at a time", () => {
    render(<AccordionManager accordions={accordions} />);
    fireEvent.click(screen.getByTestId("toggle-Section A"));
    fireEvent.click(screen.getByTestId("toggle-Section B"));

    expect(screen.getByTestId("toggle-Section A")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("toggle-Section B")).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByText("Content A")).not.toBeInTheDocument();
    expect(screen.getByText("Content B")).toBeInTheDocument();
  });

  it("closes an open accordion when clicked again", () => {
    render(<AccordionManager accordions={accordions} />);
    fireEvent.click(screen.getByTestId("toggle-Section A"));
    fireEvent.click(screen.getByTestId("toggle-Section A"));

    expect(screen.getByTestId("toggle-Section A")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Content A")).not.toBeInTheDocument();
  });
});
