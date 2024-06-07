import { getApiClient } from "@/services";
import useSWR from "swr";

const getBookshelf = getApiClient()
  .path("/bookshelf/{bookshelfId}")
  .method("get")
  .create();

export const useGetBookshelf = (bookshelfId?: string) => {
  const key = bookshelfId ? `getBookshelf/${bookshelfId}` : undefined;
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () =>
      (await getBookshelf({ bookshelfId: bookshelfId as string })).data,
    {
      refreshInterval: 10000,
      onErrorRetry: (error) => {
        if (error.status === 404) return;
      },
    },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
