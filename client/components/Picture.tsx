import { Spinner } from "@jecfe/react-design-system";
import Image from "next/image";

export function Picture({
  pictureUrl,
  title,
  loading,
  width = 256,
  height = 192,
}: {
  pictureUrl?: string;
  title: string;
  loading?: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <>
      {loading && (
        <div className="flex items-center justify-center rounded border border-cyan-500 shadow-2xl md:min-h-[256px] md:min-w-[192px]">
          <Spinner className="flex" fast={loading} />
        </div>
      )}

      {!loading && pictureUrl && (
        <Image
          alt={title}
          src={pictureUrl}
          width={192}
          height={256}
          className={`flex min-h-[${height}px] items-center justify-center rounded border-2 border-cyan-500 shadow-2xl w-[${width}px]`}
        />
      )}
      {!loading && !pictureUrl && (
        <div className="flex h-[256px] w-[192px] items-center justify-center rounded border-2 border-cyan-500 bg-slate-400/50 shadow-2xl">
          <div className="flex justify-center px-2 text-center">{`Book cover unavailable`}</div>
        </div>
      )}
    </>
  );
}
