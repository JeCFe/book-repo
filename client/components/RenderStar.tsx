import { cva } from "class-variance-authority";
import { useId, useState } from "react";

const star = cva("text-lg", {
  variants: {
    showColour: {
      true: "text-yellow-500",
      false: "text-white",
    },
    hover: {
      true: "cursor-pointer ",
      false: "",
    },
  },
});

const starContainer = cva("flex flex-row items-center space-x-1", {
  variants: {
    hover: {
      true: "cursor-pointer",
      false: "",
    },
  },
});

type Props = {
  amountOfStars?: number;
  ranking?: number;
  allowHover?: boolean;
  onChange?: (value: number) => void;
  className?: string;
};

export function RenderStar({
  ranking,
  className,
  onChange = () => {},
  amountOfStars = 5,
  allowHover = false,
}: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | undefined>();
  const id = useId();
  return (
    <div className={starContainer({ hover: allowHover, className })}>
      {[...Array(amountOfStars)].map((_, index) => {
        const currentRating = index + 1;

        return (
          <label key={`${id}-${index}`}>
            <input
              className="appearance-none"
              type="radio"
              name="rating"
              value={currentRating}
              onChange={() => onChange(currentRating)}
            />
            <span
              className={star({
                showColour:
                  currentRating <=
                  ((allowHover && hoverIndex) || (ranking ?? 0)),
                hover: allowHover,
              })}
              onMouseEnter={() => setHoverIndex(currentRating)}
              onMouseLeave={() => setHoverIndex(undefined)}
            >
              &#9733;
            </span>
          </label>
        );
      })}
    </div>
  );
}
