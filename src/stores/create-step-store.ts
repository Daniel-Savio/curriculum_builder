import { create } from "zustand";

// Controle de navegação (etapa atual) de um wizard, isolado dos dados do
// formulário em si (que continuam no react-hook-form). Vive fora da árvore
// de componentes do wizard, então qualquer coisa pode ler ou mudar a etapa.
export type StepStore = {
  stepIndex: number;
  setStepIndex: (index: number) => void;
  next: (totalSteps: number) => void;
  back: () => void;
};

export function createStepStore() {
  return create<StepStore>((set) => ({
    stepIndex: 0,
    setStepIndex: (index) => set({ stepIndex: index }),
    next: (totalSteps) =>
      set((state) => ({
        stepIndex: Math.min(state.stepIndex + 1, totalSteps - 1),
      })),
    back: () => set((state) => ({ stepIndex: Math.max(0, state.stepIndex - 1) })),
  }));
}
