import {
  Alerter,
  AvidReviewer,
  BetaTester,
  BookAddict,
  Commentor,
  Contributor,
  GoalScorer,
  GoalSetter,
  Sharing,
  Sponsor,
} from "@/assets";
import { Accordion } from "@/components";
import { Trophy } from "@/types";
import { ReactNode } from "react";

export default function Trophies({ trophies }: { trophies: Trophy[] | null }) {
  const getTrophy = (x: Trophy): ReactNode => {
    const className = "w-24 md:w-36";
    switch (x.type) {
      case "beta-tester":
        return <BetaTester className={className} />;
      case "alerter":
        return <Alerter className={className} />;
      case "avid-reviewer":
        return <AvidReviewer className={className} />;
      case "book-addict":
        return <BookAddict className={className} />;
      case "commentator":
        return <Commentor className={className} />;
      case "contributor":
        return <Contributor className={className} />;
      case "goal-scored":
        return <GoalScorer className={className} />;
      case "goal-setter":
        return <GoalSetter className={className} />;
      case "sharing-is-caring":
        return <Sharing className={className} />;
      case "sponsor":
        return <Sponsor className={className} />;
    }
  };
  return (
    <>
      {trophies && (
        <Accordion title="Trophies" sideStyle={false} containerSize="max">
          <span className="flex space-x-4">
            {trophies.map((x) => (
              <div key={x.type}>{getTrophy(x)}</div>
            ))}
          </span>
        </Accordion>
      )}
    </>
  );
}
