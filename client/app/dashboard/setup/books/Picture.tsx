import { useGetOpenLibraryCover } from "@/hooks";
import { Spinner } from "@jecfe/react-design-system";
import Image from "next/image";

export function Picture({
  pictureUrl,
  title,
}: {
  pictureUrl: string;
  title: string;
}) {
  const { image, loading } = useGetOpenLibraryCover(pictureUrl);

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center rounded border border-cyan-500 shadow-2xl md:min-h-[256px] md:min-w-[192px]">
          <Spinner className="flex" />
        </div>
      )}

      {!loading && image && (
        <Image
          alt={title}
          src={image}
          width={192}
          height={256}
          className="flex items-center justify-center rounded border-2 border-cyan-500 shadow-2xl md:min-h-[256px] md:min-w-[192px]"
        />
      )}
      {!loading && !image && (
        <div className="flex h-[256px] w-[192px] items-center justify-center rounded border-2 border-cyan-500 shadow-2xl">
          <div>{`Image not found :(`}</div>
        </div>
      )}
    </>
  );
}
