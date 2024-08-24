import { SearchResponse } from "@/hooks";

export const filterBooks = (
  works: SearchResponse,
  alreadyAddedIsbn: Set<string>,
) =>
  works.docs.map((work) => ({
    ...work,
    editions: {
      ...work.editions,
      docs: work.editions.docs.map((doc) => ({
        ...doc,
        isbn: doc.isbn?.filter((isbn) => !alreadyAddedIsbn.has(isbn)) ?? [],
      })),
    },
  }));
