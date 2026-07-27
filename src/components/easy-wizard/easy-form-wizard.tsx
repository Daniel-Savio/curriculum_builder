import { useEffect, type ComponentType } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { StepIndicator } from "@/components/wizard/step-indicator";
import { WizardNavButtons } from "@/components/wizard/wizard-nav-buttons";
import { StepIntro } from "@/components/wizard/steps/step-intro";
import { Button } from "@/components/ui/button";
import {
  createEmptyEasyResume,
  createFilledEasyResume,
  easyResumeSchema,
  type EasyResumeFormData,
} from "@/lib/easy-resume-schema";
import { StepSingleField } from "./steps/step-single-field";
import { StepPhone } from "./steps/step-phone";
import { StepEasyHighlights } from "./steps/step-easy-highlights";
import { StepEasySkills } from "./steps/step-easy-skills";
import {
  ArticleMediumIcon,
  SuitcaseIcon,
  ToolboxIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react";
import { pdf } from "@react-pdf/renderer";
import { EasyResumePDF } from "@/pdf/pdf-easy-resume";
import { useEasyResumeWizardStore } from "@/stores/easy-resume-wizard-store";

type Step = {
  id: string;
  title: string;
  description: string;
  fields: (keyof EasyResumeFormData)[];
  Component: ComponentType<unknown>;
  showInIndicator?: boolean;
};

type EasyFormWizardProps = {
  onExit: () => void;
};

export function EasyFormWizard({ onExit }: EasyFormWizardProps) {
  const stepIndex = useEasyResumeWizardStore((s) => s.stepIndex);
  const setStepIndex = useEasyResumeWizardStore((s) => s.setStepIndex);
  const next = useEasyResumeWizardStore((s) => s.next);

  // Sempre começa do zero ao montar — o store vive fora do componente, mas o
  // formulário (react-hook-form) reseta a cada montagem, então a etapa
  // precisa acompanhar.
  useEffect(() => {
    setStepIndex(0);
  }, [setStepIndex]);

  const steps: Step[] = [
    {
      id: "intro",
      title: "Vamos fazer seu currículo",
      description:
        "É bem simples: vamos fazer algumas perguntas, uma de cada vez. Se não souber alguma resposta, pode deixar em branco e seguir em frente.",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<UserIcon size={28} weight="bold" />}
          points={[
            "Uma pergunta de cada vez",
            "Pode pular o que não quiser responder",
            "No final, você recebe um PDF pronto",
          ]}
        />
      ),
    },
    {
      id: "name",
      title: "Qual é o seu nome completo?",
      description: "",
      fields: ["fullName"],
      showInIndicator: false,
      Component: () => (
        <StepSingleField
          name="fullName"
          label="Nome completo"
          placeholder="Digite seu nome"
        />
      ),
    },
    {
      id: "phone",
      title: "Qual é o seu telefone?",
      description: "Assim quem for te chamar para trabalhar consegue te ligar.",
      fields: [
        "phone",
        "hasNoPhone",
        "alternateContactName",
        "alternateContactPhone",
      ],
      showInIndicator: false,
      Component: StepPhone,
    },
    {
      id: "city",
      title: "Em qual cidade você mora?",
      description: "",
      fields: ["city"],
      showInIndicator: false,
      Component: () => (
        <StepSingleField name="city" label="Cidade" placeholder="Ex: Piracaia" />
      ),
    },
    {
      id: "role",
      title: "O que você gostaria de trabalhar?",
      description: "Se ainda não souber, pode deixar em branco.",
      fields: ["role"],
      showInIndicator: false,
      Component: () => (
        <StepSingleField
          name="role"
          label="Área ou cargo (opcional)"
          placeholder="Ex: Faxineira, Pedreiro, Cuidador de idosos"
        />
      ),
    },
    {
      id: "intro-highlights",
      title: "Trabalhos, cursos e escola",
      description:
        "Conte um pouco sobre os trabalhos que já teve, cursos que fez ou sua escola. Tudo entra aqui, não precisa ser muito detalhado.",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<SuitcaseIcon size={28} weight="bold" />}
          points={["Trabalhos que já teve", "Cursos que fez", "Escola ou faculdade"]}
          cta={{ label: "Pular esta etapa", onClick: () => setStepIndex(7) }}
        />
      ),
    },
    {
      id: "highlights",
      title: "Conte um pouco sobre você",
      description: "Adicione quantos quiser, um de cada vez.",
      fields: ["highlights"],
      showInIndicator: false,
      Component: StepEasyHighlights,
    },
    {
      id: "intro-skills",
      title: "Habilidades",
      description:
        "Alguma coisa que você sabe fazer bem? Pode ser um idioma, uma máquina, uma ferramenta ou um programa de computador.",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<ToolboxIcon size={28} weight="bold" />}
          points={["Idiomas", "Máquinas ou ferramentas", "Programas de computador"]}
          cta={{ label: "Pular esta etapa", onClick: () => setStepIndex(9) }}
        />
      ),
    },
    {
      id: "skills",
      title: "Suas habilidades",
      description: "Adicione quantas quiser.",
      fields: ["skills"],
      showInIndicator: false,
      Component: StepEasySkills,
    },
    {
      id: "description",
      title: "Quer contar mais alguma coisa?",
      description: "Esse espaço é opcional, pode deixar em branco se preferir.",
      fields: ["generalDescription"],
      showInIndicator: false,
      Component: () => (
        <StepSingleField
          name="generalDescription"
          label="Sobre você (opcional)"
          placeholder="Escreva um pouco sobre você, se quiser"
          as="textarea"
        />
      ),
    },
    {
      id: "end",
      title: "Pronto!",
      description: "Já temos tudo que precisamos para gerar o seu currículo.",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<ArticleMediumIcon size={32} weight="bold" />}
          points={[]}
          cta={{ label: "Gerar meu currículo", onClick: () => handleNext() }}
        />
      ),
    },
  ];

  const methods = useForm<EasyResumeFormData>({
    resolver: zodResolver(easyResumeSchema),
    mode: "onBlur",
    defaultValues: createEmptyEasyResume(),
  });

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const StepComponent = currentStep.Component;

  const sections = steps.reduce<
    { introIndex: number; subStepIndices: number[] }[]
  >((acc, step, i) => {
    if (step.showInIndicator !== false) {
      acc.push({ introIndex: i, subStepIndices: [] });
    } else if (acc.length > 0) {
      acc[acc.length - 1].subStepIndices.push(i);
    }
    return acc;
  }, []);

  async function handleNext() {
    const isStepValid = await methods.trigger(currentStep.fields);
    if (!isStepValid) return;

    if (isLastStep) {
      methods.handleSubmit(onSubmit)();
      return;
    }
    next(steps.length);
  }

  async function onSubmit(data: EasyResumeFormData) {
    try {
      const blob = await pdf(<EasyResumePDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.fullName.replace(/\s+/g, "_")}_Curriculo.pdf`;

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  }

  return (
    <FormProvider {...methods}>
      <section
        id="easy-questions-form"
        // Mobile: full-bleed, fills the screen like a native step flow. Desktop:
        // a card that hugs its content instead of forcing a fixed height —
        // max-h only kicks in (with scroll) for steps with a lot of fields.
        className="relative flex flex-col w-full sm:max-w-2xl min-h-[70dvh] sm:min-h-[420px] max-h-[92dvh] sm:max-h-[85dvh] sm:mt-16 rounded-none sm:rounded-2xl border-0 sm:border sm:border-border bg-card sm:shadow-md p-4 sm:p-8"
      >
        {/* Sai do formulário e volta pra tela inicial */}
        <div className="shrink-0 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="gap-1.5 text-muted-foreground"
          >
            <XIcon size={16} weight="bold" />
            Sair
          </Button>
        </div>

        <div className="shrink-0">
          <StepIndicator sections={sections} useStepStore={useEasyResumeWizardStore} />
        </div>

        <div className="flex-1 flex flex-col min-h-0 mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="shrink-0">
                <h2 className="text-2xl font-bold text-zinc-800 mb-1">
                  {currentStep.title}
                </h2>
                {currentStep.description && (
                  <p className="text-zinc-600 mb-4">{currentStep.description}</p>
                )}
              </div>

              {/* `safe center` falls back to top-aligned once content
                  overflows, so buttons above the fold don't get hidden. */}
              <div className="flex-1 overflow-y-auto pr-2 pb-4 flex flex-col [justify-content:safe_center]">
                <StepComponent />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <WizardNavButtons
          useStepStore={useEasyResumeWizardStore}
          totalSteps={steps.length}
          onNext={handleNext}
          onFillSample={() => methods.reset(createFilledEasyResume())}
        />
      </section>
    </FormProvider>
  );
}
