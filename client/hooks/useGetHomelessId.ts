import { getApiClient } from "@/services";
import useSWR from "swr";

const getHomelessId = getApiClient()
  .path("/bookshelf/homeless/{customerId}")
  .method("get")
  .create();

export const useGetHomelessId = (customerId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    "getHomelessId",
    async () => {
      try {
        return (await getHomelessId({ customerId })).data as unknown as {
          id: string;
          name: string;
        }[];
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
