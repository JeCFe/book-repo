import { render, screen } from "@testing-library/react";
import { SummaryTable } from "./SummaryTable";

describe("SummaryTable", () => {
  const rows = [
    { title: "Author", content: "Jane Doe" },
    { title: "Year", content: "2023" },
  ];

  it("renders the table title", () => {
    render(<SummaryTable title="Book Details" rows={rows} />);
    expect(screen.getByText("Book Details")).toBeInTheDocument();
  });

  it("renders all row titles and content", () => {
    render(<SummaryTable title="Book Details" rows={rows} />);
    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
  });

  it("renders correctly with no rows", () => {
    render(<SummaryTable title="Empty Table" rows={[]} />);
    expect(screen.getByText("Empty Table")).toBeInTheDocument();
  });
});
