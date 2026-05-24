import { render, screen } from "@testing-library/react";
import { RenderBookTable } from "./RenderBookTable";
import { Book } from "@/types";

jest.mock("@/hooks", () => ({
  useGetCustomerBooks: () => ({ mutate: jest.fn() }),
}));

jest.mock("@/services", () => ({
  updateRanking: jest.fn(),
}));

jest.mock("@/components", () => ({
  RenderStar: () => <div data-testid="render-star" />,
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { promise: jest.fn() },
}));

jest.mock("@jecfe/react-design-system", () => ({
  Anchor: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  Table: ({ children }: { children: React.ReactNode }) => (
    <table>{children}</table>
  ),
}));

const mockBooks: Book[] = [
  {
    id: "book-1",
    order: 1,
    ranking: 4,
    book: {
      isbn: "9780000000001",
      name: "First Book",
      authors: ["Author One"],
      subjects: [],
      pageCount: 300,
    },
  },
  {
    id: "book-2",
    order: 2,
    book: {
      isbn: "9780000000002",
      name: "Second Book",
      authors: ["Author Two"],
      subjects: [],
      pageCount: 150,
    },
  },
];

describe("RenderBookTable", () => {
  const defaultProps = {
    books: mockBooks,
    bookHref: "/customer/user1/book",
    userId: "user1",
    deleteBook: jest.fn(),
  };

  it("renders a row for each book", () => {
    render(<RenderBookTable {...defaultProps} />);
    expect(screen.getByText("First Book")).toBeInTheDocument();
    expect(screen.getByText("Second Book")).toBeInTheDocument();
  });

  it("renders the book's authors", () => {
    render(<RenderBookTable {...defaultProps} />);
    expect(screen.getByText("Author One")).toBeInTheDocument();
  });

  it("renders a link to each book detail page", () => {
    render(<RenderBookTable {...defaultProps} />);
    expect(screen.getByRole("link", { name: "First Book" })).toHaveAttribute(
      "href",
      "/customer/user1/book/book-1",
    );
  });

  it("renders a RenderStar for each book", () => {
    render(<RenderBookTable {...defaultProps} />);
    expect(screen.getAllByTestId("render-star")).toHaveLength(mockBooks.length);
  });

  it("calls deleteBook with isbn and name when Delete is clicked", () => {
    const deleteBook = jest.fn();
    render(<RenderBookTable {...defaultProps} deleteBook={deleteBook} />);
    screen.getAllByText("Delete")[0].click();
    expect(deleteBook).toHaveBeenCalledWith("9780000000001", "First Book");
  });
});
