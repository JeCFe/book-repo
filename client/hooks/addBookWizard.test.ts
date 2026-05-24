import { act, renderHook } from "@testing-library/react";
import { useBookWizard } from "./addBookWizard";

describe("useBookWizard", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("starts with no books", () => {
    const { result } = renderHook(() => useBookWizard());
    expect(result.current.books).toBeUndefined();
  });

  it("add-books adds a book to the list", () => {
    const { result } = renderHook(() => useBookWizard());

    act(() => {
      result.current.updateBook({
        type: "add-books",
        setupBook: { isbn: "9780141439518", name: "Pride and Prejudice" },
      });
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books?.[0].isbn).toBe("9780141439518");
  });

  it("add-books accumulates multiple books", () => {
    const { result } = renderHook(() => useBookWizard());

    act(() => {
      result.current.updateBook({
        type: "add-books",
        setupBook: { isbn: "111", name: "Book One" },
      });
    });
    act(() => {
      result.current.updateBook({
        type: "add-books",
        setupBook: { isbn: "222", name: "Book Two" },
      });
    });

    expect(result.current.books).toHaveLength(2);
  });

  it("remove-book removes the book with the matching isbn", () => {
    const { result } = renderHook(() => useBookWizard());

    act(() => {
      result.current.updateBook({
        type: "add-books",
        setupBook: { isbn: "111", name: "Book One" },
      });
    });
    act(() => {
      result.current.updateBook({
        type: "add-books",
        setupBook: { isbn: "222", name: "Book Two" },
      });
    });
    act(() => {
      result.current.updateBook({ type: "remove-book", isbn: "111" });
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books?.[0].isbn).toBe("222");
  });

  it("remove-book on an empty list returns an empty array", () => {
    const { result } = renderHook(() => useBookWizard());

    act(() => {
      result.current.updateBook({ type: "remove-book", isbn: "111" });
    });

    expect(result.current.books).toEqual([]);
  });

  it("default action resets books to undefined", () => {
    const { result } = renderHook(() => useBookWizard());

    act(() => {
      result.current.updateBook({
        type: "add-books",
        setupBook: { isbn: "111", name: "Book One" },
      });
    });
    act(() => {
      result.current.updateBook({ type: "default" });
    });

    expect(result.current.books).toBeUndefined();
  });
});
