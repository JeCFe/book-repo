import { getApiClient } from "@/services";
import useSWR from "swr";

const getBookshelfSummary = getApiClient()
  .path("/bookshelf/summary/{customerId}")
  .method("get")
  .create();

export const useGetBookshelfSummary = (customerId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    "getCustomerSummary",
    async () => {
      try {
        return (await getBookshelfSummary({ customerId })).data as unknown as {
          id: string;
          name: string;
        }[];
      } catch (error) {
        throw error;
      }
    },
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
