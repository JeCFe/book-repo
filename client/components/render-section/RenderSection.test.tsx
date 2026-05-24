import { render, screen } from "@testing-library/react";
import { RenderSection } from "./RenderSection";

describe("RenderSection", () => {
  it("renders the title", () => {
    render(<RenderSection title="My Title">Body content</RenderSection>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders the body content", () => {
    render(<RenderSection title="My Title">Body content</RenderSection>);
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("renders ReactNode title and children", () => {
    render(
      <RenderSection title={<span>Rich Title</span>}>
        <p>Rich Body</p>
      </RenderSection>,
    );
    expect(screen.getByText("Rich Title")).toBeInTheDocument();
    expect(screen.getByText("Rich Body")).toBeInTheDocument();
  });
});
