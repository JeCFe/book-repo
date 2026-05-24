import { render, screen } from "@testing-library/react";
import { PageTitle } from "./PageTitle";

describe("PageTitle", () => {
  it("renders children inside an h1", () => {
    render(<PageTitle>My Title</PageTitle>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "My Title",
    );
  });

  it("renders ReactNode children", () => {
    render(
      <PageTitle>
        <span>Formatted Title</span>
      </PageTitle>,
    );
    expect(screen.getByText("Formatted Title")).toBeInTheDocument();
  });
});
