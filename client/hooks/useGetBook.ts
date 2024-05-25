import { getApiClient } from "@/services";
import useSWR from "swr";

const getBook = getApiClient().path("/book/{isbn}").method("get").create();

export const useGetBook = (isbn?: string) => {
  const key = isbn ? `getBook/${isbn}` : undefined;
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => (await getBook({ isbn: isbn as string })).data,
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
