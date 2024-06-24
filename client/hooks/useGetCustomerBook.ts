import { getApiClient } from "@/services";
import useSWR from "swr";

const getCustomerBook = getApiClient()
  .path("/customer/{customerId}/{customerBookId}")
  .method("get")
  .create();

export const useGetCustomerBook = (
  customerid: string,
  customerBookId: string,
) => {
  const key = customerBookId ? `getCustomerBook/${customerBookId}` : undefined;
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () =>
      (
        await getCustomerBook({
          customerId: customerid,
          customerBookId: customerBookId,
        })
      ).data,
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
