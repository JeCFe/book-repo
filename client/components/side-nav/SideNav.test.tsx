import { render, screen } from "@testing-library/react";
import { SideNav } from "./SideNav";

jest.mock("@/assets", () => ({
  BookLogo: ({ height }: { height: string }) => (
    <svg data-testid="book-logo" height={height} />
  ),
  BookLogoCopy: ({ height }: { height: string }) => (
    <svg data-testid="book-logo-copy" height={height} />
  ),
  Menu: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="menu-icon" {...props} />
  ),
}));

describe("SideNav", () => {
  it("renders children in both mobile and desktop nav", () => {
    render(
      <SideNav>
        <a href="/books">Books</a>
      </SideNav>,
    );
    expect(screen.getAllByText("Books")).toHaveLength(2);
  });

  it("renders The Book Repository branding", () => {
    render(
      <SideNav>
        <span>Item</span>
      </SideNav>,
    );
    expect(screen.getAllByText("The Book Repository")).toHaveLength(2);
  });

  it("renders the menu icon for mobile navigation", () => {
    render(
      <SideNav>
        <span>Item</span>
      </SideNav>,
    );
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
  });
});
