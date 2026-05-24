import { filterBooks } from "./filter-books";
import type { SearchResponse } from "@/hooks";

const makeSearchResponse = (
  overrides: Partial<SearchResponse> = {},
): SearchResponse => ({
  numFound: 1,
  start: 0,
  numFoundExact: true,
  num_found: 1,
  q: "test",
  docs: [],
  ...overrides,
});

describe("filterBooks", () => {
  it("returns all ISBNs when none are in the already-added set", () => {
    const response = makeSearchResponse({
      docs: [
        {
          key: "/works/OL1W",
          title: "Test Book",
          author_name: ["Author One"],
          editions: {
            numFound: 1,
            start: 0,
            numFoundExact: true,
            docs: [{ key: "/books/OL1M", title: "Edition 1", isbn: ["111", "222"] }],
          },
        },
      ],
    });

    const result = filterBooks(response, new Set());
    expect(result[0].editions.docs[0].isbn).toEqual(["111", "222"]);
  });

  it("filters out ISBNs that are already added", () => {
    const response = makeSearchResponse({
      docs: [
        {
          key: "/works/OL1W",
          title: "Test Book",
          author_name: ["Author One"],
          editions: {
            numFound: 1,
            start: 0,
            numFoundExact: true,
            docs: [{ key: "/books/OL1M", title: "Edition 1", isbn: ["111", "222", "333"] }],
          },
        },
      ],
    });

    const result = filterBooks(response, new Set(["111", "333"]));
    expect(result[0].editions.docs[0].isbn).toEqual(["222"]);
  });

  it("returns an empty isbn array when all ISBNs are already added", () => {
    const response = makeSearchResponse({
      docs: [
        {
          key: "/works/OL1W",
          title: "Test Book",
          author_name: [],
          editions: {
            numFound: 1,
            start: 0,
            numFoundExact: true,
            docs: [{ key: "/books/OL1M", title: "Edition 1", isbn: ["111", "222"] }],
          },
        },
      ],
    });

    const result = filterBooks(response, new Set(["111", "222"]));
    expect(result[0].editions.docs[0].isbn).toEqual([]);
  });

  it("returns an empty isbn array when the edition has no ISBNs", () => {
    const response = makeSearchResponse({
      docs: [
        {
          key: "/works/OL1W",
          title: "Test Book",
          author_name: [],
          editions: {
            numFound: 1,
            start: 0,
            numFoundExact: true,
            docs: [{ key: "/books/OL1M", title: "Edition 1" }],
          },
        },
      ],
    });

    const result = filterBooks(response, new Set(["111"]));
    expect(result[0].editions.docs[0].isbn).toEqual([]);
  });

  it("does not mutate the original response", () => {
    const response = makeSearchResponse({
      docs: [
        {
          key: "/works/OL1W",
          title: "Test Book",
          author_name: [],
          editions: {
            numFound: 1,
            start: 0,
            numFoundExact: true,
            docs: [{ key: "/books/OL1M", title: "Edition 1", isbn: ["111", "222"] }],
          },
        },
      ],
    });

    filterBooks(response, new Set(["111"]));
    expect(response.docs[0].editions.docs[0].isbn).toEqual(["111", "222"]);
  });
});
