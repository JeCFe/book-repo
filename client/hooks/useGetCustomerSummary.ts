import { getApiClient } from "@/services";
import useSWR from "swr";

const getCustomerSummary = getApiClient()
  .path("/customer/get-customer-summary")
  .method("get")
  .create();

export const useGetCustomerSummary = () => {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    "getCustomerSummary",
    async () => (await getCustomerSummary({})).data,
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
    isValidating,
    mutate,
  };
};
