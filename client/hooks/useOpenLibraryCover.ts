import useSWR from "swr";

export const useGetOpenLibraryCover = (pictureUrl: string) => {
  const { data, error, isLoading } = useSWR(pictureUrl, async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const blob = await response.blob();
    if (blob.type === "") {
      return undefined;
    }
    return URL.createObjectURL(blob);
  });

  return { image: data, loading: isLoading, error };
};
