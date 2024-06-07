import { getApiClient } from "@/services";
import useSWR from "swr";

const getBookshelfSummary = getApiClient()
  .path("/bookshelf/{bookshelfId}/{customerId}")
  .method("get")
  .create();

export const useGetBookshelfSummary = (
  customerId: string,
  bookshelfId: string,
) => {
  const { data, error, isLoading, mutate } = useSWR(
    "getCustomerSummary",
    async () => {
      try {
        return (await getBookshelfSummary({ customerId, bookshelfId })).data;
      } catch (error) {
        throw error;
      }
    },
    {
      refreshInterval: 10000,
    },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
