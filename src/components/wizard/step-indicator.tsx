import { motion } from "framer-motion";

export type IndicatorSection = {
  // Índice REAL (dentro do array completo de steps) do step de introdução
  // que representa essa seção.
  introIndex: number;
  // Índices REAIS das sub-etapas que pertencem a essa seção, na ordem em
  // que aparecem — é isso que vira o trilho tracejado depois do círculo.
  subStepIndices: number[];
};

type StepIndicatorProps = {
  sections: IndicatorSection[];
  // Índice REAL da etapa atual, dentro do array completo de steps.
  currentStepIndex: number;
  onNavigate: (index: number) => void;
};

type DashState = "done" | "active" | "pending";

function getSectionState(
  sectionIndex: number,
  currentSectionIndex: number,
): DashState {
  if (sectionIndex < currentSectionIndex) return "done";
  if (sectionIndex === currentSectionIndex) return "active";
  return "pending";
}

function getDashState(
  subStepIndex: number,
  currentStepIndex: number,
  sectionState: DashState,
): DashState {
  // Uma seção inteira já ficou pra trás — todo o trilho dela fica "cumprido".
  if (sectionState === "done") return "done";
  // Uma seção que ainda nem começou — trilho todo pendente, sem exceção.
  if (sectionState === "pending") return "pending";
  // Seção ativa: cada dash reflete se JÁ passamos daquele sub-step, estamos
  // nele agora, ou ainda vamos chegar lá.
  if (subStepIndex < currentStepIndex) return "done";
  if (subStepIndex === currentStepIndex) return "active";
  return "pending";
}

const CIRCLE_CLASSES: Record<DashState, string> = {
  done: "bg-p-success text-zinc-900",
  active: "bg-primary text-primary-foreground",
  pending: "bg-muted text-muted-foreground",
};

const DASH_CLASSES: Record<DashState, string> = {
  done: "bg-p-success",
  active: "bg-primary",
  pending: "bg-zinc-300",
};

export function StepIndicator({
  sections,
  currentStepIndex,
  onNavigate,
}: StepIndicatorProps) {
  // Qual seção "contém" a etapa atual — a última cujo introIndex já foi alcançado.
  const currentSectionIndex = sections.reduce(
    (acc, section, i) => (section.introIndex <= currentStepIndex ? i : acc),
    0,
  );

  return (
    <div className="absolute -top-4 left-6 right-6 flex items-center gap-1.5">
      {sections.map((section, sectionIndex) => {
        const sectionState = getSectionState(sectionIndex, currentSectionIndex);

        return (
          <div key={section.introIndex} className="flex items-center gap-1.5">
            <motion.span
              initial={false}
              animate={{ scale: sectionState === "active" ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
              onClick={() => onNavigate(section.introIndex)}
              className={[
                "cursor-pointer flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md transition-colors",
                CIRCLE_CLASSES[sectionState],
              ].join(" ")}
            >
              {sectionIndex + 1}
            </motion.span>

            {section.subStepIndices.map((subStepIndex) => {
              const dashState = getDashState(
                subStepIndex,
                currentStepIndex,
                sectionState,
              );

              return (
                <motion.span
                  key={subStepIndex}
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={[
                    "h-1.5 size-2 rounded-full transition-colors",
                    DASH_CLASSES[dashState],
                  ].join(" ")}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
