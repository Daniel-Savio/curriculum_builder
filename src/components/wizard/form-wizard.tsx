import { useEffect, type ComponentType } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { StepIndicator } from "./step-indicator";
import { WizardNavButtons } from "./wizard-nav-buttons";
import {
  createEmptyResume,
  createFilledResume,
  //createEmptyExperience,
  //createEmptyEducation,
  resumeSchema,
  type ResumeFormData,
} from "@/lib/resume-schema";
import { StepPersonalInfo } from "./steps/step-personal-info";
import { StepContact } from "./steps/step-contact";
import { StepExperience } from "./steps/step-experience";
import { StepEducation } from "./steps/step-education";
import { StepEducationDescriptions } from "./steps/step-education-description";
import { ArticleMediumIcon, GraduationCapIcon, ToolboxIcon, UserIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SuitcaseIcon } from "@phosphor-icons/react/dist/ssr";
import { StepExperienceDescriptions } from "./steps/step-experience-description";
import { StepIntro } from "./steps/step-intro";
import { StepSkills } from "./steps/step-skills";
import { StepGeneralDescription } from "./steps/step-general-description";
import { pdf } from "@react-pdf/renderer";
import { ResumePDF } from "@/pdf/pdf-resume";
import { useResumeWizardStore } from "@/stores/resume-wizard-store";



type Step = {
  id: string;
  title: string;
  description: string;
  fields: (keyof ResumeFormData)[];
  // Remove "| Element" and add "<any>"
  Component: ComponentType<unknown>;
  showInIndicator?: boolean;
};


type FormWizardProps = {
  onExit: () => void;
};

