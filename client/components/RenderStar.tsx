import { cva } from "class-variance-authority";
import { useId, useState } from "react";

const star = cva("cursor-pointer text-lg", {
  variants: {
    showColour: {
      true: "text-yellow-500",
      false: "text-white",
    },
  },
});

type Props = {
  amountOfStars?: number;
  ranking: number;
  onChange: (value: number) => void;
};

export function RenderStar({ ranking, onChange, amountOfStars = 5 }: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | undefined>();
  const id = useId();
  return (
    <div className="flex cursor-pointer flex-row items-center space-x-1">
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
                showColour: currentRating <= (hoverIndex || ranking),
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
