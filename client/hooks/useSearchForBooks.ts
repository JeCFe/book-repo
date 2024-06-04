import useSWR from "swr";

export type SearchResponse = {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: Works[];
  num_found: number;
  q: string;
};

export type Works = {
  author_name: string[];
  key: string;
  title: string;
  editions: Editions;
};

export type Editions = {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: EditionDoc[];
};

export type EditionDoc = {
  key: string;
  title: string;
  language?: string[];
  isbn?: string[];
};

const url = (search: string) =>
  `https://openlibrary.org/search.json?q=${encodeURIComponent(search)}&fields=key,title,author_name,editions,editions.key,editions.title,editions.isbn,editions.language&limit=20&lang=en`
    .replaceAll("%20", "+")
    .replaceAll("%2520", "\\+");

export const useSearchForBooks = (search: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    url(search),
    async () => (await fetch(url(search))).json(),
    {
      refreshInterval: 100,
      onErrorRetry: (error) => {
        if (error.status === 404) return;
      },
    },
  );
  console.log(url(search).replaceAll("%20", "\\+").replaceAll("%2520", "+"));
  return {
    data: data as SearchResponse, // Will need schema validation for patter / type matching
    error,
    isLoading,
    mutate,
  };
};
