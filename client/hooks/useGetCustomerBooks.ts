import { getApiClient } from "@/services";
import useSWR from "swr";

const getCustomerBooks = getApiClient()
  .path("/customer/books")
  .method("get")
  .create();

export const useGetCustomerBooks = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "getCustomerBooks",
    async () => (await getCustomerBooks({})).data,
    {
      refreshInterval: 60000,
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
