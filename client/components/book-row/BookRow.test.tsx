import { fireEvent, render, screen } from "@testing-library/react";
import { BookRow } from "./BookRow";
import { Works } from "@/hooks";

jest.mock("@/app/(add-book)", () => ({
  AddBookModal: ({
    showModal,
    isbn,
  }: {
    showModal: boolean;
    isbn: string;
  }) =>
    showModal ? <div data-testid="add-book-modal">Modal for {isbn}</div> : null,
}));

jest.mock("@/components", () => ({
  Selector: ({
    onChange,
    options,
  }: {
    onChange: (v: { value: string } | null) => void;
    options: { value: string; label: string }[];
  }) => (
    <select
      onChange={(e) => onChange({ value: e.target.value })}
      aria-label="isbn-selector"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("@jecfe/react-design-system", () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

const mockWork: Works = {
  key: "work-1",
  title: "Test Book",
  author_name: ["Test Author"],
  editions: {
    numFound: 1,
    start: 0,
    numFoundExact: true,
    docs: [
      {
        key: "edition-1",
        title: "Test Book",
        isbn: ["9780000000001", "9780000000002"],
      },
    ],
  },
};

describe("BookRow", () => {
  it("renders the book title", () => {
    render(
      <table>
        <tbody>
          <BookRow work={mockWork} index={1} />
        </tbody>
      </table>,
    );
    expect(screen.getByText("Test Book")).toBeInTheDocument();
  });

  it("renders the author name", () => {
    render(
      <table>
        <tbody>
          <BookRow work={mockWork} index={1} />
        </tbody>
      </table>,
    );
    expect(screen.getByText("Test Author")).toBeInTheDocument();
  });

  it("renders an isbn selector for the edition", () => {
    render(
      <table>
        <tbody>
          <BookRow work={mockWork} index={1} />
        </tbody>
      </table>,
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("View book button is disabled before an isbn is selected", () => {
    render(
      <table>
        <tbody>
          <BookRow work={mockWork} index={1} />
        </tbody>
      </table>,
    );
    expect(screen.getByText("View book")).toBeDisabled();
  });

  it("opens the modal when View book is clicked after selecting an isbn", () => {
    render(
      <table>
        <tbody>
          <BookRow work={mockWork} index={1} />
        </tbody>
      </table>,
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "9780000000001" },
    });
    fireEvent.click(screen.getByText("View book"));
    expect(screen.getByTestId("add-book-modal")).toBeInTheDocument();
  });
});
