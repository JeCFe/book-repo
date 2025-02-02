import { getApiClient } from "@/services";
import useSWR from "swr";

const getCustomerSummary = getApiClient()
  .path("/customer/get-customer-summary")
  .method("get")
  .create();

export const useGetCustomerSummary = () => {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    "getCustomerSummary",
    async () => {
      try {
        return (await getCustomerSummary({})).data;
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
    isValidating,
    mutate,
  };
};
