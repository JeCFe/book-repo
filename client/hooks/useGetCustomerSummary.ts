import { getApiClient } from "@/services";
import useSWR from "swr";

const getCustomerSummary = getApiClient()
  .path("/customer/get-customer-summary")
  .method("get")
  .create();

export const useGetCustomerSummary = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "getCustomerSummary",
    async () => {
      try {
        return (await getCustomerSummary({})).data;
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
