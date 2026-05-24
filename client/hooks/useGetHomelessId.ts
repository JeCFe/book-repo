import { getApiClient } from "@/services";
import useSWR from "swr";

const getHomelessId = getApiClient()
  .path("/bookshelf/homeless/{customerId}")
  .method("get")
  .create();

export const useGetHomelessId = (customerId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `getHomelessId/${customerId}`,
    async () =>
      (await getHomelessId({ customerId })).data as unknown as {
        id: string;
        name: string;
      }[],
    {
      refreshInterval: 120000,
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
