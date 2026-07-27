import type { StoreApi, UseBoundStore } from "zustand";
import { ArrowLeftIcon, FlaskIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { StepStore } from "@/stores/create-step-store";

// "Voltar" nunca precisa validar nada, então mexe direto no store. "Próximo"
// continua delegando pro wizard: só ele conhece o react-hook-form e sabe
// quais campos validar antes de avançar a etapa.
type WizardNavButtonsProps = {
  useStepStore: UseBoundStore<StoreApi<StepStore>>;
  totalSteps: number;
  onNext: () => void;
  nextLabel?: string;
  // Só aparece em dev (import.meta.env.DEV) — preenche o formulário com
  // dados de exemplo pra facilitar testar a usabilidade sem digitar tudo.
  onFillSample?: () => void;
};

export function WizardNavButtons({
  useStepStore,
  totalSteps,
  onNext,
  nextLabel = "Próximo",
  onFillSample,
}: WizardNavButtonsProps) {
  const stepIndex = useStepStore((s) => s.stepIndex);
  const back = useStepStore((s) => s.back);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

  return (
    <div className="shrink-0 flex items-center justify-between pt-4 mt-2 border-t border-zinc-100">
      <Button type="button" variant="ghost" onClick={back} disabled={isFirstStep}>
        <ArrowLeftIcon size={18} weight="bold" />
        Voltar
      </Button>

      {import.meta.env.DEV && onFillSample && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onFillSample}
          className="gap-1.5 text-xs text-muted-foreground"
        >
          <FlaskIcon size={14} weight="bold" />
          Preencher exemplo
        </Button>
      )}

      <Button hidden={isLastStep} type="button" onClick={onNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
