import { getApiClient } from "@/services";
import useSWR from "swr";

const getBookshelfSummary = getApiClient()
  .path("/bookshelf/summary/{customerId}")
  .method("get")
  .create();

export const useGetBookshelfSummary = (customerId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `getBookshelfSummary/${customerId}`,
    async () =>
      (await getBookshelfSummary({ customerId })).data as unknown as {
        id: string;
        name: string;
      }[],
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
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
