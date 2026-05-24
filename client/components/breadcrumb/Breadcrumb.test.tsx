import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "./Breadcrumb";

jest.mock("@jecfe/react-design-system", () => ({
  Anchor: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Breadcrumb", () => {
  it("renders a crumb with href as a link", () => {
    render(<Breadcrumb crumbs={[{ display: "Home", href: "/" }]} />);
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });

  it("renders the display text in the link", () => {
    render(<Breadcrumb crumbs={[{ display: "Home", href: "/" }]} />);
    expect(screen.getByRole("link")).toHaveTextContent("< Home");
  });

  it("renders a crumb without href as a span with fallback text", () => {
    render(<Breadcrumb crumbs={[{ display: "Current" }]} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("< Choose how to add")).toBeInTheDocument();
  });

  it("renders multiple crumbs", () => {
    render(
      <Breadcrumb
        crumbs={[
          { display: "Home", href: "/" },
          { display: "Books", href: "/books" },
          { display: "Current" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
