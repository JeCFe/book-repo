import { Book } from "@/types";
import { render, screen } from "@testing-library/react";
import { RenderBookGrid } from "./RenderBookGrid";

jest.mock("@/components", () => ({
  Picture: ({ title }: { title: string }) => <img alt={title} />,
}));

const mockBooks: Book[] = [
  {
    id: "1",
    order: 1,
    book: {
      isbn: "111",
      name: "Book One",
      picture: "/img/1.jpg",
      authors: ["Author A"],
      subjects: [],
      pageCount: 100,
    },
  },
  {
    id: "2",
    order: 2,
    book: {
      isbn: "222",
      name: "Book Two",
      picture: "/img/2.jpg",
      authors: ["Author B"],
      subjects: [],
      pageCount: 200,
    },
  },
];

describe("RenderBookGrid", () => {
  it("renders a picture for each book", () => {
    render(<RenderBookGrid books={mockBooks} />);
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("uses the book name as the image alt text", () => {
    render(<RenderBookGrid books={mockBooks} />);
    expect(screen.getByAltText("Book One")).toBeInTheDocument();
    expect(screen.getByAltText("Book Two")).toBeInTheDocument();
  });

  it("calls onClick with the correct book when clicked", () => {
    const onClick = jest.fn();
    render(<RenderBookGrid books={mockBooks} onClick={onClick} />);
    screen.getByAltText("Book One").closest("div")!.click();
    expect(onClick).toHaveBeenCalledWith(mockBooks[0]);
  });

  it("renders an empty grid when books is empty", () => {
    render(<RenderBookGrid books={[]} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
