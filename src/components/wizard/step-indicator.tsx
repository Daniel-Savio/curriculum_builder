import { motion } from "framer-motion";

type StepIndicatorProps = {
  current: number; // índice
  total: number;
  setStepByIndex: (index: number) => void;
};


export function StepIndicator({ current, total, setStepByIndex }: StepIndicatorProps) {
  return (
    <div className="absolute -top-4 left-6 flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < current;
        const isActive = i === current;

        return (
          <motion.span
            key={i}
            initial={false}
            animate={{ scale: isActive ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => setStepByIndex(i)}
            className={[
              "cursor-pointer flex size-9 items-center justify-center rounded-full text-sm font-bold shadow-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : isDone
                ? "bg-p-success text-zinc-900"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {i + 1}
          </motion.span>
        );
      })}
    </div>
  );
}
