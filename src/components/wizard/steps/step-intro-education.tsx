import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type IntroStepProps = {
  icon: ReactNode;
  cta?: {
    label: string;
    onClick: () => void;
  };
  points: string[];
};

export function StepIntroEducation({ icon, points, cta }: IntroStepProps) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-6">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <ul className="flex flex-col gap-2 text-zinc-600">
        {points.map((point) => (
          <li key={point} className="flex items-center justify-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            {point}
          </li>
        ))}
      </ul>
      {cta && <Button className={"bg-primary-gradient"} size={"lg"} onClick={cta.onClick}>{cta.label}</Button>}
    </div>
  );
}
