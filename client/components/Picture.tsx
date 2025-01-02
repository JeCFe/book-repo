import { Spinner } from "@jecfe/react-design-system";
import { VariantProps, cva } from "class-variance-authority";
import Image from "next/image";

const picture = cva("flex items-center justify-center rounded shadow-2xl", {
  variants: {
    size: {
      xLarge:
        "md:max-w-[320px] md:max-h-[426.67px] md:min-w-[320px] md:min-h-[426.67px] max-w-[192px] max-h-[256px] min-w-[192px] min-h-[256px]",
      large: "max-w-[192px] max-h-[256px] min-w-[192px] min-h-[256px]",
      medium: "max-w-[96px] max-h-[128px] min-w-[96px] min-h-[128px]",
    },
  },
});

type Props = {
  pictureUrl?: string;
  title: string;
  loading?: boolean;
  width?: number;
  height?: number;
} & VariantProps<typeof picture>;

export function Picture({
  pictureUrl,
  title,
  loading,
  size,
  width = 256,
  height = 192,
}: Props) {
  return (
    <>
      {loading && (
        <div className="flex items-center justify-center rounded  shadow-2xl md:min-h-[256px] md:min-w-[192px]">
          <Spinner className="flex" fast={loading} />
        </div>
      )}

      {!loading && pictureUrl && (
        <Image
          alt={title}
          src={pictureUrl}
          width={width}
          height={height}
          className={picture({ size })}
        />
      )}
      {!loading && !pictureUrl && (
        <div className="flex h-[256px] w-[192px] items-center justify-center rounded  bg-slate-400/50 shadow-2xl">
          <div className="flex justify-center px-2 text-center">{`Book cover unavailable`}</div>
        </div>
      )}
    </>
  );
}