export function FormWizard({ onExit }: FormWizardProps) {
  const stepIndex = useResumeWizardStore((s) => s.stepIndex);
  const setStepIndex = useResumeWizardStore((s) => s.setStepIndex);
  const next = useResumeWizardStore((s) => s.next);

  // Sempre começa do zero ao montar — o store vive fora do componente, mas o
  // formulário (react-hook-form) reseta a cada montagem, então a etapa
  // precisa acompanhar.
  useEffect(() => {
    setStepIndex(0);
  }, [setStepIndex]);

  const steps: Step[] = [
    {
      id: "intro-personal",
      title: "Informações individuais",
      description:
        "Coloque algumas informações sobre vocês para que os empregadores possam entrar em contato diretamente contigo!",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<UserIcon size={28} weight="bold" />}
          points={["Seu nome", "Objetivo ou cargo que deseja", "Informações para contato"]}

        />
      ),
    },
    {
      id: "personal",
      title: "Sobre você",
      description: "Vamos começar com o básico.",
      fields: ["fullName", "role"],
      Component: StepPersonalInfo,
      showInIndicator: false,
    },
    {
      id: "contact",
      title: "Como te encontrar",
      description: "Assim os empregadores conseguem entrar em contato.",
      fields: ["email", "phone"],
      Component: StepContact,
      showInIndicator: false,
    },
    // Experience Steps
    {
      id: "intro-experience",
      title: "Informações profissionais",
      description:
        "Conta para gente no que já trabalhou, seja por conta ou em alguma empresa.Sua experiência de trabalho é sempre bem vinda",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<SuitcaseIcon size={28} weight="bold" />}
          points={["Empresas que trabalhou", "Projetos que participou", "Conhecimentos adquiridos"]}

        />
      ),
    },
    {
      id: "experience",
      title: "Sua experiência",
      description: "Uma DICA, comece do mais recente para o mais antigo.",
      fields: ["experiences"],
      Component: StepExperience,
      showInIndicator: false,
    },
    {
      id: "experience-details",
      title: "Detalhe um pouco  cada experiência que colocou",
      description: "Passe por cada uma e descreva o que você fazia.",
      fields: ["experiences"],
      Component: StepExperienceDescriptions,
      showInIndicator: false,
    },
    // Education Steps
    {
      id: "intro-education",
      title: "Formação acadêmica",
      description: "Agora, conta pra gente sobre sua formação escolar e acadêmica ou até mesmo um curso que tenha feito. Se não tiver, fica tranquilo, não precisa preencher.",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<GraduationCapIcon size={28} weight="bold" />}
          points={[]}
          cta={{ label: "Pular esta etapa", onClick: () => setStepIndex(8) }}
        />
      ),
    },
    {
      id: "education",
      title: "Sua formação",
      description: "Conte sobre escolas, cursos e faculdades.",
      fields: ["educations"],
      Component: StepEducation,
      showInIndicator: false,
    },
    {
      id: "education-details",
      title: "Detalhe cada formação",
      description: "Passe por cada uma e descreva o que você aprendeu.",
      fields: ["educations"],
      Component: StepEducationDescriptions,
      showInIndicator: false,
    },
    // Skills Steps
    {
      id: "skills-intro",
      title: "Habilidades",
      description: "Use essa área para enumerar suas habilidades, competências, experiências com tarefas e projetos que você se considera bom! Caso não queira preencher, fica tranquilo, pode pular esta etapa!",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<ToolboxIcon size={28} weight="bold" />}
          points={["Idiomas", "Ferramentas que sabe usar", "Experiências", "Softwares que sabe usar"]}
          cta={{ label: "Pular esta etapa", onClick: () => setStepIndex(10) }}
        />
      ),
    },
    {
      id: "skills",
      title: "Habilidades",
      description: "Aqui pode colocar desde máquinas que sabe operar, serviços que consegue prestar, idiomas que sabe falar e softwares que sabe usar, etc",
      fields: ["skills"],
      Component: StepSkills,
      showInIndicator: false,
    },
    // General Description Step
    {
      id: "general-description",
      title: "Descrição Geral",
      description: "Agora que você já passou pela sua trajetória, escreva aqui uma descrição geral sobre você e sua experiência profissional, acadêmica e no que você se encaixa para .",
      fields: ["generalDescription"],
      Component: StepGeneralDescription,
      showInIndicator: false,
    },
    {
      id: "end",
      title: "Concluir",
      description: "Parabéns, agora já temos o suficiente para gerar seu currículo!!!",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<ArticleMediumIcon size={32} weight="bold" />}
          points={[]}
          cta={{ label: "Gerar currículo", onClick: () => handleNext() }}
        />
      ),
    },
  ];

  const methods = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    mode: "onBlur",
    defaultValues: createEmptyResume(),
  });

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const StepComponent = currentStep.Component;

  // Agrupa o array COMPLETO de steps em seções: cada step com
  // showInIndicator !== false abre uma seção nova (vira um círculo
  // numerado); todo step depois dele, até a próxima seção, entra como
  // sub-etapa (vira um traço no trilho tracejado dessa seção).
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
    // valida só os campos da etapa atual, não o form inteiro
    const isStepValid = await methods.trigger(currentStep.fields);
    if (!isStepValid) return;

    if (isLastStep) {
      methods.handleSubmit(onSubmit)();
      return;
    }
    next(steps.length);
  }

  async function onSubmit(data: ResumeFormData) {
    // aqui entra a montagem do PDF a partir dos dados já validados
    try {
      // 1. Generate the PDF Blob
      const blob = await pdf(<ResumePDF data={data} />).toBlob();

      // 2. Create an object URL for the Blob
      const url = URL.createObjectURL(blob);

      // 3. Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

      // 4. Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();

      // Small delay to ensure the browser registers the click before cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      console.log("PDF generated successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  }

  return (
    <FormProvider {...methods}>
      <section
        id="questions-form"
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

        {/* HEADER: Step Indicator (Fixed at the top) */}
        <div className="shrink-0">
          <StepIndicator sections={sections} useStepStore={useResumeWizardStore} />
        </div>

        {/* BODY: Takes up all available vertical space */}
        {/* min-h-0 is crucial here, otherwise flex children will stretch beyond the container */}
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
              {/* Title & Description (Fixed above the scrollable area) */}
              <div className="shrink-0">
                <h2 className="text-2xl font-bold text-zinc-800 mb-1">
                  {currentStep.title}
                </h2>
                <p className="text-zinc-600 mb-4">{currentStep.description}</p>
              </div>

              {/* Step Component — scrolls if it overflows, otherwise the single
                  field/step sits centered instead of glued to the top.
                  `safe center` falls back to top-aligned once content
                  overflows, so buttons above the fold don't get hidden. */}
              <div className="flex-1 overflow-y-auto pr-2 pb-4 flex flex-col [justify-content:safe_center]">
                <StepComponent />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FOOTER: Buttons (Fixed at the bottom) */}
        <WizardNavButtons
          useStepStore={useResumeWizardStore}
          totalSteps={steps.length}
          onNext={handleNext}
          onFillSample={() => methods.reset(createFilledResume())}
        />
      </section>
    </FormProvider>
  );
}
